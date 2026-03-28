# localkeys — PRD

## Overview
A fully client-side, zero-knowledge cryptographic key generation app rebuilt from scratch.
All crypto operations happen entirely in the browser; the server never sees any keys, secrets, or passwords.

## Problem Statement
Rebuild the original Go-based `localkeys` app (which did server-side crypto) as a zero-knowledge React SPA where all processing happens client-side.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI (health check only — no crypto endpoints)
- **Crypto Libraries (all browser-side)**:
  - `nostr-tools` — Nostr secp256k1 keypair generation
  - `tweetnacl` — Ed25519 keypairs for SSH
  - `hash-wasm` — Argon2id hashing via WebAssembly
  - `Web Crypto API` (built-in) — JWT random secret generation
- **Design**: Swiss/Brutalist dark theme, Outfit + JetBrains Mono fonts

## Core Requirements (Static)
1. Zero-knowledge: server never receives any crypto data
2. Nostr keypair generator (nsec/npub + hex)
3. JWT secret generator (Base64 + Hex, 256-bit)
4. SSH keypair generator (Ed25519, OpenSSH PEM + authorized_keys format)
5. Argon2id password hasher (configurable params, PHC format output)
6. Copy-to-clipboard for all outputs

## What's Been Implemented (2026-03-28)
- [x] Complete React SPA with dark "Control Room" theme
- [x] Header with Zero Knowledge badge (yellow, ShieldCheck icon)
- [x] 4-tab interface: Nostr / JWT Secret / SSH Key / Argon2id
- [x] NostrTool: client-side secp256k1 via nostr-tools (nsec1/npub1 + hex)
- [x] JWTTool: Web Crypto API getRandomValues() → Base64 + Hex
- [x] SSHTool: tweetnacl Ed25519 + manual OpenSSH PEM format serialisation
- [x] ArgonTool: hash-wasm WASM argon2id, configurable memory/iterations/parallelism, PHC output
- [x] OutputField component with copy-to-clipboard + sonner toast
- [x] JetBrains Mono for key outputs, Outfit for UI
- [x] Subtle background texture (3% opacity)
- [x] Footer with "no server transmission" message
- [x] All 16 test cases passed (100% success rate)

## User Personas
- Developers needing cryptographic keys without trusting a remote service
- Sysadmins generating SSH keys offline/locally
- Nostr protocol users needing nsec/npub generation
- Security-conscious users hashing passwords with Argon2id

## Prioritized Backlog

### P0 (Done)
- All 4 tools functional, zero-knowledge, tested

### P1 (Next)
- Dark/Light theme toggle
- Configurable JWT key length (currently fixed 32 bytes)
- Additional SSH key types (RSA 2048/4096)
- Keyboard shortcut to regenerate

### P2 (Future)
- Offline PWA support (works without internet)
- BIP39 mnemonic phrase generator
- WIF (Wallet Import Format) for Bitcoin keys
- Export to file (download .pem, .txt)
