#!/usr/bin/env bash

### ghacks-user.js updater for Mac/Linux
## author: @overdodactyl
## version: 1.3

ghacksjs="https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/user.js"
updater="https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/updater.sh"
update_pref=${1:--ask}

currdir=$(pwd)

## get the full path of this script (readlink for Linux, greadlink for Mac with coreutils installed)
sfp=$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null)

## fallback for Macs without coreutils
if [ -z "$sfp" ]; then sfp=${BASH_SOURCE[0]}; fi

## change directory to the Firefox profile directory
cd "$(dirname "${sfp}")"

## Used to check if a new version of updater.sh is available
update_available="no"
check_for_update () {
  online_version="$(curl -s ${updater} | sed -n '5 s/.*[[:blank:]]\([[:digit:]]*\.[[:digit:]]*\)/\1/p')"
  path_to_script="$(dirname "${sfp}")/updater.sh"
  current_version="$(sed -n '5 s/.*[[:blank:]]\([[:digit:]]*\.[[:digit:]]*\)/\1/p' "$path_to_script")"
  if (( $(echo "$online_version > $current_version" | bc -l) )); then
    update_available="yes"
  fi
}

## Used to backup the current script, and download and execute the latest version of updater.sh
update_script () {
  echo -e "This script will be backed up and the latest version of updater.sh will be executed.\n"
  bakfile="updater.sh.backup.$(date +"%Y-%m-%d_%H%M")"
  mv updater.sh "userjs_backups/${bakfile}"
  curl -O ${updater} && echo -e "\nThe latest updater script has been downloaded\n"
  
  # make new file executable
  chmod +x updater.sh

  # execute new updater script
  ./updater.sh -donotupdate

  # exit script
  exit 1
}


main () {
  ## create backup folder if it doesn't exist
  mkdir -p userjs_backups;

  echo -e "\nThis script should be run from your Firefox profile directory.\n"

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
      mv user.js "userjs_backups/${bakfile}" && echo "Your previous user.js file was backed up: userjs_backups/${bakfile}"
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
}


if [ $update_pref = "-donotupdate" ]; then
  main
else
  check_for_update
  if [ $update_available = "no" ]; then
    main
  else
    ## there is an update available 
    if [ $update_pref = "-update" ]; then
      ## update without asking
      update_script
    else 
      read -p "There is a newer version of updater.sh available.  Download and execute?  Y/N? " -n 1 -r
      echo -e "\n\n"
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        update_script
      else
        main
      fi
    fi
  fi
fi