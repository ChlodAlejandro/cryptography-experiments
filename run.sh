#!/usr/bin/env bash
set -euxo pipefail

cd "$1"

cd openssl
./run.sh
cd ..

cd node
node index.mjs
cd ..

set +euxo pipefail