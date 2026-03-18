package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"os"
	"strings"
	"syscall"

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

// handleHash takes a password (from args or stdin) and outputs an Argon2id hash.
func handleHash(args []string) {
	var password string

	if len(args) > 0 {
		// Password provided as argument.
		password = strings.Join(args, " ")
	} else {
		// Prompt for password from terminal.
		fmt.Print("Enter password: ")
		raw, err := readPassword()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error reading password: %v\n", err)
			os.Exit(1)
		}
		password = string(raw)
		fmt.Println() // newline after hidden input
	}

	if password == "" {
		fmt.Fprintln(os.Stderr, "Password cannot be empty.")
		os.Exit(1)
	}

	// Generate a random salt.
	salt := make([]byte, saltLen)
	if _, err := rand.Read(salt); err != nil {
		fmt.Fprintf(os.Stderr, "Error generating salt: %v\n", err)
		os.Exit(1)
	}

	// Derive the hash using Argon2id.
	hash := argon2.IDKey([]byte(password), salt, argonTime, argonMemory, argonThreads, argonKeyLen)

	// Format as a PHC string (widely understood format).
	// $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	phc := fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version, argonMemory, argonTime, argonThreads, b64Salt, b64Hash)

	fmt.Println("=== Argon2id Password Hash ===")
	fmt.Println()
	fmt.Printf("Hash : %s\n", phc)
	fmt.Println()
	fmt.Println("Store this hash in your database. Never store plaintext passwords.")
}

// readPassword reads a line from stdin with echo disabled (hides typing).
// Falls back to plain read if terminal control is not available.
func readPassword() ([]byte, error) {
	fd := int(syscall.Stdin)
	// Save current terminal state.
	oldState, err := getTermios(fd)
	if err != nil {
		// Fallback: just read a line normally (e.g. piped input).
		return readLine()
	}

	// Disable echo.
	newState := *oldState
	newState.Lflag &^= syscall.ECHO
	if err := setTermios(fd, &newState); err != nil {
		return readLine()
	}
	defer setTermios(fd, oldState)

	return readLine()
}

// readLine reads a single line from stdin.
func readLine() ([]byte, error) {
	var buf []byte
	b := make([]byte, 1)
	for {
		n, err := os.Stdin.Read(b)
		if n > 0 {
			if b[0] == '\n' {
				break
			}
			buf = append(buf, b[0])
		}
		if err != nil {
			break
		}
	}
	return buf, nil
}
