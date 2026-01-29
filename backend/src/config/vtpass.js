const axios = require('axios');

class VTpassConfig {
  constructor() {
    this.publicKey = process.env.VTPASS_PUBLIC_KEY;
    this.secretKey = process.env.VTPASS_SECRET_KEY;
    this.apiKey = process.env.VTPASS_API_KEY;
    this.baseURL = process.env.VTPASS_BASE_URL;

    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
        'public-key': this.publicKey,
      },
      auth: {
        username: this.apiKey,
        password: this.publicKey,
      },
    });
  }

  // Get configured axios client
  getClient() {
    return this.client;
  }

  // Verify credentials are set
  validateCredentials() {
    if (!this.publicKey || !this.secretKey || !this.apiKey) {
      throw new Error('VTpass credentials are not properly configured');
    }
    return true;
  }
}

module.exports = new VTpassConfig();
