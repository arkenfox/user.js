#!/usr/bin/env bash
#
# ghacks-user.js updater for GNU/Linux and Mac.
#
# Copyright (C) 2018 Emanuele Petriglia <inbox@emanuelepetriglia.me>.
# All right reserved. This file is licensed under the MIT license.
#
# Version: 1.4
#
# Please read the wiki or run 'updater.sh --help' to get informations about this
# script.

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
  echo "ciao"
}

# Prints to the standard output the version of this script.
show_version() {
  echo "$PROGRAM version 1.4"
}

# Updates the user.js.
update_userjs() {
  # Run the recenlty downloader version of this script.
  if [[ "$UPDATED" == "true" ]]; then
    source "$PROGRAM" $@
    exit 0
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

case "$1" in
  --update|-u) shift;           update_installer "$@";;
  --force-version|-f) shift;    FORCE_VERSION="yes";;
  --quiet|-q) shift;            QUIET="yes";;
  --verbose) shift;             VERBOSE="true";;
  --help|-h) shift;             show_help;;
  --version|-v) shift;          show_version;;
esac

update_userjs

exit 0
