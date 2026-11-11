/**
 * Mask email address for privacy
 * Example: john.doe@example.com -> jo***@example.com
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;
  
  // Show first character and last character before @, mask the middle
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  
  const visibleChars = 2; // Show first 2 chars
  const maskedPart = localPart.substring(0, visibleChars) + '***';
  return `${maskedPart}@${domain}`;
}
