#!/usr/bin/env bash

## ghacks-user.js updater for macOS and Linux

## version: 2.0
## Author: Pat Johnson (@overdodactyl)
## Additional contributors: @earthlng, @ema-pe

## DON'T GO HIGHER THAN VERSION x.9 !! ( because of ASCII comparison in update_updater() )

readonly currdir=$(pwd)

sfp=$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null)
if [ -z "$sfp" ]; then sfp=${BASH_SOURCE[0]}; fi
readonly SCRIPT_DIR=$(dirname "${sfp}")


#########################
#    Base variables     #
#########################

# Colors used for printing
RED='\033[0;31m'
BLUE='\033[0;34m'
BBLUE='\033[1;34m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Argument defaults
UPDATE="check"
CONFIRM="yes"
OVERRIDE="user-overrides.js"
BACKUP="multiple"
COMPARE=false
SKIPOVERRIDE=false
VIEW=false
PROFILE_PATH=false

#########################
#   Working directory   #
#########################

set_wd () {
  declare -r macdir=~/Library/Application\ Support/Firefox/Profiles/
  declare -r nixdir=~/.mozilla/firefox/
  local ff_profile
  if [ "$PROFILE_PATH" = false ]; then
    ff_profile="$SCRIPT_DIR"
  elif [ "$PROFILE_PATH" = "list" ]; then
    local firefox_dir=""
    if [ -d "$macdir" ]; then
      firefox_dir=$macdir
    elif [ -d $nixdir ]; then
      firefox_dir=$nixdir
    else
      echo -e ${RED}"Error: Sorry, -l is not supported for your OS"${NC}
      exit 1
    fi
    numdirs=("$firefox_dir"/*)
    numdirs=${#numdirs[@]}
    if [[ $numdirs == "1" ]]; then 
      ff_profile=$(ls -d "$firefox_dir"*)
    else 
      echo "wrong"
      echo -e ${GREEN}"The following profiles were found:\n"${ORANGE}
      ls -d "$firefox_dir"*
      echo -e ${RED}"\nWhich profile would you like to update?"${NC}
      read -p ""
      echo -e ""
      ff_profile=$REPLY
    fi
  else
    ff_profile="$PROFILE_PATH"
  fi
  cd "$ff_profile"
}

#########################
#      Arguments       #
#########################

usage() {
  echo -e ${BLUE}"\nUsage: $0 [-h] [-p PROFILE] [-u] [-d] [-s] [-n] [-b] [-c] [-v] [-r] [-o OVERRIDE]\n"${NC} 1>&2  # Echo usage string to standard error
  echo -e "Optional Arguments:"
  echo -e "\t-h,\t\t Show this help message and exit."
  echo -e "\t-p PROFILE,\t Path to your Firefox profile (if different than the dir of this script)"
  echo -e "\t-l, \t\t Choose your Firefox profile from a list"
  echo -e "\t\t\t IMPORTANT: if the path include spaces, wrap the entire argument in quotes."
  echo -e "\t-u,\t\t Update updater.sh and execute silently.  Do not seek confirmation."
  echo -e "\t-d,\t\t Do not look for updates to updater.sh."
  echo -e "\t-s,\t\t Silently update user.js.  Do not seek confirmation."
  echo -e "\t-b,\t\t Only keep one backup of each file."
  echo -e "\t-c,\t\t Create a diff file comparing old and new user.js within userjs_diffs. "
  echo -e "\t-o OVERRIDE,\t Filename or path to overrides file (if different than user-overrides.js)."
  echo -e "\t\t\t If used with -p, paths should be relative to PROFILE or absolute paths"
  echo -e "\t\t\t If given a directory, all files inside will be appended recursively."
  echo -e "\t\t\t You can pass multiple files or directories by passing a comma separated list."
  echo -e "\t\t\t\t Note: If a directory is given, only files inside ending in the extension .js are appended"
  echo -e "\t\t\t\t IMPORTANT: do not add spaces between files/paths.  Ex: -o file1.js,file2.js,dir1"
  echo -e "\t\t\t\t IMPORTANT: if any files/paths include spaces, wrap the entire argument in quotes."
  echo -e "\t\t\t\t\t Ex: -o \"override folder\" "
  echo -e "\t-n,\t\t Do not append any overrides, even if user-overrides.js exists."
  echo -e "\t-v,\t\t Open the resulting user.js file."
  echo -e "\t-r,\t\t Only download user.js to a temporary file and open it."
  echo -e
  echo -e "Deprecated Arguments (they still work for now):"
  echo -e "\t-donotupdate,\t Use instead -d"
  echo -e "\t-update,\t Use instead -u"
  echo -e
  exit 1
}

legacy_argument () {
  echo -e ${ORANGE}"\nWarning: command line arguments have changed."
  echo -e "$1 has been deprecated and may not work in the future.\n"
  echo -e "Please view the new options using the -h argument."${NC}
}

#########################
#     File Handling     #
#########################

# Download method priority: curl -> wget
DOWNLOAD_METHOD=""
if [[ $(command -v "curl") ]]; then
  DOWNLOAD_METHOD="curl"
elif [[ $(command -v "wget") ]]; then
  DOWNLOAD_METHOD="wget"
else
  echo -e ${RED}"This script requires curl or wget.\nProcess aborted"${NC}
  exit 0
fi

# Download files
download_file () {
  declare -r url=$1
  declare -r tf=$(mktemp)
  local dlcmd=""

  if [ $DOWNLOAD_METHOD = "curl" ]; then
    dlcmd="curl -o $tf"
  else
    dlcmd="wget -O $tf" 
  fi

  $dlcmd "${url}" &>/dev/null && echo "$tf" || echo "" # return the temp-filename (or empty string on error)
}

open_file () { #expects one argument: file_path
  if [ "$(uname)" == "Darwin" ]; then
    open "$1"
  elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    xdg-open "$1"
  else
    echo -e ${RED}"Error: Sorry, opening files is not supported for your OS."${NC}
  fi
}


show_banner () {
  echo -e
  echo -e
  echo -e        ${BBLUE}"  ############################################################################"
  echo -e                "  ####                                                                    ####"
  echo -e                "  ####                           ghacks user.js                           ####"
  echo -e                "  ####       Hardening the Privacy and Security Settings of Firefox       ####"
  echo -e                "  ####           Maintained by @Thorin-Oakenpants and @earthlng           ####"
  echo -e                "  ####            Updater for macOS and Linux by @overdodactyl            ####"
  echo -e                "  ####                                                                    ####"
  echo -e                "  ############################################################################"${NC}
  echo -e
  echo -e
  echo -e "Documentation for this script is available here: ${CYAN}https://github.com/ghacksuserjs/ghacks-user.js/wiki/3.3-Updater-Scripts${NC}\n"
}


#########################
#   Update updater.sh   #
#########################

# Returns the version number of a updater.sh file
get_updater_version () {
  echo $(sed -n '5 s/.*[[:blank:]]\([[:digit:]]*\.[[:digit:]]*\)/\1/p' "$1")
}

# Update updater.sh
# Default: Check for update, if available, ask user if they want to execute it
# Args:
#   -donotupdate: New version will not be looked for and update will not occur
#   -update: Check for update, if available, execute without asking
update_updater () {
  if [ $UPDATE = "no" ]; then
    return 0 # User signified not to check for updates
  fi

  declare -r tmpfile=$(download_file 'https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/updater.sh')

  if [[ $(get_updater_version "${SCRIPT_DIR}/updater.sh") < $(get_updater_version "${tmpfile}") ]]; then
    if [ $UPDATE = "check" ]; then
      echo -e "There is a newer version of updater.sh available. ${RED}Update and execute Y/N?${NC}"
      read -p "" -n 1 -r
      echo -e "\n\n"
      if [[ $REPLY =~ ^[Nn]$ ]]; then
        return 0 # Update available, but user chooses not to update
      fi
    fi
  else
    return 0 # No update available
  fi
  mv "${tmpfile}" "${SCRIPT_DIR}/updater.sh"
  chmod u+x "${SCRIPT_DIR}/updater.sh"
  "${SCRIPT_DIR}/updater.sh" "$@ -d"
  exit 1
}


#########################
#    Update user.js     #
#########################

# Returns version number of a user.js file
get_userjs_version () {
  echo "$(sed -n '4p' "$1")"
}

add_override () {
  input=$1
  if [ -f "$input" ]; then
    echo "" >> user.js
    cat "$input" >> user.js
    echo -e "Status: ${GREEN}Override file appended:${NC} ${input}"
  elif [ -d "$input" ]; then
    FSAVEIFS=$IFS
    IFS=$'\n\b' # Set IFS
    FILES="${input}"/*.js
    for f in $FILES
    do
      add_override "$f"
    done
    IFS=$SAVEIFS # restore $IFS
  else
    echo -e "${ORANGE}Warning: Could not find override file:${NC} ${input}"
  fi
}

remove_comments () { # expects 2 arguments: from-file and to-file
  sed -e 's/^[[:space:]]*\/\/.*$//' -e '/^\/\*/,/\*\//d' -e '/^[[:space:]]*$/d' -e 's/);[[:space:]]*\/\/.*/);/' "$1" > "$2"
}

# Applies latest version of user.js and any custom overrides
update_userjs () {
  declare -r newfile=$(download_file 'https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/user.js')

  echo 'Please observe the following information:'
  echo -e "\tFirefox profile:  ${ORANGE}$(pwd)${NC}"
  echo -e "\tAvailable online: ${ORANGE}$(get_userjs_version $newfile)${NC}"
  echo -e "\tCurrently using:  ${ORANGE}$(get_userjs_version user.js)\n${NC}\n"

  if [ $CONFIRM = "yes" ]; then
    echo -e "This script will update to the latest user.js file and append any custom configurations from user-overrides.js. ${RED}Continue Y/N? ${NC}"
    read -p "" -n 1 -r
    echo -e "\n"
    if [[ $REPLY =~ ^[Nn]$ ]]; then
      echo -e ${RED}"Process aborted"${NC}
      rm $newfile
      return 1
    fi
  fi

  # Copy a version of user.js to diffs folder for later comparison
  if [ "$COMPARE" = true ]; then
    mkdir -p userjs_diffs
    cp user.js userjs_diffs/past_user.js
  fi

  # backup user.js
  mkdir -p userjs_backups
  local bakname="userjs_backups/user.js.backup.$(date +"%Y-%m-%d_%H%M")"
  if [ $BACKUP = "single" ]; then
    bakname="userjs_backups/user.js.backup"
  fi
  cp user.js "$bakname"

  mv "${newfile}" user.js
  echo -e "Status: ${GREEN}user.js has been backed up and replaced with the latest version!${NC}"

  # apply overrides
  if [ "$SKIPOVERRIDE" = false ]; then
    while IFS=',' read -ra FILE; do
      add_override "$FILE"
    done <<< "$OVERRIDE"
  fi

  # create diff
  if [ "$COMPARE" = true ]; then
    pastuserjs=userjs_diffs/past_user.js
    past_nocomments=userjs_diffs/past_userjs.txt
    current_nocomments=userjs_diffs/current_userjs.txt

    remove_comments $pastuserjs $past_nocomments
    remove_comments user.js $current_nocomments

    diffname="userjs_diffs/diff_$(date +"%Y-%m-%d_%H%M").txt"
    diff=$(diff -w -B -U 0 $past_nocomments $current_nocomments) 
    if [ ! -z "$diff" ]; then
      echo "$diff" > "$diffname"
      echo -e "Status: ${GREEN}A diff file was created:${NC} ${PWD}/${diffname}"
    else
      echo -e "Warning: ${ORANGE}Your new user.js file appears to be identical.  No diff file was created."${NC}
    fi

    rm $past_nocomments $current_nocomments $pastuserjs
  fi

  if [ "$VIEW" = true ]; then
    open_file "${PWD}/user.js"
  fi

}

#########################
#        Execute        #
#########################

if [ $# != 0 ]; then
  readonly legacy_lc=$(echo $1 | tr '[A-Z]' '[a-z]')
  # Display usage if first argument is -help or --help
  if [ $1 = '--help' ] || [ $1 = '-help' ]; then
    usage
  elif [ $legacy_lc = '-donotupdate' ]; then
    UPDATE="no"
    legacy_argument $1
  elif [ $legacy_lc = '-update' ]; then
    UPDATE="yes"
    legacy_argument $1
  else
    while getopts ":hp:ludsno:bcvr" opt; do
      case $opt in
        h)
          usage
          ;;
        p)
          PROFILE_PATH=${OPTARG}
          ;;
        l)
          PROFILE_PATH="list"
          ;;
        u)
          UPDATE="yes"
          ;;
        d)
          UPDATE="no"
          ;;
        s)
          CONFIRM="no"
          ;;
        n)
          SKIPOVERRIDE=true
          ;;
        o)
          OVERRIDE=${OPTARG}
          ;;
        b)
          BACKUP="single"
          ;;
        c)
          COMPARE=true
          ;;
        v)
          VIEW=true
          ;;
        r)
          tfile=$(download_file 'https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/user.js')
          mv $tfile "${tfile}.js"
          echo -e ${ORANGE}"Warning: user.js was saved to temporary file ${tfile}.js"${NC}
          open_file "${tfile}.js"
          exit 1
          ;;
        \?)
          echo -e ${RED}"\n Error! Invalid option: -$OPTARG"${NC} >&2
          usage
          ;;
        :)
          echo -e ${RED}"Error! Option -$OPTARG requires an argument."${NC} >&2
          exit 1
          ;;
      esac
    done
  fi
fi

show_banner
update_updater
set_wd		# changes directory to the Firefox profile (or script-dir)
update_userjs

cd "${currdir}"
