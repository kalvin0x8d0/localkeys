import nacl from 'tweetnacl';

// --- Binary helpers ---
function concat(...arrays) {
  const total = arrays.reduce((acc, a) => acc + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const arr of arrays) { out.set(arr, offset); offset += arr.length; }
  return out;
}

function uint32BE(n) {
  const buf = new Uint8Array(4);
  new DataView(buf.buffer).setUint32(0, n);
  return buf;
}

// SSH wire-format string: 4-byte length prefix + UTF-8 bytes
function sshString(str) {
  const bytes = new TextEncoder().encode(str);
  return concat(uint32BE(bytes.length), bytes);
}

// SSH wire-format byte array: 4-byte length prefix + raw bytes
function sshBytes(bytes) {
  return concat(uint32BE(bytes.length), bytes);
}

// Uint8Array → base64 (chunked to avoid call-stack overflow on large arrays)
function toBase64(bytes) {
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// --- OpenSSH key serialisation ---

function buildPubBlob(pubKey) {
  // ssh-ed25519 pubkey blob
  return concat(sshString('ssh-ed25519'), sshBytes(pubKey));
}

function buildOpenSSHPrivateKey(privSeed, pubKey) {
  const magic = new TextEncoder().encode('openssh-key-v1\x00');

  const cipherName = sshString('none');
  const kdfName    = sshString('none');
  const kdfOptions = sshBytes(new Uint8Array(0));
  const numKeys    = uint32BE(1);

  const pubBlob           = buildPubBlob(pubKey);
  const pubKeySection     = sshBytes(pubBlob);

  // OpenSSH stores the full 64-byte private key: seed (32) || pubkey (32)
  const fullPriv = concat(privSeed, pubKey);

  // Random check int — both copies identical
  const checkInt = crypto.getRandomValues(new Uint8Array(4));

  const privateSection = concat(
    checkInt,
    checkInt,
    sshString('ssh-ed25519'),
    sshBytes(pubKey),
    sshBytes(fullPriv),
    sshString(''),        // empty comment
  );

  // Pad private section to multiple of 8 bytes (block size for "none" cipher)
  const blockSize = 8;
  const padLen = (blockSize - (privateSection.length % blockSize)) % blockSize;
  const padding = new Uint8Array(padLen).map((_, i) => i + 1);
  const paddedPrivate = concat(privateSection, padding);

  const payload = concat(
    magic,
    cipherName,
    kdfName,
    kdfOptions,
    numKeys,
    pubKeySection,
    sshBytes(paddedPrivate),
  );

  const b64 = toBase64(payload);
  const wrapped = b64.match(/.{1,70}/g).join('\n');
  return `-----BEGIN OPENSSH PRIVATE KEY-----\n${wrapped}\n-----END OPENSSH PRIVATE KEY-----\n`;
}

// --- Public API ---

export function generateSSHKeyPair() {
  // nacl.sign.keyPair() → { publicKey: Uint8Array(32), secretKey: Uint8Array(64) }
  // secretKey = seed(32) || pubkey(32)
  const keypair = nacl.sign.keyPair();
  const privSeed = keypair.secretKey.slice(0, 32);
  const pubKey   = keypair.publicKey;   // Uint8Array(32)

  const pubBlob      = buildPubBlob(pubKey);
  const publicKeyLine = `ssh-ed25519 ${toBase64(pubBlob)}`;
  const privateKeyPEM = buildOpenSSHPrivateKey(privSeed, pubKey);

  return { privateKey: privateKeyPEM, publicKey: publicKeyLine };
}
