#!/bin/bash

# do all our work in https directory or whatever is arg 1
HTTPS_DIR="https"
if [ ! -z "$1" ]; then
  HTTPS_DIR="$1"
fi
mkdir "$HTTPS_DIR"
cd "$HTTPS_DIR"

# generate 2048 digit private key, encrypted using des3 cipher
openssl genrsa -des3 -out server.pass.key 2048
# remove the password from our encrypted private key
openssl rsa -in server.pass.key -out server.key
# new certificate signing request (CSR)
openssl req -new -key server.key -out server.csr
# sign the requested certificate for 365 days using sha256 digest and our private key
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt

# makes the above two steps
# openssl req -x509 -days 365 -newkey rsa:2048 -keyout server.pass.key -out server.crt
# openssl rsa -in server.pass.key -out server.key
