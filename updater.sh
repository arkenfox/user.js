#!/usr/bin/env bash

## ghacks-user.js updater for macOS and Linux

## version: 1.6
## Author: Pat Johnson (@overdodactyl)
## Additional contributors: @earthlng, @ema-pe

## DON'T GO HIGHER THAN VERSION x.9 !! ( because of ASCII comparison in check_for_update() )

#########################
#    Base variables     #
#########################

RED='\033[0;31m'
BLUE='\033[0;34m'
BBLUE='\033[1;34m' 
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'  
NC='\033[0m' # No Color

#########################
#   Working directory   #
#########################

# get current directory
currdir=$(pwd)
## get the full path of this script (readlink for Linux, greadlink for Mac with coreutils installed)
sfp=$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null)
## fallback for Macs without coreutils
if [ -z "$sfp" ]; then sfp=${BASH_SOURCE[0]}; fi
## store the Firefox profile directory
ff_profile="$(dirname "${sfp}")"

#########################
#      Arguments       #
#########################

usage() {                                             
  echo -e ${BLUE}"\nUsage: $0 [-h] [-u] [-d] [-s] [-n] [-b] [-c] [-o OVERRIDE]\n"${NC} 1>&2  # Echo usage string to standard error
  echo -e "Optional Arguments:"
  echo -e "\t-h,\t\t Show this help message and exit."
  echo -e "\t-u,\t\t Update updater.sh and execute silently.  Do not seek confirmation."
  echo -e "\t-d,\t\t Do not look for updates to updater.sh."
  echo -e "\t-s,\t\t Silently update user.js.  Do not seek confirmation."
  echo -e "\t-b,\t\t Only keep one backup of each file."
  echo -e "\t-c,\t\t Create a diff file comparing old and new user.js within userjs_diffs. "
  echo -e "\t-o OVERRIDE,\t Filename or path to overrides file (if different than user-overrides.js)."
  echo -e "\t\t\t If given a directory, all files inside will be appended recursively."
  echo -e "\t\t\t You can pass multiple files or directories by passing a comma separated list."
  echo -e "\t\t\t\t Note: only files ending in the extension .js are appended"
  echo -e "\t\t\t\t IMPORTANT: do not add spaces between files/paths.  Ex: -o file1.js,file2.js,dir1"
  echo -e "\t\t\t\t IMPORTANT: if any files/paths include spaces, wrap the entire argument in quotes."
  echo -e "\t\t\t\t\t Ex: -o \"override folder\" "
  echo -e "\t-n,\t\t Do not append any overrides, even if user-overrides.js exists."
  echo -e
  echo -e "Deprecated Arguments (they still work for now):"
  echo -e "\t-donotupdate,\t Use instead -d"
  echo -e "\t-update,\t Use instead -u"
  echo -e
  exit 1
}

legacy_argument () {
  arg=$1
  echo -e ${ORANGE}"\nWarning: command line arguments have changed."
  echo -e "${arg} has been deprecated and may not work in the future.\n"
  echo -e "Please view the new options using the -h argument."${NC}
}

# Argument defaults
UPDATE="check"
CONFIRM="yes"
OVERRIDE="user-overrides.js"
BACKUP="multiple"
COMPARE=false

if [ $# != 0 ]; then
  legacy_lc="$(echo $1 | tr '[A-Z]' '[a-z]')"
  # Display usage if first arguement is -help or --help
  if [ $1 = "--help" ] || [ $1 = "-help" ]; then
    usage
  elif [ $legacy_lc = "-donotupdate" ]; then
    UPDATE="no"
    legacy_argument $1
  elif [ $legacy_lc = "-update" ]; then
    UPDATE="yes"
    legacy_argument $1
  else
    while getopts ":hudsno:bc " opt; do
      case $opt in 
        h)
          usage
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
          OVERRIDE="none"
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

echo $OVERRIDE


#########################
#     File Handeling    #
#########################

# Download method priority: curl -> wget -> perl
DOWNLOAD_METHOD="not_pearl"
if [[ $(command -v "curl") ]] > /dev/null 2>&1; then
  DOWNLOAD_TO_FILE="curl -O"  
elif [[ $(command -v "wget") ]] > /dev/null 2>&1; then
  DOWNLOAD_TO_FILE="wget"
elif [[ $(command -v "perl") ]]; then
  DOWNLOAD_METHOD="perl"
else
  echo -e ${RED}"This script requires curl, wget or perl to be installed.\nProcess aborted"${NC}
  exit 0
fi

# Download files
download_file () {
  mkdir -p userjs_temps
  cd userjs_temps
  url=$1

  if [ $DOWNLOAD_METHOD = "not_pearl" ]; then
    $DOWNLOAD_TO_FILE ${url}
  else
    http_url=${url/https/http}
    # Variables from the shell are available in Perl's %ENV hash
    # Need to export shell variable so it is visible to subprocesses
    export http_url

    perl -e '
            use File::Fetch;
            my $ff = File::Fetch->new(uri => $ENV{http_url});
            my $where = $ff->fetch() or die $ff->error;
            my $where = $ff->fetch( to => "." );
            '
  fi

  cd ..
}

