# BeeRRy Website - Security Features

## Fitur Keamanan yang Tersedia

### 1. CSRF Token Protection
Mencegah serangan Cross-Site Request Forgery dengan menghasilkan unique token per session.

**Penggunaan:**
```javascript
const token = BeeRRySecurity.generateCSRFToken();
const isValid = BeeRRySecurity.validateCSRFToken(token);
```

### 2. Data Encryption
Enkripsi data sensitif sebelum menyimpan ke localStorage. Menggunakan XOR encryption + Base64 encoding.

**Penggunaan:**
```javascript
// Simpan data terenkripsi
BeeRRySecurity.storeSecure('username', { name: 'BeeRRy', email: 'test@example.com' });

// Ambil data terenkripsi
const userData = BeeRRySecurity.retrieveSecure('username');

// Hapus data terenkripsi
BeeRRySecurity.clearSecure('username');

// Hapus semua data terenkripsi
BeeRRySecurity.clearAllSecure();
```

### 3. Password Strength Checker
Mengecek kekuatan password dan memberikan feedback.

**Penggunaan:**
```javascript
const strength = BeeRRySecurity.checkPasswordStrength('MyPass123!@');
console.log(strength.level);    // "Sangat Kuat"
console.log(strength.score);    // 6
console.log(strength.feedback); // Array feedback
```

**Kriteria:**
- Minimal 8 karakter (atau 12+ disarankan)
- Huruf kecil (a-z)
- Huruf besar (A-Z)
- Angka (0-9)
- Simbol (!@#$%^&*)

### 4. Input Validation
Validasi email dan deteksi XSS attempts.

**Penggunaan:**
```javascript
// Validate email
const isValidEmail = BeeRRySecurity.validateEmail('user@example.com');

// Detect XSS attempts
const hasXSS = BeeRRySecurity.detectXSS('<script>alert("XSS")</script>');

// Sanitize HTML
const safe = BeeRRySecurity.sanitizeHTML('<img src="x" onerror="alert(1)">');
```

### 5. Content Security Policy (CSP)
Automatically menambahkan CSP meta tag untuk mencegah inline script execution.

### 6. Secure Random Token Generation
Generate secure random token menggunakan Crypto API.

**Penggunaan:**
```javascript
const token = BeeRRySecurity.generateSecureToken(32);
```

### 7. Browser Security Info
Mendapatkan informasi keamanan browser.

**Penggunaan:**
```javascript
const info = BeeRRySecurity.getSecurityInfo();
// Returns: { https, cookies_enabled, user_agent, platform, language }
```

## Integrasi ke Website

### 1. Tambahkan Script ke HTML
```html
<script src="security.js"></script>
```

### 2. Gunakan dalam Application
```javascript
// Setelah DOM loaded, gunakan BeeRRySecurity object
BeeRRySecurity.storeSecure('myKey', { data: 'value' });
```

## Keamanan - Catatan Penting

⚠️ **DISCLAIMER:** Fitur enkripsi di modul ini (XOR + Base64) adalah untuk **basic protection saja**, BUKAN cryptographically secure untuk data sangat sensitif seperti:
- Password (hash dengan bcrypt/argon2 di server)
- Payment info (gunakan service pihak ketiga seperti Stripe/PayPal)
- Private keys (jangan simpan di client)

Untuk keamanan tingkat enterprise, gunakan:
- **TweetNaCl.js** - Elliptic Curve Cryptography
- **libsodium.js** - Modern cryptography
- **crypto-js** - AES encryption

## Best Practices

1. ✅ Selalu gunakan HTTPS untuk transmisi data
2. ✅ Validate input di sisi server + client
3. ✅ Sanitize output untuk prevent XSS
4. ✅ Gunakan httpOnly cookies untuk session tokens
5. ✅ Implement rate limiting untuk login attempts
6. ✅ Log security events
7. ✅ Keep dependencies updated
8. ✅ Use strong passwords + 2FA

## Testing

Buka DevTools Console dan test:
```javascript
// Test CSRF token
BeeRRySecurity.generateCSRFToken();
sessionStorage.getItem('csrf_token');

// Test encryption
BeeRRySecurity.storeSecure('test', { data: 'confidential' });
BeeRRySecurity.retrieveSecure('test');

// Test password strength
BeeRRySecurity.checkPasswordStrength('WeakPass');
BeeRRySecurity.checkPasswordStrength('MyStr0ng!Password');

// Test XSS detection
BeeRRySecurity.detectXSS('<script>alert("xss")</script>');

// Test secure token
BeeRRySecurity.generateSecureToken(32);
```

## License

Free to use for BeeRRy personal website
