#!/usr/bin/env bash
#
# ghacks-user.js updater for GNU/Linux and Mac.
#
# Copyright (C) 2018 Emanuele Petriglia <inbox@emanuelepetriglia.me>.
# All right reserved. This file is licensed under the MIT license.
#
# Special requirements (beyond Bash): wget and mktemp.
#
# Version: 1.4
#
# Please read the wiki or run 'updater.sh --help' to get informations about this
# script.
#
# Report bugs to https://github.com/ghacksuserjs/ghacks-user.js/issues

readonly VERSION="1.4"

# Default values for flags.
QUIET="false"
VERBOSE="false"
FORCE_VERSION="false"
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

  mv "$TMPFILE" "UPDATER.SH"
}

# Prints to the standard output the help message.
show_help() {
  show_version
  cat <<-_EOF
Usage:
    $PROGRAM [--update,-u] [--verbose] [--quiet,-q] [--force-version,-f]
               [--help,-h] [--version,-v]

Options:
    -u, --update        First updates the updater script, then the user.js
    --force-version, -f Force to download the user.js according to the
                        Firefox version
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

# Updates the user.js.
update_userjs() {
  # Run the recently downloader version of this script.
  if [[ "$UPDATED" == "true" ]]; then
    source "$PROGRAM" $@
    exit 0
  fi
  echo "aggiornato"
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
