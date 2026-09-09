#!/usr/bin/env bash

## arkenfox user.js updater for macOS and Linux

## version: 4.0
## Author: Pat Johnson (@overdodactyl)
## Additional contributors: @earthlng, @ema-pe, @claustromaniac, @infinitewarp

## DON'T GO HIGHER THAN VERSION x.9 !! ( because of ASCII comparison in update_updater() )

# Check if running as root
if [ "${EUID:-"$(id -u)"}" -eq 0 ]; then
	printf "You shouldn't run this with elevated privileges (such as with doas/sudo).\n"
	exit 1
fi

readonly CURRDIR=$(pwd)

SCRIPT_FILE=$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null)
[ -z "$SCRIPT_FILE" ] && SCRIPT_FILE=${BASH_SOURCE[0]}
readonly SCRIPT_DIR=$(dirname "${SCRIPT_FILE}")


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
UPDATE='check'
CONFIRM='yes'
OVERRIDE='user-overrides.js'
BACKUP='multiple'
COMPARE=false
SKIPOVERRIDE=false
VIEW=false
PROFILE_PATH=false
ESR=false

# Download method priority: curl -> wget
DOWNLOAD_METHOD=''
if command -v curl >/dev/null; then
  DOWNLOAD_METHOD='curl --max-redirs 3 -so'
elif command -v wget >/dev/null; then
  DOWNLOAD_METHOD='wget --max-redirect 3 --quiet -O'
else
  echo -e "${RED}This script requires curl or wget.\nProcess aborted${NC}"
  exit 1
fi


show_banner() {
  echo -e "${BBLUE}
                ############################################################################
                ####                                                                    ####
                ####                          arkenfox user.js                          ####
                ####       Hardening the Privacy and Security Settings of Firefox       ####
                ####           Maintained by @Thorin-Oakenpants and @earthlng           ####
                ####            Updater for macOS and Linux by @overdodactyl            ####
                ####                                                                    ####
                ############################################################################"
  echo -e "${NC}\n"
  echo -e "Documentation for this script is available here: ${CYAN}https://github.com/arkenfox/user.js/wiki/5.1-Updater-[Options]#-maclinux${NC}\n"
}

#########################
#      Arguments        #
#########################

usage() {
  echo
  echo -e "${BLUE}Usage: $0 [-bcdehlnrsuv] [-p PROFILE] [-o OVERRIDE]${NC}" 1>&2  # Echo usage string to standard error
  echo -e "
Optional Arguments:
    -h           Show this help message and exit.
    -p PROFILE   Path to your Firefox profile (if different than the dir of this script)
                 IMPORTANT: If the path contains spaces, wrap the entire argument in quotes.
    -l           Choose your Firefox profile from a list
    -u           Update updater.sh and execute silently.  Do not seek confirmation.
    -d           Do not look for updates to updater.sh.
    -s           Silently update user.js.  Do not seek confirmation.
    -b           Only keep one backup of each file.
    -c           Create a diff file comparing old and new user.js within userjs_diffs.
    -o OVERRIDE  Filename or path to overrides file (if different than user-overrides.js).
                 If used with -p, paths should be relative to PROFILE or absolute paths
                 If given a directory, all files inside will be appended recursively.
                 You can pass multiple files or directories by passing a comma separated list.
                     Note: If a directory is given, only files inside ending in the extension .js are appended
                     IMPORTANT: Do not add spaces between files/paths.  Ex: -o file1.js,file2.js,dir1
                     IMPORTANT: If any file/path contains spaces, wrap the entire argument in quotes.
                         Ex: -o \"override folder\"
    -n           Do not append any overrides, even if user-overrides.js exists.
    -v           Open the resulting user.js file.
    -r           Only download user.js to a temporary file and open it.
    -e           Activate ESR related preferences."
  echo
  exit 1
}

#########################
#     File Handling     #
#########################

download_file() { # expects URL as argument ($1)
  declare -r tf=$(mktemp)

  $DOWNLOAD_METHOD "${tf}" "$1" &>/dev/null && echo "$tf" || echo '' # return the temp-filename or empty string on error
}

open_file() { # expects one argument: file_path
  if [ "$(uname)" == 'Darwin' ]; then
    open "$1"
  elif [ "$(uname -s | cut -c -5)" == "Linux" ]; then
    xdg-open "$1"
  else
    echo -e "${RED}Error: Sorry, opening files is not supported for your OS.${NC}"
  fi
}

