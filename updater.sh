#!/usr/bin/env bash

## ghacks-user.js updater for macOS and Linux

## version: 1.5
## Author: Pat Johnson (@overdodactyl)
## Additional contributors: @earthlng, @ema-pe

## DON'T GO HIGHER THAN VERSION x.9 !! ( because of ASCII comparison in check_for_update() )

#########################
#    Base variables     #
#########################
update_pref=${1:--ask}
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
#     File Handeling    #
#########################

# Download method priority: curl -> wget -> pearl
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
  mv $filename "userjs_backups/${filename}.backup.$(date +"%Y-%m-%d_%H%M")"
  mv "userjs_temps/${filename}" $filename
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
  echo -e 				 "  ####                           ghacks user.js                           ####"
  echo -e                "  ####       Hardening the Privacy and Security Settings of Firefox       ####"
  echo -e                "  ####           Maintained by @Thorin-Oakenpants and @earthlng           ####"                            ####"
  echo -e                "  ####            Updater for macOS and Linux by @overdodactyl            ####"            									 ####"
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

  echo -e "This script will update to the latest user.js file and append any custom configurations from user-overrides.js. ${RED}Continue Y/N? ${NC}"
  read -p "" -n 1 -r
  echo -e "\n"

  if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e ${RED}"Process aborted"${NC}
    return 1
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
  update_pref="$(echo $update_pref | tr '[A-Z]' '[a-z]')"
  if [ $update_pref = "-donotupdate" ]; then
    # User signified not to check for updates
    return 0
  fi

  download_file "https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/updater.sh" &>/dev/null

  if [[ $(get_updater_version updater.sh) < $(get_updater_version userjs_temps/updater.sh) ]]; then
    if [ $update_pref != "-update" ]; then
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
  ./updater.sh -donotupdate
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

# Applies latest version of user.js and any custom overrides
update_userjs () {
  backup_file user.js
  if [ -e user-overrides.js ]; then
    cat user-overrides.js >> user.js
    echo -e "Status: ${GREEN}Your user-overrides.js customizations have been applied!${NC}"
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
rm -rf userjs_temps
cd "${currdir}"
