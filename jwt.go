package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"os"
)

// handleJWT generates a cryptographically random 256-bit secret
// suitable for HMAC-SHA256 JWT signing.
func handleJWT() {
	// 32 bytes = 256 bits, standard for HS256.
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		fmt.Fprintf(os.Stderr, "Error generating random bytes: %v\n", err)
		os.Exit(1)
	}

	b64 := base64.StdEncoding.EncodeToString(secret)
	hexStr := hex.EncodeToString(secret)

	fmt.Println("=== JWT Secret (HS256) ===")
	fmt.Println()
	fmt.Printf("Base64 : %s\n", b64)
	fmt.Printf("Hex    : %s\n", hexStr)
	fmt.Println()
	fmt.Println("Use this as JWT_SECRET in your .env or config file.")
}
