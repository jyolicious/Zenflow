// utils/emailHelpers.js
import { promises as dns } from "dns";

export const disposableDomains = new Set([
  // small sample – extend as needed or replace with a service
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "trashmail.com",
  "guerrillamail.com",
]);

/**
 * Check that email's domain has MX records.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export async function hasMX(email) {
  try {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;
    if (disposableDomains.has(domain)) return false;

    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch {
    // domain likely doesn't exist or has no MX records
    return false;
  }
}
