package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
)

//go:embed static/*
var staticFiles embed.FS

// Define the data structures for our API responses
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

func main() {
	// 1. Define API Endpoints
	http.HandleFunc("/api/nostr", apiNostrHandler)
	http.HandleFunc("/api/jwt", apiJwtHandler)
	http.HandleFunc("/api/ssh", apiSshHandler)
	http.HandleFunc("/api/hash", apiHashHandler)

	// 2. Serve the Material You frontend from the embedded 'static' folder
	subFS, err := fs.Sub(staticFiles, "static")
	if err != nil {
		log.Fatal("Failed to load static files: ", err)
	}
	http.Handle("/", http.FileServer(http.FS(subFS)))

	// 3. Start the server
	port := "8080"
	fmt.Printf("Starting localkeys web interface on http://localhost:%s\n", port)
	fmt.Println("Press Ctrl+C to stop.")
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// --- API Handlers ---
// These handlers will call your existing cryptography functions once we update them
// to return strings instead of printing to the terminal.

func apiNostrHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Call your updated generateNostr() function here
	// For now, we return a placeholder response
	resp := nostrResponse{
		PrivHex: "...",
		PubHex:  "...",
		NSec:    "...",
		NPub:    "...",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func apiJwtHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Call your updated generateJWT() function here
	resp := jwtResponse{
		Base64: "...",
		Hex:    "...",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func apiSshHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Call your updated generateSSH() function here
	resp := sshResponse{
		PrivateKey: "-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----",
		PublicKey:  "ssh-ed25519 ...",
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

	// TODO: Call your updated generateHash(req.Password) function here
	resp := hashResponse{
		PHC: "$argon2id$v=19$...",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}