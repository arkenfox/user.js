#!/bin/sh -fe

# arkenfox user.js updater for UNIX-like systems

die() {
    printf "${red}!! %s${nc}\n" "$*"
    exit 1
}

log() {
    printf "${cya}-> ${nc}%s\n" "$*"
}

war_yn() {
    [ "$prompt" -eq 0 ] && return 0
    printf "${yel}%s${nc} [Y/n] " "$*"
    read_yn
    return $?
}

pmt_yn() {
    [ "$prompt" -eq 0 ] && return 0
    printf "${cya}%s${nc} [Y/n] " "$*"
    read_yn
    return $?
}

read_yn() {
    read -r tmp
    case "$tmp" in
        [Nn]*) return 1 ;;
        *)     return 0 ;;
    esac
}

usage() {
    cat << EOF
usage: updater.sh [options] [<profile>]

Update the user.js file and append custom configuration.

options:
    -e  Activate ESR preferences
    -f  Don't prompt for confirmation
    -h  Show this help message
    -n  Don't append user overrides
EOF
}

# Define color escape sequences
red='\033[31m'
yel='\033[33m'
cya='\033[36m'
nc='\033[m'

# more variables
esr=0
prompt=1
overrides=1
cmd_get=


####################
#       Main       #
####################

# set command for downloading user.js
if command -v curl >/dev/null; then
    cmd_get='curl -Lso'
elif command -v wget >/dev/null; then
    cmd_get='wget -qO'
else
    die This script needs curl or wget, aborting.
fi

# Parse commandline options
while getopts :hefn opt; do
    case "$opt" in
        e) esr=1 ;;
        f) prompt=0 ;;
        h) usage; exit 0 ;;
        n) overrides=0 ;;
        :) die "Option -$OPTARG requires argument." ;;
        ?) die "Invalid option -$OPTARG" ;;
        *) exit ;;
    esac
done

shift "$((OPTIND - 1))"
if [ "$1" ]; then
    if [ -d "$1" ]; then
        dir="$1"
    else
        die "'$1': no such directory"
    fi
fi

# Prompt user for confirmation
pmt_yn 'Update user.js and append custom configuration from user-overrides.js?' \
    || exit 0

[ "$dir" ] || dir="$(echo "$0" | sed -E 's/\/[^\/]*$//')"
cd "$dir" || die "Couldn't change directory to '$dir', aborting."

# Assume that a valid firefox profile directory has a prefs.js file
if ! [ -f "prefs.js" ]; then
    # Prompt if the user wants to continue, even if it doesn't look like a
    # firefox profile directory.
    war_yn "'$PWD' doesn't look like a firefox profile directory, continue anyway?" \
        || exit 0
fi

# Create backup of user.js
if [ -f user.js ]; then
    # use ISO 8601 date format, instead of making up our own.
    bak="userjs_backups/user.js.$(date "+%Y-%m-%dT%H:%M%z")"
    log Creating a backup of user.js in "$bak"
    mkdir -p userjs_backups 2>/dev/null

    cp -f user.js "$bak" 2>/dev/null ||
        die "Couldn't create a backup of user.js, aborting."
fi

# Download user.js
log Fetching new version of user.js
$cmd_get user.js \
    https://raw.githubusercontent.com/arkenfox/user.js/master/user.js \
        || die "Couldn't download user.js, aborting."

# ESR preferences
if [ "$esr" = 1 ]; then
    log Applying ESR preferences
    # shellcheck disable=SC2015 
    sed '/\/\* ESR91\.x still uses all the following prefs/s/^\/\*/\/\//' user.js > _ \
        && mv _ user.js || die "Couldn't apply ESR preferences"
fi

# Apply overrides
if [ "$overrides" -eq 1 ]; then
    if [ -f user-overrides.js ]; then
        log Applying overrides in user-overrides.js
        echo >> user.js
        cat user-overrides.js >> user.js
    else
        log user-overrides.js not found, skipping overriding user preferences...
    fi
fi

log Updating user.js finished successfully!
