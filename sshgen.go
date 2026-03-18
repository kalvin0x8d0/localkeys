package main

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/pem"
	"fmt"

	"golang.org/x/crypto/ssh"
)

// generateSSH generates an Ed25519 SSH keypair and returns the private (PEM) and public (OpenSSH) keys as strings.
func generateSSH() (privateKey string, publicKey string, err error) {
	// Generate Ed25519 keypair.
	pubKey, privKey, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		return "", "", fmt.Errorf("error generating Ed25519 key: %w", err)
	}

	// Marshal the private key into OpenSSH PEM format.
	privPEM, err := ssh.MarshalPrivateKey(privKey, "")
	if err != nil {
		return "", "", fmt.Errorf("error marshalling private key: %w", err)
	}

	privPEMBytes := pem.EncodeToMemory(privPEM)

	// Marshal the public key into OpenSSH authorized_keys format.
	sshPubKey, err := ssh.NewPublicKey(pubKey)
	if err != nil {
		return "", "", fmt.Errorf("error converting public key: %w", err)
	}
	pubBytes := ssh.MarshalAuthorizedKey(sshPubKey)

	return string(privPEMBytes), string(pubBytes), nil
}