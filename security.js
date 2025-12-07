/**
 * BeeRRy Security Module
 * Provides basic security features for browser data protection
 */

const BeeRRySecurity = {
  // Generate CSRF token
  generateCSRFToken: function() {
    const token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    sessionStorage.setItem('csrf_token', token);
    return token;
  },

  // Validate CSRF token
  validateCSRFToken: function(token) {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  },

  // Simple encryption (base64 + obfuscation - not cryptographically secure)
  // For real security, use a proper library like TweetNaCl.js or libsodium.js
  encryptData: function(data, key = 'default') {
    try {
      const jsonStr = JSON.stringify(data);
      const encoded = btoa(jsonStr); // Base64 encode
      const keyHash = this.simpleHash(key);
      const encrypted = this.xorEncrypt(encoded, keyHash);
      return encrypted;
    } catch (e) {
      console.error('Encryption error:', e);
      return null;
    }
  },

  // Decrypt data
  decryptData: function(encrypted, key = 'default') {
    try {
      const keyHash = this.simpleHash(key);
      const decoded = this.xorDecrypt(encrypted, keyHash);
      const jsonStr = atob(decoded); // Base64 decode
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Decryption error:', e);
      return null;
    }
  },

  // Simple XOR encryption
  xorEncrypt: function(str, key) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  },

  // Simple XOR decryption
  xorDecrypt: function(str, key) {
    const decoded = atob(str);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  },

  // Simple hash function
  simpleHash: function(str) {
    let hash = '';
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  },

  // Store sensitive data encrypted
  storeSecure: function(key, data) {
    try {
      const encrypted = this.encryptData(data, key);
      localStorage.setItem(`secure_${key}`, encrypted);
      return true;
    } catch (e) {
      console.error('Secure storage error:', e);
      return false;
    }
  },

  // Retrieve encrypted data
  retrieveSecure: function(key) {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      return this.decryptData(encrypted, key);
    } catch (e) {
      console.error('Secure retrieval error:', e);
      return null;
    }
  },

  // Clear sensitive data
  clearSecure: function(key) {
    localStorage.removeItem(`secure_${key}`);
  },

  // Clear all secure data
  clearAllSecure: function() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        localStorage.removeItem(key);
      }
    });
  },

  // Validate email format
  validateEmail: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Check password strength
  checkPasswordStrength: function(password) {
    let strength = 0;
    const feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push('Minimal 8 karakter');

    if (password.length >= 12) strength++;
    else feedback.push('Disarankan 12+ karakter');

    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Tambahkan huruf kecil (a-z)');

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Tambahkan huruf besar (A-Z)');

    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Tambahkan angka (0-9)');

    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    else feedback.push('Tambahkan simbol (!@#$%^&*)');

    const levels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat', 'Ekstrim'];
    const colors = ['#ff6b6b', '#ff8c42', '#ffd93d', '#6bcf7f', '#4ecdc4', '#1d3557'];

    return {
      score: strength,
      level: levels[strength] || 'Ekstrim',
      color: colors[strength] || '#1d3557',
      feedback: feedback
    };
  },

  // Sanitize HTML input
  sanitizeHTML: function(html) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = html;
    return tempDiv.innerHTML;
  },

  // Detect XSS attempts
  detectXSS: function(input) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /on\w+\s*=/gi,
      /javascript:/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<embed[^>]*>/gi,
      /<object[^>]*>/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  },

  // Get browser security info
  getSecurityInfo: function() {
    return {
      https: window.location.protocol === 'https:',
      cookies_enabled: navigator.cookieEnabled,
      user_agent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    };
  },

  // Generate secure random token
  generateSecureToken: function(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      token += chars[array[i] % chars.length];
    }
    return token;
  },

  // Initialize security on page load
  init: function() {
    // Generate CSRF token on load
    this.generateCSRFToken();

    // Log security info
    console.log('BeeRRy Security initialized');
    console.log('Browser Security Info:', this.getSecurityInfo());

    // Add CSP meta tag if not present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:";
      document.head.appendChild(cspMeta);
    }
  }
};

// Initialize on document ready
document.addEventListener('DOMContentLoaded', function() {
  BeeRRySecurity.init();
});

// Warn user when leaving page with unsaved changes
window.addEventListener('beforeunload', function(e) {
  // Optional: Add warning for unsaved data
  // e.preventDefault();
  // e.returnValue = '';
});
