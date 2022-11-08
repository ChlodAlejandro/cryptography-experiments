#!/usr/bin/env bash

# `-pass pass:secretPasswordHere1` is only here to make it work without a tty.
openssl enc -aes256 -pbkdf2 -salt -iter 210000 -p -pass pass:secretPasswordHere1 -in pass -out pass.enc > run.log