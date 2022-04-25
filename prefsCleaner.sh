#!/usr/bin/env sh

## prefs.js cleaner for *nix (mostly POSIX) like systems
## author: @claustromaniac
## version: 1.5

## Special thanks to @overdodactyl and @earthlng for a few snippets that
## I stol..*cough* borrowed from the updater.sh

currdir=$(pwd)

# Get the full path of this script
# readlink for systems that have it,
# greadlink for Mac with coreutils installed.
# Note: If you source (.) this script, "$0" will
#       show the invoking shell instead of the path.
#       readlink/greadlink is not POSIX.
ffpdir=$(readlink -f "$0" 2>/dev/null || greadlink -f "$0" 2>/dev/null)

# Fallback for Macs without coreutils
if [ -z "${ffpdir}" ]; then ffpdir="$0"; fi

# Change directory to the Firefox profile directory
cd "$(dirname "${ffpdir}")" || exit 1

fQuit() {
	# Change directory back to the original working directory.
	cd "${currdir}" || exit 1
	[ "$1" -eq 0 ] && printf "%s\n" "$2" || printf "%s\n" "$2" >&2
	exit "$1"
}

fUsage() {
	printf "
Usage: %s [-s]

Optional Arguments:
    -s           Start immediately\n" "$0"
}

fUsage_Help() {
	printf "%s\n\n" "
This script creates a backup of your prefs.js file before doing anything.
It should be safe, but you can follow these steps if something goes wrong:

1. Make sure Firefox is closed.
2. Delete prefs.js in your profile folder.
3. Delete Invalidprefs.js if you have one in the same folder.
4. Rename or copy your latest backup to 'prefs.js'.
5. Run Firefox and see if you notice anything wrong with it.
6. If you do notice something wrong, especially with your extensions,
   and/or with the UI, go to about:support, and restart Firefox with
   add-ons disabled.  Then, restart it again normally, and see if the
   problems were solved.
If you are able to identify the cause of your issues, please bring it up
on the arkenfox user.js GitHub repository:
  https://github.com/arkenfox/user.js"
}

# There are many ways to see if firefox is running or not, some more
# reliable than others.  This isn't elegant and might not be
# future-proof but should at least be compatible with any environment.
fFF_check() {
	while [ -e cookies.sqlite-wal ]  || \
	      [ -e favicons.sqlite-wal ] || \
	      [ -e lock ]                || \
	      [ -e places.sqlite-wal ]
	do
		printf "\nThis Firefox profile seems to be in use.  Close Firefox and try again.\n" >&2
		printf "Press Enter to continue."
		read -r
	done
}

fClean() {
	# The 2nd "grep" is to get the pref surrounded by <"> (2nd <">
	# is followed by <,> so it matches the pref name part).  The
	# reason we do this is so when we run against "$bakfile" we
	# won't hit other prefs modified by the user with the same base.
	# ie:
	#    accessibility.typeaheadfind    = accessibility.typeaheadfind.flashBar
	#    "accessibility.typeaheadfind" != accessibility.typeaheadfind.flashBar
	# Note: "grep -o" is not POSIX
	trackedprefs="$(grep -oE "user_pref[ 	]*\([ 	]*[\"'][^\"']+[\"'][ 	]*,.*\);" user.js | grep -o '".*",')"

	# "$1" is "$bakfile"
	grep -vF "$trackedprefs" "$1" > prefs.js
}

fStart() {
	if [ ! -e user.js ]
	then
		fQuit 1 "user.js not found in the current directory."
	elif [ ! -e prefs.js ]
	then
		fQuit 1 "prefs.js not found in the current directory."
	fi

	fFF_check
	bakfile="prefs.js.$(date +"%Y-%m-%d_%H%M")"
	mv prefs.js "${bakfile}" || fQuit 1 "Operation aborted.
Reason: Could not create backup file: $bakfile"
	printf "prefs.js backed up as: %s\n" "$bakfile"
	printf "Cleaning prefs.js...\n"
	fClean "$bakfile"
	fQuit 0 "All done!"
}

printf "


                ╔══════════════════════════╗
                ║     prefs.js cleaner     ║
                ║    by claustromaniac     ║
                ║           v1.5           ║
                ╚══════════════════════════╝

This script should be run from your Firefox profile directory.

It will remove any entries from prefs.js that also exist in user.js.
This will allow inactive preferences to be reset to their default values.

This Firefox profile shouldn't be in use during the process.\n\n"

[ "$1" = '-s' ] && fStart

while printf "1) Start\n2) Help\n3) Exit\n#? "; read -r option
do
	case "$option" in
	1 | start | Start)
		fStart
		;;
	3 | exit | Exit)
		fQuit 0
		;;
	*)
		fUsage
		fUsage_Help
		;;
	esac
done
