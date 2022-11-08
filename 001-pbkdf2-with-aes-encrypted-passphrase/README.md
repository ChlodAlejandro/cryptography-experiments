# 001 - (PBKDF2 with AES)-encrypted Passphrase

This encrypts a given passphrase (`secretPasswordHere2`) stored in a file.
Encryption is done using the `aes-256-cbc` algorithm with key size of 32 (as
required by the algorithm). The PBKDF2 key is created using `secretPasswordHere1`
with 210k iterations. The IV for AES and the salt for PBKDF2 are both randomly(-ish)
generated with OpenSSL and re-used in the Node.js implementation to ensure
equal output.

## Lessons learned
* OpenSSL stores the encrypted file in the format `Salted__<salt><data>`.
* PBKDF2 is a key and not some super special algorithm.

## Security
The following security issues exist with this activity:

* The Node.js component of this activity has a static initialization vector
  derived from the OpenSSL run output
* The Node.js component of this activity has a static salt
  derived from the OpenSSL run output
* A known and plaintext PBKDF2 password is used.
* The passphrase to encrypt is not made of random bytes

When using this activity as an example, please ensure that these have been resolved.