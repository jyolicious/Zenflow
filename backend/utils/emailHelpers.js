const dns = require('dns').promises;
const disposableDomains = new Set([
  // small sample - you can extend this list or use a service
  'mailinator.com','10minutemail.com','tempmail.com','trashmail.com','guerrillamail.com'
]);

/**
 * Check that email's domain has MX records.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function hasMX(email) {
  try {
    const domain = email.split('@')[1].toLowerCase();
    if (!domain) return false;
    if (disposableDomains.has(domain)) return false;
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch (err) {
    // domain likely doesn't exist or no MX records
    return false;
  }
}

module.exports = { hasMX, disposableDomains };
