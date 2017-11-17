#!/bin/bash

### ghacks-user.js updater for Mac/Linux
## author: @overdodactyl
## version: 1.0

ghacksjs="https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/user.js"

cd "`dirname $0`"

echo -e "\nThis script should be run from your Firefox profile directory.\n"

if [ -e user.js ]; then
  echo "Your current user.js file for this profile will be backed up and the latest ghacks version from github will take its place."
  echo -e "\nIf currently using the ghacks user.js, please compare versions:"
  echo "  Available online: $(curl -s ${ghacksjs} | sed -n '4p')"
  echo "  Currently using:  $(sed -n '4p' user.js)"
else
  echo "A user.js file does not exist in this profile. If you continue, the latest ghacks version from github will be downloaded."
fi

echo -e "\nIf a user-overrides.js file exists in this profile, it will be appended to the user.js.\n"

read -p "Continue Y/N? " -n 1 -r
echo -e "\n\n"

if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -e user.js ]; then
    # backup current user.js
    bakfile="user.js.backup.$(date +"%Y-%m-%d_%H%M")"
    mv user.js "${bakfile}" && echo "Your previous user.js file was backed up: ${bakfile}"
  fi

  # download latest ghacks user.js
  echo "downloading latest ghacks user.js file"
  curl -O ${ghacksjs} && echo "ghacks user.js has been downloaded"

  if [ -e user-overrides.js ]; then
    echo "user-overrides.js file found"
    cat user-overrides.js >> user.js && echo "user-overrides.js has been appended to user.js"
  fi
else
  echo "Process aborted"
fi
