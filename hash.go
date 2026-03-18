package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"golang.org/x/crypto/argon2"
)

// Argon2id parameters — OWASP recommended defaults.
const (
	argonTime    = 3      // iterations
	argonMemory  = 65536  // 64 MiB
	argonThreads = 4      // parallelism
	argonKeyLen  = 32     // output hash length in bytes
	saltLen      = 16     // salt length in bytes
)

// generateHash takes a plaintext password and returns an Argon2id hash in PHC format.
func generateHash(password string) (string, error) {
	if password == "" {
		return "", fmt.Errorf("password cannot be empty")
	}

	// Generate a random salt.
	salt := make([]byte, saltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("error generating salt: %w", err)
	}

	// Derive the hash using Argon2id.
	hash := argon2.IDKey([]byte(password), salt, uint32(argonTime), uint32(argonMemory), uint8(argonThreads), uint32(argonKeyLen))

	// Format as a PHC string (widely understood format).
	// $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)
	
	phc := fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", 
		argon2.Version, argonMemory, argonTime, argonThreads, b64Salt, b64Hash)

	return phc, nil
}