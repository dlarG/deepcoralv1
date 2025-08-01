import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.REACT_APP_ENCRYPTION_KEY || "as@/KuGhxXvdd14t2SDASq4!Ad2";

export const encryptId = (id) => {
  try {
    if (!SECRET_KEY) {
      console.error("No encryption key found");
      return null;
    }

    const encrypted = CryptoJS.AES.encrypt(
      id.toString(),
      SECRET_KEY
    ).toString();
    // Convert to Base64 URL-safe format
    return encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decryptId = (encryptedId) => {
  try {
    if (!SECRET_KEY) {
      console.error("No encryption key found");
      return null;
    }

    if (!encryptedId) {
      return null;
    }

    // Convert back from Base64 URL-safe format
    let base64 = encryptedId.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }

    const bytes = CryptoJS.AES.decrypt(base64, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return decrypted || null;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
