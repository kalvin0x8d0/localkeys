# Stage 1: Build the static binary.
FROM golang:1.22-bookworm AS builder

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .

# Build a fully static binary (no CGO) for Linux amd64.
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o /localkeys .

# Stage 2: Minimal runtime image.
FROM debian:bookworm-slim

# Needed for terminal password input to work properly.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /localkeys /usr/local/bin/localkeys

# Output directory for generated key files (SSH keys, etc).
WORKDIR /output

ENTRYPOINT ["localkeys"]
CMD ["help"]
