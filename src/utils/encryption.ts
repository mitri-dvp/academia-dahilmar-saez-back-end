import crypto from "crypto";

const salt = process.env.ENCRYPT_SALT;
const algorithm = "aes-128-cbc";
const hash = "sha256";

export const encrypt = (string: string) => {
  const key = crypto.pbkdf2Sync(string, salt, 100, 16, hash);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);

  return `${key.toString("hex")}::${iv.toString("hex")}::${encrypted.toString(
    "hex"
  )}`;
};

export const decrypt = (encryptedData: string) => {
  const parts = encryptedData.split("::");

  const key = Buffer.from(parts.shift() as string, "hex");
  const iv = Buffer.from(parts.shift() as string, "hex");
  const encrypted = Buffer.from(parts.shift() as string, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString();
};
