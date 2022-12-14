This is my playground for cryptography experiments. Nothing here is supposed
to be fully secure, but serves as a starting point for decent cryptographic
things.

All activities here consist of two parts: an OpenSSL command that does what
we need, and the Node.js equivalent. The Node.js equivalent hopefully
serves as an example for high-level implementations of the OpenSSL library.

Don't expect any formality, seriousness, cleanliness, or extreme security
with this repository — this is a sandbox and not a production-ready library.

Each folder should have a README file that indicates the security problems
in each activity, along with other information.

## Running an activity
```shell
# ./run.sh <activity>
./run.sh 001-pbkdf2-with-aes-encrypted-passphrase
```
or
```shell
#!/usr/bin/env bash

cd <activity>
cd openssl && ./run.sh && cd ..
cd node && node index.mjs && cd ..
```

## List
* [001 - PBKDF2 with AES-encrypted Passphrase](/001-pbkdf2-with-aes-encrypted-passphrase)