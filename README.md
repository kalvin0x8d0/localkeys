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
```

## Build Locally (without Docker)

Requires Go 1.22+.

```bash
git clone [https://your-git-server.com/localkeys.git](https://your-git-server.com/localkeys.git)
cd localkeys
go mod tidy
go build -ldflags="-s -w" -o localkeys .
```

This produces a single `localkeys` binary. The HTML and CSS files are embedded directly inside the binary, so you do not need to move the `static` folder around when deploying.

## Usage

Start the programme by running the binary:

```bash
./localkeys
```

Then, open your web browser and navigate to:
`http://localhost:8080`

## Dependencies

- [go-nostr](https://github.com/nbd-wtf/go-nostr) — Nostr protocol library for NIP-19 encoding.
- [golang.org/x/crypto](https://pkg.go.dev/golang.org/x/crypto) — Argon2id hashing and SSH key marshalling.
- [BeerCSS](https://github.com/beercss/beercss) — Frontend framework for Material You styling (loaded via CDN in `index.html`).

## Notes

- `go.sum` is not included in this repository. Run `go mod tidy` after cloning to generate it.
- The `hash` tool uses Argon2id with OWASP defaults: 3 iterations, 64 MiB memory, 4 threads, 32-byte output.

## Licence

Do whatever you want with this. CC0 / public domain.