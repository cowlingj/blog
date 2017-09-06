#!/usr/bin/env bash

# set a default length of 128, that can be overridden by the user supplying $1
if [ -z "$1" ]; then
  LENGTH=128;
else
  LENGTH="$1"
fi

< /dev/urandom tr -dc A-Za-z0-9 | head -c "$LENGTH"; echo
