# Stage 1: Build the static binary.
FROM golang:1.22-bookworm AS builder

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

# Copy the Go source code AND the static folder containing index.html
COPY . .

# Build a fully static binary (no CGO) for Linux amd64.
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o /localkeys .

# Stage 2: Minimal runtime image.
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /localkeys /usr/local/bin/localkeys

# Expose the web server port
EXPOSE 8080

ENTRYPOINT ["localkeys"]