# JWT Decoder

Decode JSON Web Tokens in the browser — split the three parts, base64url-decode header and payload, display all claims with timestamps, and check expiry status.

**Live Demo:** https://file-converter-free.com/en/developer-tools/jwt-decoder

## How It Works

`base64urlDecode(str)` replaces `-` with `+` and `_` with `/`, pads to a multiple of 4 with `=`, then calls `atob`. To handle UTF-8 payloads, it maps each character to a percent-encoded byte sequence and passes the result through `decodeURIComponent`. The token is split on `.`; a token without exactly 3 parts is rejected immediately. The header and payload parts are decoded and `JSON.parse`d separately. `formatClaimValue(key, val)` formats `exp`, `iat`, and `nbf` claims by multiplying by 1000 and constructing a `new Date(val * 1000).toUTCString()` human-readable string alongside the raw integer. The expiry badge compares `payload.exp` against `Math.floor(Date.now() / 1000)` to show "Expired" or "Valid (not expired)". Decoding triggers live on `input` and `paste` events.

## Features

- Base64url decoding of header and payload (UTF-8 safe)
- JSON pretty-print for header and payload
- Expiry badge: Expired / Valid / No expiry claim
- Claims table with `exp`/`iat`/`nbf` formatted as UTC date strings
- Raw signature display
- Live decode on paste and input

## Browser APIs Used

- `atob` (Base64 decoding)

## Code Structure

| File | Description |
|------|-------------|
| `jwt-decoder.js` | `base64urlDecode` (`-`/`_` + padding + `atob` + `decodeURIComponent`), 3-part split validation, `formatClaimValue` (timestamp keys → UTC string), expiry badge, `buildClaimsTable` DOM builder |

## Usage

| Element ID / Selector | Purpose |
|----------------------|---------|
| `#jwtInput` | JWT token input |
| `#jwtDecodeBtn` | Decode button |
| `#jwtClearBtn` | Clear input and results |
| `#jwtError` | Error message display |
| `#jwtHeaderJson` | Decoded header JSON |
| `#jwtPayloadJson` | Decoded payload JSON |
| `#jwtSignatureVal` | Raw signature display |
| `#jwtExpBadge` | Expiry status badge |
| `#jwtClaimsTable` | Claims table |

## License

MIT
