// src/utils/encryption.js
import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.REACT_APP_ENCRYPTION_KEY || "asdwdasdasdasd14t2SDASq4@!#)23123";

// src/utils/encryption.js
export const encryptId = (id) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      id.toString(),
      SECRET_KEY
    ).toString();
    // Make URL-safe by replacing problematic characters
    return encrypted.replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decryptId = (encryptedId) => {
  try {
    if (!encryptedId) return null;
    // Reverse the URL-safe replacements
    const encrypted = encryptedId.replace(/_/g, "/").replace(/-/g, "+");
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
