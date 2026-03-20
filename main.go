package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
)

//go:embed static/*
var staticFiles embed.FS

// Define the data structures for our API responses.
type nostrResponse struct {
	PrivHex string `json:"privHex"`
	PubHex  string `json:"pubHex"`
	NSec    string `json:"nsec"`
	NPub    string `json:"npub"`
}

type jwtResponse struct {
	Base64 string `json:"base64"`
	Hex    string `json:"hex"`
}

type sshResponse struct {
	PrivateKey string `json:"privateKey"`
	PublicKey  string `json:"publicKey"`
}

type hashRequest struct {
	Password string `json:"password"`
}

type hashResponse struct {
	PHC string `json:"phc"`
}

// securityHeaders is middleware that sets common security headers on every response.
func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "no-referrer")
		w.Header().Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r)
	})
}

// recoverer is middleware that catches panics and returns a 500 instead of crashing.
func recoverer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("panic recovered: %v", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()

	// 1. Define API Endpoints
	mux.HandleFunc("/api/nostr", apiNostrHandler)
	mux.HandleFunc("/api/jwt", apiJwtHandler)
	mux.HandleFunc("/api/ssh", apiSshHandler)
	mux.HandleFunc("/api/hash", apiHashHandler)

	// 2. Serve the Material You frontend from the embedded 'static' folder
	subFS, err := fs.Sub(staticFiles, "static")
	if err != nil {
		log.Fatal("Failed to load static files: ", err)
	}
	mux.Handle("/", http.FileServer(http.FS(subFS)))

	// 3. Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	handler := recoverer(securityHeaders(mux))

	fmt.Printf("Starting localkeys web interface on http://localhost:%s\n", port)
	fmt.Println("Press Ctrl+C to stop.")
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

// --- API Handlers ---

func apiNostrHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	privHex, pubHex, nsec, npub, err := generateNostr()
	if err != nil {
		log.Printf("nostr generation error: %v", err)
		http.Error(w, "Failed to generate Nostr keypair", http.StatusInternalServerError)
		return
	}

	resp := nostrResponse{
		PrivHex: privHex,
		PubHex:  pubHex,
		NSec:    nsec,
		NPub:    npub,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func apiJwtHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	b64, hexStr, err := generateJWT()
	if err != nil {
		log.Printf("jwt generation error: %v", err)
		http.Error(w, "Failed to generate JWT secret", http.StatusInternalServerError)
		return
	}

	resp := jwtResponse{
		Base64: b64,
		Hex:    hexStr,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func apiSshHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	privKey, pubKey, err := generateSSH()
	if err != nil {
		log.Printf("ssh generation error: %v", err)
		http.Error(w, "Failed to generate SSH keypair", http.StatusInternalServerError)
		return
	}

	resp := sshResponse{
		PrivateKey: privKey,
		PublicKey:  pubKey,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func apiHashHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req hashRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	phc, err := generateHash(req.Password)
	if err != nil {
		log.Printf("hash generation error: %v", err)
		http.Error(w, "Failed to generate hash", http.StatusInternalServerError)
		return
	}

	resp := hashResponse{
		PHC: phc,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}