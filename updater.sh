#!/usr/bin/env bash
#
# ghacks-user.js updater for GNU/Linux and Mac.
#
# Copyright (C) 2018 Emanuele Petriglia <inbox@emanuelepetriglia.me>.
# All right reserved. This file is licensed under the MIT license.
#
# Special requirements (beyond Bash): wget and mktemp.
#
# Version: 2.0
#
# Please read the wiki or run 'updater.sh --help' to get informations about this
# script.
#
# Report bugs to https://github.com/ghacksuserjs/ghacks-user.js/issues

readonly VERSION="2.0"

# First part of the URL to get updater.sh and user.js.
readonly REPOSITORY="https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js"

# Default values for flags.
QUIET="false"
VERBOSE="false"
FORCE_VERSION="false"
MAKE_BACKUP="false"
UPDATED="false"

# Prints a message to the standard error and exit with error code 1.
error() {
  echo -e "$@" >&2
  exit 1
}

# Prints a message to the standard erorr without terminate execution.
warn() {
  if [[ "$QUIET" == "false" ]]; then
    echo -e "$@" >&2
  fi
}

# Prints a message to the standard output.
log() {
  if [[ "$VERBOSE" == "true" && "$QUIET" == "false" ]]; then
    echo -e "$@"
  fi
}

# Updates the installer script. It sets "true" the variable UPDATED if this
# script is succesfully updated.
update_installer() {
  local TMPFILE="$(mktemp)"
  local UPDATER_URL="https://raw.githubusercontent.com/ghacksuserjs/ghacks-user.js/master/updater.sh"

  log "Downloading latest updater.sh script to $TMPFILE..."
  wget --quiet --output-document "$TMPFILE" "$UPDATER_URL"

  if [[ "$?" == "0" ]]; then
    log "Updater script succesfully downloaded!"
    UPDATED="true"
  else
    error "Failed to download the updater script."
  fi

  mv "$TMPFILE" "$PROGRAM"
  chmod u+x "$PROGRAM"
}

# Prints to the standard output the help message.
show_help() {
  show_version
  cat <<-_EOF
Usage:
    $PROGRAM [--update,-u] [--verbose] [--quiet,-q] [--force-version,-f]
               [--help,-h] [--version,-v] [--backup,-b]

Options:
    -u, --update        First updates the updater script, then the user.js
    --force-version, -f Force to download the user.js according to the
                        Firefox version
    --backup, -b        Make a copy of the old user.js before overwriting it
    --quiet, -q         Print only errors
    --verbose           Print additional informations
    --help              Print this message
    --version           Print script version

Please run this script from your Firefox profile directory.

Please note that it is not given the option '--force-version' this script will
download the latest version available, that can be unstable.

Please report bugs to https://github.com/ghacksuserjs/ghacks-user.js/issues
_EOF
}

# Prints to the standard output the version of this script.
show_version() {
  echo "$PROGRAM for ghacks-user.js version $VERSION"
}

# Runs the newer script with right command line options given to this script.
run_newer_updater() {
  log "Starting newer script..."

  # It recreates the command line options.
  if [[ "$QUIET" == "true" ]]; then
    QUIET="--qiet"
  else
    QUIET=""
  fi

  if [[ "$VERBOSE" == "true" ]]; then
    VERBOSE="--verbose"
  else
    VERBOSE=""
  fi

  if [[ "$FORCE_VERSION" == "true" ]]; then
    FORCE_VERSION="--force-version"
  else
    FORCE_VERSION=""
  fi

  if [[ "$MAKE_BACKUP" == "true" ]]; then
    MAKE_BACKUP="--backup"
  else
    MAKE_BACKUP=""
  fi

  "./$PROGRAM" "$QUIET" "$VERBOSE" "$FORCE_VERSION" "$MAKE"_"$BACKUP"
  exit $?
}

# Updates the user.js.
update_userjs() {
  # Run the recently downloader version of this script.
  if [[ "$UPDATED" == "true" ]]; then
    run_newer_updater
  fi

  local URL="$REPOSITORY/master/user.js"

  # If '--force-version' is given, it will try to download the user.js version
  # according to Firefox version installed on the computer.
  if [[ "$FORCE_VERSION" == "true" ]]; then
    if [[ $(command -v "firefox") ]]; then
      local JS_VERS=$(firefox --version | grep -Eo "[[:digit:]]+.[[:digit:]]+")
      local URL_VERSION="$REPOSITORY/$JS_VERS/user.js"

      wget --quiet --spider "$URL_VERSION"
      if [[ $? != "0" ]]; then
        warn "user.js version $JS_VERS is not available"
      else
        log "user.js $JS_VERS is available"
        URL="$URL_VERSION"
      fi
    else
      warn "Firefox binary not found, so download the latest user.js version"
    fi
  fi

  # Downloades the user.js file on a temporary file.
  local DOWNLOADED_USERJS="$(mktemp)"
  log "Downloading newer user.js to $DOWNLOADED_USERJS..."
  wget --quiet --output-document "$DOWNLOADED_USERJS" "$URL"

  if [[ $? != "0" ]]; then
    error "Failed to download the newer user.js. Check internet connection?"
  fi

  # If '--backup' options is given, it will make a copy of the old user.js if it
  # is present.
  if [[ "$MAKE_BACKUP" == "true" ]]; then
    if [[ -e "user.js" ]]; then
      log "Copying old user.js to user.js.old"
      mv "user.js" "user.js.old"
    else
      warn "Old user.js not found, so no backup"
    fi
  fi

  # Finally move downloaded user.js as the newer user.js and append
  # user-overrides.js if it is present.
  log "Move $DOWNLOADED_USERJS as user.js"
  mv "$DOWNLOADED_USERJS" "user.js"

  if [[ -e "user-overrides.js" ]]; then
    log "Append user-overrides.js to user.js"
    cat "user-overrides.js" >> "user.js"
  else
    log "No user-overrides.js file found"
  fi
}

# Check if a program is installed. If it is not installed prints an error.
check_utily() {
  if [[ -z $(command -v "$1") ]]; then
    error "$1 is not installed. Please install it before executing this script"
  fi
}

PROGRAM="${0##*/}"

check_utily "wget"
check_utily "mktemp"

UPDATE_INSTALLER="false"
SHOW_HELP="false"
SHOW_VERSION="false"

# Parse command line options.
while :; do
  case "$1" in
    --update|-u) shift;           UPDATE_INSTALLER="true";;
    --force-version|-f) shift;    FORCE_VERSION="true";;
    --quiet|-q) shift;            QUIET="true";;
    --verbose) shift;             VERBOSE="true";;
    --help|-h) shift;             SHOW_HELP="true";;
    --version|-v) shift;          SHOW_VERSION="true";;
    --backup|-b) shift;           MAKE_BACKUP="true";;
    "")                           break;; # Default case: no more options.
    *)                            error "Unrecognized option '$1'";;
  esac
done

if [[ "$VERBOSE" == "true" && "$QUIET" == "true" ]]; then
  error "You can't use '--verbose' and '--quiet' options together"
fi

if [[ "$SHOW_HELP" == "true" ]]; then
  show_help
  exit 0
fi

if [[ "$SHOW_VERSION" == "true" ]]; then
  show_version
  exit 0
fi

if [[ "$UPDATE_INSTALLER" == "true" ]]; then
  update_installer
fi

update_userjs

exit 0
