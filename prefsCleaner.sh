#!/usr/bin/env

## prefs.js cleaner for Linux/Mac
## author: @claustromaniac
## version: 1.0b

## special thanks to @overdodactyl and @earthlng for a few snippets that I stol..*cough* borrowed from the updater.sh

set -eu
currdir=$(pwd)

## get the full path of this script (readlink for Linux, greadlink for Mac with coreutils installed)
sfp=$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null)

## fallback for Macs without coreutils
if [ -z "$sfp" ]; then sfp=${BASH_SOURCE[0]}; fi

## change directory to the Firefox profile directory
cd "$(dirname "${sfp}")"

fQuit() {
  ## change directory back to the original working directory
  cd "${currdir}"
  exit $1
}

fFF_check() {
  # there are many ways to see if firefox is running or not, some more reliable than others
  # this isn't elegant and might not be future-proof but should at least be compatible with any environment
  while [ -e webappsstore.sqlite-shm ]
  do
    echo -e "\nThis Firefox profile seems to be in use. Close Firefox and try again.\n"
    read -p "Press any key to continue."
  done
}

fClean() {
  # the magic happens here
  prefs="_"
  preffp=`grep -E "user_pref[ 	]*\([ 	]*[\"'][^\"']*[\"'][ 	]*," user.js`
  prefexp="user_pref[ 	]*\([ 	]*[\"']([^\"']*)[\"'][ 	]*,"
  while read -r line || [[ -n "$line" ]]; do
    if [[ $line =~ $prefexp ]]; then
      if [[ $prefs != *${BASH_REMATCH[1]}* ]]; then
        prefs=${prefs}${BASH_REMATCH[1]}
      fi
    fi
  done <<< "$preffp"

  while IFS='' read -r line || [[ -n "$line" ]]; do
    if [[ $line =~ $prefexp ]]; then
      if [[ $prefs != *${BASH_REMATCH[1]}* ]]; then
        echo "$line"
      fi
    else
      echo "$line"
    fi
  done < $1 > prefs.js
}

echo -e "\n                   ╔══════════════════════════╗"
echo "                   ║     prefs.js cleaner     ║"
echo "                   ║    by claustromaniac     ║"
echo "                   ║          v1.0b           ║"
echo "                   ╚══════════════════════════╝"
echo -e "\nThis script should be run from your Firefox profile directory.\n"
echo "It will remove any entries from prefs.js that also exist in user.js."
echo "This will allow inactive preferences to be reset to their default values."
echo -e "\nThis Firefox profile shouldn't be in use during the process.\n"
select option in Start Help Exit;
do
  case $option in
    Start)
      if [ ! -e user.js ]; then
        echo "user.js not found in the current directory."
        fQuit 1
      elif [ ! -e prefs.js ]; then
        echo "prefs.js not found in the current directory."
        fQuit 1
      fi
      
      fFF_check
      bakfile="prefs.js.backup.$(date +"%Y-%m-%d_%H%M")"
      mv prefs.js "${bakfile}" && echo "prefs.js backed up."
      echo "Cleaning prefs.js..."
      fClean $bakfile
      echo "All done!"
      fQuit 0
      ;;
    Help)
      echo -e "\nThis script creates a backup of your prefs.js file before doing anything."
      echo -e "It should be safe, but you can follow these steps if something goes wrong:\n"
      echo "1. Make sure Firefox is closed."
      echo "2. Delete prefs.js in your profile folder."
      echo "3. Delete Invalidprefs.js if you have one in the same folder."
      echo "4. Rename or copy your latest backup to prefs.js."
      echo "5. Run Firefox and see if you notice anything wrong with it."
      echo "6. If you do notice something wrong, especially with your extensions, and/or with the UI, go to about:support, and restart Firefox with add-ons disabled. Then, restart it again normally, and see if the problems were solved."
      echo -e "If you are able to identify the cause of your issues, please bring it up on ghacks-user.js GitHub repository.\n"
      ;;
    Exit)
      fQuit 0
      ;;
  esac
done
