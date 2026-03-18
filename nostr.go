package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"

	"github.com/nbd-wtf/go-nostr"
	"github.com/nbd-wtf/go-nostr/nip19"
)

// handleNostr generates a fresh Nostr keypair.
// Outputs the hex private key, hex public key, and their NIP-19 bech32 equivalents.
func handleNostr() {
	// Generate 32 random bytes for the private key (secp256k1 scalar).
	privBytes := make([]byte, 32)
	if _, err := rand.Read(privBytes); err != nil {
		fmt.Fprintf(os.Stderr, "Error generating random bytes: %v\n", err)
		os.Exit(1)
	}
	privHex := hex.EncodeToString(privBytes)

	// Derive the public key from the private key using go-nostr.
	pubHex, err := nostr.GetPublicKey(privHex)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error deriving public key: %v\n", err)
		os.Exit(1)
	}

	// Encode to NIP-19 bech32 format (nsec / npub).
	nsec, err := nip19.EncodePrivateKey(privHex)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error encoding nsec: %v\n", err)
		os.Exit(1)
	}

	npub, err := nip19.EncodePublicKey(pubHex)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error encoding npub: %v\n", err)
		os.Exit(1)
	}

	// Print results.
	fmt.Println("=== Nostr Keypair ===")
	fmt.Println()
	fmt.Printf("Private Key (hex) : %s\n", privHex)
	fmt.Printf("Public Key  (hex) : %s\n", pubHex)
	fmt.Println()
	fmt.Printf("nsec : %s\n", nsec)
	fmt.Printf("npub : %s\n", npub)
	fmt.Println()
	fmt.Println("Keep your private key safe. Do not share it.")
}
