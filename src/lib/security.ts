import crypto from 'crypto';

const IV_LENGTH = 16;

function getEncryptionKey() {
  const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'a-very-secure-32-character-long-secret-key');
  if (!secret) {
    throw new Error('JWT_SECRET must be configured in production');
  }
  return crypto.scryptSync(secret, 'portfolio-salt', 32);
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const inputHash = hashPassword(password);
  if (inputHash.length !== storedHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(storedHash));
}

export function generateToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function createSessionToken(payload: unknown): string {
  const data = JSON.stringify({
    payload,
    exp: Date.now() + 1000 * 60 * 60 * 24 // 24 hours
  });
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv_hex.encrypted_hex.tag_hex
  return `${iv.toString('hex')}.${encrypted}.${authTag}`;
}

export function verifySessionToken(token: string): unknown | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [ivHex, encryptedHex, tagHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    const { payload, exp } = JSON.parse(decrypted);
    if (Date.now() > exp) {
      return null; // Expired
    }
    
    return payload;
  } catch (err) {
    console.error('Session verification failed:', err);
    return null;
  }
}
