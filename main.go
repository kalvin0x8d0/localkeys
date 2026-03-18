package main

import (
	"fmt"
	"os"
	"strings"
)

// localkeys — a local cryptographic key utility.
// Generates Nostr keypairs, JWT secrets, SSH keys, and password hashes.
// No network calls. Everything stays on your machine.

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(0)
	}

	// Route to the correct subcommand.
	command := strings.ToLower(os.Args[1])

	switch command {
	case "nostr":
		handleNostr()
	case "jwt":
		handleJWT()
	case "ssh":
		handleSSH()
	case "hash":
		handleHash(os.Args[2:])
	case "help", "-h", "--help":
		printUsage()
	default:
		fmt.Fprintf(os.Stderr, "Unknown command: %s\n\n", command)
		printUsage()
		os.Exit(1)
	}
}

// printUsage prints the available subcommands.
func printUsage() {
	fmt.Println("localkeys — local cryptographic key utility")
	fmt.Println()
	fmt.Println("Usage:")
	fmt.Println("  localkeys <command> [options]")
	fmt.Println()
	fmt.Println("Commands:")
	fmt.Println("  nostr    Generate a Nostr keypair (hex + NIP-19 nsec/npub)")
	fmt.Println("  jwt      Generate a random JWT signing secret (base64)")
	fmt.Println("  ssh      Generate an Ed25519 SSH keypair")
	fmt.Println("  hash     Hash a password with Argon2id")
	fmt.Println()
	fmt.Println("Examples:")
	fmt.Println("  localkeys nostr")
	fmt.Println("  localkeys jwt")
	fmt.Println("  localkeys ssh")
	fmt.Println("  localkeys hash mypassword")
	fmt.Println("  localkeys hash   (prompts for password)")
}
