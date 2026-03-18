package main

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/pem"
	"fmt"
	"os"

	"golang.org/x/crypto/ssh"
)

// handleSSH generates an Ed25519 SSH keypair and writes them to files
// in the current working directory.
func handleSSH() {
	// Generate Ed25519 keypair.
	pubKey, privKey, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error generating Ed25519 key: %v\n", err)
		os.Exit(1)
	}

	// Marshal the private key into OpenSSH PEM format.
	privPEM, err := ssh.MarshalPrivateKey(privKey, "" /* no passphrase comment */)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error marshalling private key: %v\n", err)
		os.Exit(1)
	}

	privPEMBytes := pem.EncodeToMemory(privPEM)

	// Marshal the public key into OpenSSH authorized_keys format.
	sshPubKey, err := ssh.NewPublicKey(pubKey)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error converting public key: %v\n", err)
		os.Exit(1)
	}
	pubBytes := ssh.MarshalAuthorizedKey(sshPubKey)

	// Write private key file.
	privPath := "id_ed25519_localkeys"
	if err := os.WriteFile(privPath, privPEMBytes, 0600); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing private key file: %v\n", err)
		os.Exit(1)
	}

	// Write public key file.
	pubPath := privPath + ".pub"
	if err := os.WriteFile(pubPath, pubBytes, 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing public key file: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("=== SSH Ed25519 Keypair ===")
	fmt.Println()
	fmt.Printf("Private key : ./%s\n", privPath)
	fmt.Printf("Public key  : ./%s\n", pubPath)
	fmt.Println()
	fmt.Println("Public key contents:")
	fmt.Printf("  %s", string(pubBytes))
	fmt.Println()
	fmt.Println("Move these files to ~/.ssh/ and set permissions accordingly.")
}
