# Stage 1: Build the static binary.
FROM golang:1.22-bookworm AS builder

WORKDIR /src
COPY go.mod ./
RUN go mod download

# Copy the Go source code AND the static folder containing index.html.
COPY . .

# Build a fully static binary (no CGO) for the current platform.
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /localkeys .

# Stage 2: Minimal runtime image (static binary needs no OS).
FROM scratch

COPY --from=builder /localkeys /localkeys

EXPOSE 8080

ENTRYPOINT ["/localkeys"]
