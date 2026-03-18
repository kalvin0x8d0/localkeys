# localkeys

A lightweight, local web utility for generating and managing cryptographic keys. It features a modern Material You interface. No network calls — everything stays on your machine.

## Features

- **Nostr keypair** — generates a secp256k1 private key and derives the public key, outputs both hex and NIP-19 bech32 (`nsec` / `npub`) formats.
- **JWT secret** — generates a cryptographically random 256-bit secret for HMAC-SHA256 signing, outputs base64 and hex.
- **SSH keypair** — generates an Ed25519 SSH keypair and outputs the OpenSSH formats directly to the browser for easy copying.
- **Password hashing** — hashes a password using Argon2id with OWASP-recommended parameters, outputs a PHC-format string.

## Source Code Structure

```text
localkeys/
├── main.go              # HTTP server, API endpoints, and static file embedding
├── nostr.go             # Nostr keypair generation (hex + NIP-19)
├── jwt.go               # JWT secret generation (base64 + hex)
├── sshgen.go            # Ed25519 SSH keypair generation
├── hash.go              # Argon2id password hashing
├── go.mod               # Go module definition and dependencies
├── Dockerfile           # Multi-stage build (golang → debian-slim)
├── docker-compose.yaml  # Docker Compose config for building/running
├── .gitignore           # Ignores binaries and IDE files
├── README.md            # This file
└── static/
    └── index.html       # Material You frontend (HTML/CSS/JS)