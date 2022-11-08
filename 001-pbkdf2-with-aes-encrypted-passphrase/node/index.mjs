import crypto from "crypto";
import fs from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * This file details the process of generating a PBKDF2-keyed and encrypted
 * passphrase file for safely storing the passphrase of a given certificate.
 */
(async () => {

    // USER CUSTOMIZABLE OPTIONS
    const key = "secretPasswordHere1";
    const passphrase = "secretPasswordHere2";
    const iter = 210000;
    const hash = "sha256";
    const algorithm = "aes-256-cbc";
    // keysize always 32 for aes-256-cbc
    const keysize = 32;

    // Get salt and init vectors from the ../openssl output
    let salt, iv;
    try {
        const runLog = (await fs.readFile(__dirname + "/../openssl/run.log")).toString("utf8");

        salt = Buffer.from(runLog.replace(/[\s\S]*salt\s*=\s*(.+)\n[\s\S]*/, "$1"), "hex");
        console.log("salt=" + salt.toString("hex"));
        iv = Buffer.from(runLog.replace(/[\s\S]*iv\s*=\s*(.+)\n[\s\S]*/, "$1"), "hex");
        console.log("iv=" + iv.toString("hex"));
    } catch (e) {
        console.error("Could not load ../openssl data. Has generate.sh been run yet?", e);
    }

    // Write the passphrase to protect
    await fs.writeFile(__dirname + "/pass", passphrase);

    // Generate PBKDF2 key
    /** @type Buffer */
    const pbkdf2Key = await new Promise( (res, rej) => {
        crypto.pbkdf2(key, salt, iter, keysize, hash, async (err, key) => {
            if (err) return rej(err);
            res(key);
        } );
    } );

    // Generate the cipher using the given algorithm and the generated pbkdf2 key
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(pbkdf2Key), iv);
    let encrypted = cipher.update(passphrase);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    console.log("enc=" + encrypted.toString("hex"));

    // OpenSSL format
    const enc = Buffer.concat([Buffer.from("Salted__"), salt, encrypted]);
    await fs.writeFile(__dirname + "/pass.enc", enc);

    // Check if the key matches what OpenSSL made
    const originalKey = await fs.readFile(__dirname + "/../openssl/pass.enc");
    if ( originalKey.equals(enc) ) {
        console.log("SUCCESS!");
        console.log("Generated key (hex): " + enc.toString("hex"));
        console.log("Generated key (utf): " + enc.toString("utf8"));
    } else {
        console.log("FAIL!");
        console.log("Original key (hex): " + originalKey.toString("hex"));
        console.log("Original key (utf): " + originalKey.toString("utf8"));
        console.log("Generated key (hex): " + enc.toString("hex"));
        console.log("Generated key (utf): " + enc.toString("utf8"));
    }
})();
