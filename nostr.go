package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"

	"github.com/nbd-wtf/go-nostr"
	"github.com/nbd-wtf/go-nostr/nip19"
)

// generateNostr generates a fresh Nostr keypair and returns the hex and bech32 strings.
func generateNostr() (privHex string, pubHex string, nsec string, npub string, err error) {
	// Generate 32 random bytes for the private key (secp256k1 scalar).
	privBytes := make([]byte, 32)
	if _, err := rand.Read(privBytes); err != nil {
		return "", "", "", "", fmt.Errorf("error generating random bytes: %w", err)
	}
	privHex = hex.EncodeToString(privBytes)

	// Derive the public key from the private key using go-nostr.
	pubHex, err = nostr.GetPublicKey(privHex)
	if err != nil {
		return "", "", "", "", fmt.Errorf("error deriving public key: %w", err)
	}

	// Encode to NIP-19 bech32 format (nsec / npub).
	nsec, err = nip19.EncodePrivateKey(privHex)
	if err != nil {
		return "", "", "", "", fmt.Errorf("error encoding nsec: %w", err)
	}

	npub, err = nip19.EncodePublicKey(pubHex)
	if err != nil {
		return "", "", "", "", fmt.Errorf("error encoding npub: %w", err)
	}

	return privHex, pubHex, nsec, npub, nil
}