#!/bin/bash

# environment variables
[ ! -z "$DATABASE_NAME" ] || DATABASE_NAME="blog"
[ ! -z "$DATABASE_USERNAME" ] || DATABASE_USERNAME="blogUser"
[ ! -z "$AUTH_DATABASE_NAME" ] || AUTH_DATABASE_NAME="admin"

# -h or --help display help docs
if  [ "$1" == "-h" ] || [ "$1" == "--help"  ]; then
  echo "usage: $0 <USERS_EMAIL> [true|false]"
  echo "where true|false correspond to the value isSuperuser should be set to"

# if invalid giv an error message
elif [ -z "$1" ] || ( [ "$2" != "true" ] && [ "$2" != "false" ] ); then
  echo "invalid email/isSuperuser combination [$1, $2]"
  echo "enter $0 --help for usage information"
  exit 1

# else there are no errors show carry out the action
else
  # generate a filename that doesn't exist
  FILEBASE=".tmp"
  COUNT=0
  FILE="$FILEBASE"

  while [ -f "$FILE" ]; do
    COUNT=$((++COUNT))
    FILE="$FILEBASE($COUNT)"
  done

  # echo the relevant javascript to that file
  echo "db.users.update({email: \"$1\"},{\$set: {isSuperuser: $2}})" > "$FILE"

  echo mongo "$DATABASE_NAME" -u "$DATABASE_USERNAME" -p --authenticationDatabase "$AUTH_DATABASE_NAME" "$FILE"

  # carry out the commands in the file on the database
  mongo "$DATABASE_NAME" -u "$DATABASE_USERNAME" -p --authenticationDatabase "$AUTH_DATABASE_NAME" "$FILE"

  # clean up
  rm "$FILE"


fi
