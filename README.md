# localkeys

A lightweight, local command-line utility for generating and managing cryptographic keys. No network calls — everything stays on your machine.

## Features

- **Nostr keypair** — generates a secp256k1 private key and derives the public key, outputs both hex and NIP-19 bech32 (`nsec` / `npub`) formats.
- **JWT secret** — generates a cryptographically random 256-bit secret for HMAC-SHA256 signing, outputs base64 and hex.
- **SSH keypair** — generates an Ed25519 SSH keypair and writes them to files in OpenSSH format.
- **Password hashing** — hashes a password using Argon2id with OWASP-recommended parameters, outputs a PHC-format string.

## Source Code Structure

```
localkeys/
├── main.go              # Entry point, subcommand routing, help text
├── nostr.go             # Nostr keypair generation (hex + NIP-19)
├── jwt.go               # JWT secret generation (base64 + hex)
├── sshgen.go            # Ed25519 SSH keypair generation
├── hash.go              # Argon2id password hashing
├── termios_linux.go     # Terminal echo control for hidden password input
├── go.mod               # Go module definition and dependencies
├── Dockerfile           # Multi-stage build (golang → debian-slim)
├── docker-compose.yaml  # Docker Compose config for building/running
├── .gitignore           # Ignores binaries, generated keys, output/
└── README.md            # This file
```

## Build Locally (without Docker)

Requires Go 1.22+.

```bash
git clone https://your-git-server.com/localkeys.git
cd localkeys
go mod tidy
go build -ldflags="-s -w" -o localkeys .
```

This produces a single `localkeys` binary in the project directory.

## Build & Run with Docker Compose

```bash
# Build the image
docker compose build

# Run a subcommand
docker compose run --rm localkeys nostr
docker compose run --rm localkeys jwt
docker compose run --rm localkeys ssh
docker compose run --rm localkeys hash mysecretpassword

# Interactive password input
docker compose run --rm -it localkeys hash
```

SSH key files are written to the `./output/` directory (mounted volume).

## Usage

```
localkeys <command>

Commands:
  nostr    Generate a Nostr keypair (hex + NIP-19 nsec/npub)
  jwt      Generate a random JWT signing secret (base64)
  ssh      Generate an Ed25519 SSH keypair
  hash     Hash a password with Argon2id
```

## Dependencies

- [go-nostr](https://github.com/nbd-wtf/go-nostr) — Nostr protocol library for NIP-19 encoding.
- [golang.org/x/crypto](https://pkg.go.dev/golang.org/x/crypto) — Argon2id hashing and SSH key marshalling.

## Notes

- `go.sum` is not included in this repository. Run `go mod tidy` after cloning to generate it.
- The `hash` subcommand uses Argon2id with OWASP defaults: 3 iterations, 64 MiB memory, 4 threads, 32-byte output.
- The `ssh` subcommand writes key files to the current working directory (inside the container, that's `/output/`).

## Licence

Do whatever you want with this. CC0 / public domain.