# Backup a file into userjs_backups
# Replace current version of a file with new one in userjs_temps
backup_file () {
  filename=$1
  mkdir -p userjs_backups
  bakname="userjs_backups/${filename}.backup.$(date +"%Y-%m-%d_%H%M")"
  if [ $BACKUP = "single" ]; then
    bakname="userjs_backups/${filename}.backup"
  fi
  mv "$filename" "$bakname"
  mv "userjs_temps/${filename}" "$filename"
  echo -e "Status: ${GREEN}${filename} has been backed up and replaced with the latest version!${NC}"
}

#########################
#      Initiation       #
#########################

initiate () {
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

confirmation () {
  download_file "https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/user.js" &>/dev/null
  echo -e "Please observe the following information:"
  echo -e "\tFirefox profile:  ${ORANGE}$(pwd)${NC}"
  echo -e "\tAvailable online: ${ORANGE}$(get_userjs_version userjs_temps/user.js)${NC}"
  echo -e "\tCurrently using:  ${ORANGE}$(get_userjs_version user.js)\n${NC}\n"

  if [ $CONFIRM = "yes" ]; then
    echo -e "This script will update to the latest user.js file and append any custom configurations from user-overrides.js. ${RED}Continue Y/N? ${NC}"
    read -p "" -n 1 -r
    echo -e "\n"
    if [[ $REPLY =~ ^[Nn]$ ]]; then
      echo -e ${RED}"Process aborted"${NC}
      return 1
    fi
  fi
}


#########################
#   Update updater.sh   #
#########################

# Returns the version number of a updater.sh file
get_updater_version () {
  filename=$1
  version_regex='5 s/.*[[:blank:]]\([[:digit:]]*\.[[:digit:]]*\)/\1/p'
  echo "$(sed -n "$version_regex" "${ff_profile}/${filename}")"
}

# Update updater.sh
# Default: Check for update, if available, ask user if they want to execute it
# Args:
#   -donotupdate: New version will not be looked for and update will not occur
#   -update: Check for update, if available, execute without asking
update_updater () {
  if [ $UPDATE = "no" ]; then
    # User signified not to check for updates
    return 0
  fi

  download_file "https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/updater.sh" &>/dev/null

  if [[ $(get_updater_version updater.sh) < $(get_updater_version userjs_temps/updater.sh) ]]; then
    if [ $UPDATE = "check" ]; then
      echo -e "There is a newer version of updater.sh available. ${RED}Download and execute Y/N?${NC}"
      read -p "" -n 1 -r
      echo -e "\n\n"
      if [[ $REPLY =~ ^[Nn]$ ]]; then
        # Update available, but user chooses not to update
        return 0
      fi
    fi
  else
    # No update available
    return 0
  fi
  # Backup current updater, execute latest version
  backup_file updater.sh
  chmod +x updater.sh
  ./updater.sh "$@ -d"
  exit 1
}


#########################
#    Update user.js     #
#########################

# Returns version number of a user.js file
get_userjs_version () {
  filename=$1
  echo "$(sed -n "4p" "${ff_profile}/${filename}")"
}

add_override () {
  input=$1
  if [ -f "$input" ]; then
    echo "" >> user.js
    cat "$input" >> user.js
    echo -e "Status: ${GREEN}Override file appended:${NC} ${input}"
  elif [ -d "$input" ]; then
    FSAVEIFS=$IFS
    IFS=$'\n\b' # Set IFS # Set IFS
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

# Applies latest version of user.js and any custom overrides
update_userjs () {
  # Copy a version of user.js to diffs folder for later comparison
  if [ "$COMPARE" = true ]; then
    mkdir -p userjs_diffs
    cp user.js userjs_diffs/past_user.js
  fi
  backup_file user.js
  if [ "$OVERRIDE" != "none" ]; then
    while IFS=',' read -ra FILE; do
      add_override "$FILE"
    done <<< "$OVERRIDE"
  fi
}

remove_comments () {
  from_file=$1 
  to_file=$2
  sed -e 's/^[[:space:]]*\/\/.*$//' -e '/^\/\*/,/\*\//d' -e '/^[[:space:]]*$/d' -e 's/);[[:space:]]\/\/.*/);/' $from_file > $to_file 
 }

create_diff () {
  if [ "$COMPARE" = true ]; then
    pastuserjs=userjs_diffs/past_user.js
    past_nocomments=userjs_diffs/past_userjs.txt
    current_nocomments=userjs_diffs/current_userjs.txt
    remove_comments $pastuserjs $past_nocomments
    remove_comments user.js $current_nocomments
    diffname="userjs_diffs/diff_$(date +"%Y-%m-%d_%H%M").txt"
    diff -w -B -U 0 $past_nocomments $current_nocomments > $diffname
    rm $past_nocomments $current_nocomments $pastuserjs
  fi
}


#########################
#        Execute        #
#########################

## change directory to the Firefox profile directory
cd "$ff_profile"

initiate
update_updater
confirmation && update_userjs
create_diff
rm -rf userjs_temps
cd "${currdir}"
