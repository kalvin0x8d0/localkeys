package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"fmt"
)

// generateJWT generates a cryptographically random 256-bit secret
// suitable for HMAC-SHA256 JWT signing and returns it in Base64 and Hex formats.
func generateJWT() (b64 string, hexStr string, err error) {
	// 32 bytes = 256 bits, standard for HS256.
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		return "", "", fmt.Errorf("error generating random bytes: %w", err)
	}

	b64 = base64.StdEncoding.EncodeToString(secret)
	hexStr = hex.EncodeToString(secret)

	return b64, hexStr, nil
}