readIniFile() { # expects one argument: absolute path of profiles.ini
  declare -r inifile="$1"

  # tempIni will contain: [ProfileX], Name=, IsRelative= and Path= (and Default= if present) of the only (if) or the selected (else) profile
  if [ "$(grep -c '^\[Profile' "${inifile}")" -eq "1" ]; then ### only 1 profile found
    tempIni="$(grep '^\[Profile' -A 4 "${inifile}")"
  else
    echo -e "Profiles found:\n––––––––––––––––––––––––––––––"
    ## cmd-substitution to strip trailing newlines and in quotes to keep internal ones:
    echo "$(grep --color=never -E 'Default=[^1]|\[Profile[0-9]*\]|Name=|Path=|^$' "${inifile}")"
    echo '––––––––––––––––––––––––––––––'
    read -p 'Select the profile number ( 0 for Profile0, 1 for Profile1, etc ) : ' -r
    echo -e "\n"
    if [[ $REPLY =~ ^(0|[1-9][0-9]*)$ ]]; then
      tempIni="$(grep "^\[Profile${REPLY}" -A 4 "${inifile}")" || {
        echo -e "${RED}Profile${REPLY} does not exist!${NC}" && exit 1
      }
    else
      echo -e "${RED}Invalid selection!${NC}" && exit 1
    fi
  fi

  # extracting 0 or 1 from the "IsRelative=" line
  declare -r pathisrel=$(sed -n 's/^IsRelative=\([01]\)$/\1/p' <<< "${tempIni}")

  # extracting only the path itself, excluding "Path="
  PROFILE_PATH=$(sed -n 's/^Path=\(.*\)$/\1/p' <<< "${tempIni}")
  # update global variable if path is relative
  [[ ${pathisrel} == "1" ]] && PROFILE_PATH="$(dirname "${inifile}")/${PROFILE_PATH}"
}

getProfilePath() {
  declare -r f1=~/Library/Application\ Support/Firefox/profiles.ini
  declare -r f2=~/.mozilla/firefox/profiles.ini

  if [ "$PROFILE_PATH" = false ]; then
    PROFILE_PATH="$SCRIPT_DIR"
  elif [ "$PROFILE_PATH" = 'list' ]; then
    if [[ -f "$f1" ]]; then
      readIniFile "$f1" # updates PROFILE_PATH or exits on error
    elif [[ -f "$f2" ]]; then
      readIniFile "$f2"
    else
      echo -e "${RED}Error: Sorry, -l is not supported for your OS${NC}"
      exit 1
    fi
  #else
    # PROFILE_PATH already set by user with -p
  fi
}

#########################
#   Update updater.sh   #
#########################

# Returns the version number of a updater.sh file
get_updater_version() {
  echo "$(sed -n '5 s/.*[[:blank:]]\([[:digit:]]*\.[[:digit:]]*\)/\1/p' "$1")"
}

# Update updater.sh
# Default: Check for update, if available, ask user if they want to execute it
# Args:
#   -d: New version will not be looked for and update will not occur
#   -u: Check for update, if available, execute without asking
update_updater() {
  [ "$UPDATE" = 'no' ] && return 0 # User signified not to check for updates

  declare -r tmpfile="$(download_file 'https://raw.githubusercontent.com/arkenfox/user.js/master/updater.sh')"
  [ -z "${tmpfile}" ] && echo -e "${RED}Error! Could not download updater.sh${NC}" && return 1 # check if download failed

  if [[ $(get_updater_version "$SCRIPT_FILE") < $(get_updater_version "${tmpfile}") ]]; then
    if [ "$UPDATE" = 'check' ]; then
      echo -e "There is a newer version of updater.sh available. ${RED}Update and execute Y/N?${NC}"
      read -p "" -n 1 -r
      echo -e "\n\n"
      [[ $REPLY =~ ^[Yy]$ ]] || return 0   # Update available, but user chooses not to update
    fi
  else
    return 0   # No update available
  fi
  mv "${tmpfile}" "$SCRIPT_FILE"
  chmod u+x "$SCRIPT_FILE"
  "$SCRIPT_FILE" "$@" -d
  exit 0
}

#########################
#    Update user.js     #
#########################

# Returns version number of a user.js file
get_userjs_version() {
  [ -e "$1" ] && echo "$(sed -n '4p' "$1")" || echo "Not detected."
}

add_override() {
  input=$1
  if [ -f "$input" ]; then
    echo "" >> user.js
    cat "$input" >> user.js
    echo -e "Status: ${GREEN}Override file appended:${NC} ${input}"
  elif [ -d "$input" ]; then
    SAVEIFS=$IFS
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

remove_comments() { # expects 2 arguments: from-file and to-file
  sed -e '/^\/\*.*\*\/[[:space:]]*$/d' -e '/^\/\*/,/\*\//d' -e 's|^[[:space:]]*//.*$||' -e '/^[[:space:]]*$/d' -e 's|);[[:space:]]*//.*|);|' "$1" > "$2"
}

# Applies latest version of user.js and any custom overrides
update_userjs() {
  declare -r newfile="$(download_file 'https://raw.githubusercontent.com/arkenfox/user.js/master/user.js')"
  [ -z "${newfile}" ] && echo -e "${RED}Error! Could not download user.js${NC}" && return 1 # check if download failed

  echo -e "Please observe the following information:
    Firefox profile:  ${ORANGE}$(pwd)${NC}
    Available online: ${ORANGE}$(get_userjs_version "$newfile")${NC}
    Currently using:  ${ORANGE}$(get_userjs_version user.js)${NC}\n\n"

  if [ "$CONFIRM" = 'yes' ]; then
    echo -e "This script will update to the latest user.js file and append any custom configurations from user-overrides.js. ${RED}Continue Y/N? ${NC}"
    read -p "" -n 1 -r
    echo -e "\n"
    if ! [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${RED}Process aborted${NC}"
      rm "$newfile"
      return 1
    fi
  fi

  # Copy a version of user.js to diffs folder for later comparison
  if [ "$COMPARE" = true ]; then
    mkdir -p userjs_diffs
    cp user.js userjs_diffs/past_user.js &>/dev/null
  fi

  # backup user.js
  mkdir -p userjs_backups
  local bakname="userjs_backups/user.js.backup.$(date +"%Y-%m-%d_%H%M")"
  [ "$BACKUP" = 'single' ] && bakname='userjs_backups/user.js.backup'
  cp user.js "$bakname" &>/dev/null

  mv "${newfile}" user.js
  echo -e "Status: ${GREEN}user.js has been backed up and replaced with the latest version!${NC}"

  if [ "$ESR" = true ]; then
    sed -e 's/\/\* \(ESR[0-9]\{2,\}\.x still uses all.*\)/\/\/ \1/' user.js > user.js.tmp && mv user.js.tmp user.js
    echo -e "Status: ${GREEN}ESR related preferences have been activated!${NC}"
  fi

  # apply overrides
  if [ "$SKIPOVERRIDE" = false ]; then
    while IFS=',' read -ra FILES; do
      for FILE in "${FILES[@]}"; do
        add_override "$FILE"
      done
    done <<< "$OVERRIDE"
  fi

  # create diff
  if [ "$COMPARE" = true ]; then
    pastuserjs='userjs_diffs/past_user.js'
    past_nocomments='userjs_diffs/past_userjs.txt'
    current_nocomments='userjs_diffs/current_userjs.txt'

    remove_comments "$pastuserjs" "$past_nocomments"
    remove_comments user.js "$current_nocomments"

    diffname="userjs_diffs/diff_$(date +"%Y-%m-%d_%H%M").txt"
    diff=$(diff -w -B -U 0 "$past_nocomments" "$current_nocomments")
    if [ -n "$diff" ]; then
      echo "$diff" > "$diffname"
      echo -e "Status: ${GREEN}A diff file was created:${NC} ${PWD}/${diffname}"
    else
      echo -e "Warning: ${ORANGE}Your new user.js file appears to be identical.  No diff file was created.${NC}"
      [ "$BACKUP" = 'multiple' ] && rm "$bakname" &>/dev/null
    fi
    rm "$past_nocomments" "$current_nocomments" "$pastuserjs" &>/dev/null
  fi

  [ "$VIEW" = true ] && open_file "${PWD}/user.js"

  return 0
}

#########################
#        Execute        #
#########################

if [ $# != 0 ]; then
  # Display usage if first argument is -help or --help
  if [ "$1" = '--help' ] || [ "$1" = '-help' ]; then
    usage
  else
    while getopts ":hp:ludsno:bcvre" opt; do
      case $opt in
        h)
          usage
          ;;
        p)
          PROFILE_PATH=${OPTARG}
          ;;
        l)
          PROFILE_PATH='list'
          ;;
        u)
          UPDATE='yes'
          ;;
        d)
          UPDATE='no'
          ;;
        s)
          CONFIRM='no'
          ;;
        n)
          SKIPOVERRIDE=true
          ;;
        o)
          OVERRIDE=${OPTARG}
          ;;
        b)
          BACKUP='single'
          ;;
        c)
          COMPARE=true
          ;;
        v)
          VIEW=true
          ;;
        e)
          ESR=true
          ;;
        r)
          tfile="$(download_file 'https://raw.githubusercontent.com/arkenfox/user.js/master/user.js')"
          [ -z "${tfile}" ] && echo -e "${RED}Error! Could not download user.js${NC}" && exit 1 # check if download failed
          mv "$tfile" "${tfile}.js"
          echo -e "${ORANGE}Warning: user.js was saved to temporary file ${tfile}.js${NC}"
          open_file "${tfile}.js"
          exit 0
          ;;
        \?)
          echo -e "${RED}\n Error! Invalid option: -$OPTARG${NC}" >&2
          usage
          ;;
        :)
          echo -e "${RED}Error! Option -$OPTARG requires an argument.${NC}" >&2
          exit 2
          ;;
      esac
    done
  fi
fi

show_banner
update_updater "$@" || exit $?

getProfilePath # updates PROFILE_PATH or exits on error
cd "$PROFILE_PATH" || exit 1

# Check if any files have the owner as root/wheel.
if [ -n "$(find ./ -user 0)" ]; then
	printf 'It looks like this script was previously run with elevated privileges,
you will need to change ownership of the following files to your user:\n'
	find . -user 0
	cd "$CURRDIR"
	exit 1
fi

update_userjs || exit $?

cd "$CURRDIR"
