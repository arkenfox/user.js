#!/usr/bin/env bash

## prefs.js cleaner for Linux/Mac
## author: @claustromaniac
## version: 1.9

## special thanks to @overdodactyl and @earthlng for a few snippets that I stol..*cough* borrowed from the updater.sh

## DON'T GO HIGHER THAN VERSION x.9 !! ( because of ASCII comparison in update_prefsCleaner() )

# Check if running as root and if any files have the owner/group as root/wheel.
if [ "${EUID:-"$(id -u)"}" -eq 0 ]; then
	printf "You shouldn't run this with elevated privileges (such as with doas/sudo).\n"
	exit 1
elif [ -n "$(find ./ -user 0 -o -group 0)" ]; then
	printf 'It looks like this script was previously run with elevated privileges,
you will need to change ownership of the following files to your user:\n'
	find . -user 0 -o -group 0
	exit 1
fi

readonly CURRDIR=$(pwd)

## get the full path of this script (readlink for Linux, greadlink for Mac with coreutils installed)
SCRIPT_FILE=$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null)

## fallback for Macs without coreutils
[ -z "$SCRIPT_FILE" ] && SCRIPT_FILE=${BASH_SOURCE[0]}


AUTOUPDATE=true
QUICKSTART=false

## download method priority: curl -> wget
DOWNLOAD_METHOD=''
if command -v curl >/dev/null; then
	DOWNLOAD_METHOD='curl --max-redirs 3 -so'
elif command -v wget >/dev/null; then
	DOWNLOAD_METHOD='wget --max-redirect 3 --quiet -O'
else
	AUTOUPDATE=false
	echo -e "No curl or wget detected.\nAutomatic self-update disabled!"
fi

fQuit() {
	## change directory back to the original working directory
	cd "${CURRDIR}"
	[ "$1" -eq 0 ] && echo -e "\n$2" || echo -e "\n$2" >&2
	exit $1
}

fUsage() {
	echo -e "\nUsage: $0 [-ds]"
	echo -e "
Optional Arguments:
    -s           Start immediately
    -d           Don't auto-update prefsCleaner.sh"
}

download_file() { # expects URL as argument ($1)
  declare -r tf=$(mktemp)

  $DOWNLOAD_METHOD "${tf}" "$1" &>/dev/null && echo "$tf" || echo '' # return the temp-filename or empty string on error
}

fFF_check() {
	# there are many ways to see if firefox is running or not, some more reliable than others
	# this isn't elegant and might not be future-proof but should at least be compatible with any environment
	while [ -e lock ]; do
		echo -e "\nThis Firefox profile seems to be in use. Close Firefox and try again.\n" >&2
		read -r -p "Press any key to continue."
	done
}

## returns the version number of a prefsCleaner.sh file
get_prefsCleaner_version() {
	echo "$(sed -n '5 s/.*[[:blank:]]\([[:digit:]]*\.[[:digit:]]*\)/\1/p' "$1")"
}

## updates the prefsCleaner.sh file based on the latest public version
update_prefsCleaner() {
	declare -r tmpfile="$(download_file 'https://raw.githubusercontent.com/arkenfox/user.js/master/prefsCleaner.sh')"
	[ -z "$tmpfile" ] && echo -e "Error! Could not download prefsCleaner.sh" && return 1 # check if download failed

	[[ $(get_prefsCleaner_version "$SCRIPT_FILE") == $(get_prefsCleaner_version "$tmpfile") ]] && return 0

	mv "$tmpfile" "$SCRIPT_FILE"
	chmod u+x "$SCRIPT_FILE"
	"$SCRIPT_FILE" "$@" -d
	exit 0
}

fClean() {
	# the magic happens here
	prefs="@@"
	prefexp="user_pref[ 	]*\([ 	]*[\"']([^\"']+)[\"'][ 	]*,"
	while read -r line; do
		if [[ "$line" =~ $prefexp && $prefs != *"@@${BASH_REMATCH[1]}@@"* ]]; then
			prefs="${prefs}${BASH_REMATCH[1]}@@"
		fi
	done <<< "$(grep -E "$prefexp" user.js)"

	while IFS='' read -r line || [[ -n "$line" ]]; do
		if [[ "$line" =~ ^$prefexp ]]; then
			if [[ $prefs != *"@@${BASH_REMATCH[1]}@@"* ]]; then
				echo "$line"
			fi
		else
			echo "$line"
		fi
	done < "$1" > prefs.js
}

fStart() {
	if [ ! -e user.js ]; then
		fQuit 1 "user.js not found in the current directory."
	elif [ ! -e prefs.js ]; then
		fQuit 1 "prefs.js not found in the current directory."
	fi

	fFF_check
	mkdir -p prefsjs_backups
	bakfile="prefsjs_backups/prefs.js.backup.$(date +"%Y-%m-%d_%H%M")"
	mv prefs.js "${bakfile}" || fQuit 1 "Operation aborted.\nReason: Could not create backup file $bakfile"
	echo -e "\nprefs.js backed up: $bakfile"
	echo "Cleaning prefs.js..."
	fClean "$bakfile"
	fQuit 0 "All done!"
}


while getopts "sd" opt; do
	case $opt in
		s)
			QUICKSTART=true
			;;
		d)
			AUTOUPDATE=false
			;;
	esac
done

## change directory to the Firefox profile directory
cd "$(dirname "${SCRIPT_FILE}")"

[ "$AUTOUPDATE" = true ] && update_prefsCleaner "$@"

echo -e "\n\n"
echo "                   ╔══════════════════════════╗"
echo "                   ║     prefs.js cleaner     ║"
echo "                   ║    by claustromaniac     ║"
echo "                   ║           v1.9           ║"
echo "                   ╚══════════════════════════╝"
echo -e "\nThis script should be run from your Firefox profile directory.\n"
echo "It will remove any entries from prefs.js that also exist in user.js."
echo "This will allow inactive preferences to be reset to their default values."
echo -e "\nThis Firefox profile shouldn't be in use during the process.\n"

[ "$QUICKSTART" = true ] && fStart

echo -e "\nIn order to proceed, select a command below by entering its corresponding number.\n"

select option in Start Help Exit; do
	case $option in
		Start)
			fStart
			;;
		Help)
			fUsage
			echo -e "\nThis script creates a backup of your prefs.js file before doing anything."
			echo -e "It should be safe, but you can follow these steps if something goes wrong:\n"
			echo "1. Make sure Firefox is closed."
			echo "2. Delete prefs.js in your profile folder."
			echo "3. Delete Invalidprefs.js if you have one in the same folder."
			echo "4. Rename or copy your latest backup to prefs.js."
			echo "5. Run Firefox and see if you notice anything wrong with it."
			echo "6. If you do notice something wrong, especially with your extensions, and/or with the UI, go to about:support, and restart Firefox with add-ons disabled. Then, restart it again normally, and see if the problems were solved."
			echo -e "If you are able to identify the cause of your issues, please bring it up on the arkenfox user.js GitHub repository.\n"
			;;
		Exit)
			fQuit 0
			;;
	esac
done

fQuit 0
