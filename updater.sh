#!/bin/bash

### ghacks-user.js updater for Mac/Linux
## author: @overdodactyl
## version: 1.2

ghacksjs="https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/user.js"

echo -e "\nThis script should be run from your Firefox profile directory.\n"

currdir=$(pwd)

## get the full path of this script (readlink for Linux, greadlink for Mac with coreutils installed)
sfp=$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null)

## fallback for Macs without coreutils
if [ -z "$sfp" ]; then sfp=${BASH_SOURCE[0]}; fi

## change directory to the Firefox profile directory
cd "$(dirname "${sfp}")"

echo -e "Updating the user.js for Firefox profile:\n$(pwd)\n"

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

## change directory back to the original working directory
cd "${currdir}"
