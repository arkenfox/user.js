#!/bin/sh

# prefs.js cleaner for macOS, Linux and other Unix operating systems
# authors: @claustromaniac, @earthlng, @9ao9ai9ar
# version: 3.0

# IMPORTANT! The version string must be on the 5th line of this file
# and must be of the format "version: MAJOR.MINOR" (spaces are optional).
# This restriction is set by the function arkenfox_script_version.

# Example advanced script usage:
# $ env PROBE_MISSING=1 ./prefsCleaner.sh -v
# $ ( . ./prefsCleaner.sh && WGET__IMPLEMENTATION=wget arkenfox_prefs_cleaner )
# $ ( TERM=dumb . ./prefsCleaner.sh && yes | arkenfox_prefs_cleaner 2>./stderr.log )

# This ShellCheck warning is just noise for those who know what they are doing:
# "Note that A && B || C is not if-then-else. C may run when A is true."
# shellcheck disable=SC2015

###############################################################################
####                   === Common utility functions ===                    ####
#### Code that is shared between updater.sh and prefsCleaner.sh, inlined   ####
#### and duplicated only to maintain the same file count as before.        ####
###############################################################################

# https://stackoverflow.com/q/1101957
exit_status_definitions() {
    cut -d'#' -f1 <<'EOF'
_EX_OK=0           # Successful exit status.
_EX_FAIL=1         # Failed exit status.
_EX_USAGE=2        # Command line usage error.
_EX__BASE=64       # Base value for error messages.
_EX_DATAERR=65     # Data format error.
_EX_NOINPUT=66     # Cannot open input.
_EX_NOUSER=67      # Addressee unknown.
_EX_NOHOST=68      # Host name unknown.
_EX_UNAVAILABLE=69 # Service unavailable.
_EX_SOFTWARE=70    # Internal software error.
_EX_OSERR=71       # System error (e.g., can't fork).
_EX_OSFILE=72      # Critical OS file missing.
_EX_CANTCREAT=73   # Can't create (user) output file.
_EX_IOERR=74       # Input/output error.
_EX_TEMPFAIL=75    # Temp failure; user is invited to retry.
_EX_PROTOCOL=76    # Remote error in protocol.
_EX_NOPERM=77      # Permission denied.
_EX_CONFIG=78      # Configuration error.
_EX_NOEXEC=126     # A file to be executed was found, but it was not an executable utility.
_EX_CNF=127        # A utility to be executed was not found.
_EX_SIGHUP=129     # A command was interrupted by SIGHUP (1).
_EX_SIGINT=130     # A command was interrupted by SIGINT (2).
_EX_SIGQUIT=131    # A command was interrupted by SIGQUIT (3).
_EX_SIGABRT=134    # A command was interrupted by SIGABRT (6).
_EX_SIGKILL=137    # A command was interrupted by SIGKILL (9).
_EX_SIGALRM=142    # A command was interrupted by SIGALRM (14).
_EX_SIGTERM=143    # A command was interrupted by SIGTERM (15).
EOF
}

is_option_set() { # arg: name
    [ "$1" = true ] || {
        [ "$1" != false ] && [ "${1:-0}" != 0 ]
    }
}

print_error() { # args: [ARGUMENT]...
    printf '%s\n' "${_TPUT_AF_RED}ERROR: $*${_TPUT_SGR0}" >&2
}

print_info() { # args: [ARGUMENT]...
    printf '%b' "$*" >&2
}

print_ok() { # args: [ARGUMENT]...
    printf '%s\n' "${_TPUT_AF_GREEN}OK: $*${_TPUT_SGR0}" >&2
}

print_warning() { # args: [ARGUMENT]...
    printf '%s\n' "${_TPUT_AF_YELLOW}WARNING: $*${_TPUT_SGR0}" >&2
}

probe_mktemp_() {
    missing_mktemp_() {
        print_error 'Failed to find mktemp or m4 on your system.'
        return "${_EX_CNF:-127}"
    }
    if command -v mktemp >/dev/null 2>&1; then
        MKTEMP__IMPLEMENTATION='mktemp'
    elif command -v m4 >/dev/null 2>&1; then
        MKTEMP__IMPLEMENTATION='m4'
        print_warning 'Unable to find mktemp on your system.' \
            "Substituting m4's mkstemp macro for this missing utility."
    else
        MKTEMP__IMPLEMENTATION=
        is_option_set "$PROBE_MISSING" && missing_mktemp_
    fi
    mktemp_() {
        case $MKTEMP__IMPLEMENTATION in
            'mktemp') command mktemp ;;
            'm4')
                # Copied verbatim from https://unix.stackexchange.com/a/181996.
                echo 'mkstemp(template)' |
                    m4 -D template="${TMPDIR:-/tmp}/baseXXXXXX"
                ;;
            *) missing_mktemp_ ;;
        esac
    }
}

probe_realpath_() {
    # Copied verbatim from https://stackoverflow.com/a/29835459.
    # shellcheck disable=all
    rreadlink() (# Execute the function in a *subshell* to localize variables and the effect of `cd`.

        target=$1 fname= targetDir= CDPATH=

        # Try to make the execution environment as predictable as possible:
        # All commands below are invoked via `command`, so we must make sure that `command`
        # itself is not redefined as an alias or shell function.
        # (Note that command is too inconsistent across shells, so we don't use it.)
        # `command` is a *builtin* in bash, dash, ksh, zsh, and some platforms do not even have
        # an external utility version of it (e.g, Ubuntu).
        # `command` bypasses aliases and shell functions and also finds builtins
        # in bash, dash, and ksh. In zsh, option POSIX_BUILTINS must be turned on for that
        # to happen.
        {
            \unalias command
            \unset -f command
        } >/dev/null 2>&1
        [ -n "$ZSH_VERSION" ] && options[POSIX_BUILTINS]=on # make zsh find *builtins* with `command` too.

        while :; do # Resolve potential symlinks until the ultimate target is found.
            [ -L "$target" ] || [ -e "$target" ] || {
                command printf '%s\n' "ERROR: '$target' does not exist." >&2
                return 1
            }
            command cd "$(command dirname -- "$target")" # Change to target dir; necessary for correct resolution of target path.
            fname=$(command basename -- "$target")       # Extract filename.
            [ "$fname" = '/' ] && fname=''               # !! curiously, `basename /` returns '/'
            if [ -L "$fname" ]; then
                # Extract [next] target path, which may be defined
                # *relative* to the symlink's own directory.
                # Note: We parse `ls -l` output to find the symlink target
                #       which is the only POSIX-compliant, albeit somewhat fragile, way.
                target=$(command ls -l "$fname")
                target=${target#* -> }
                continue # Resolve [next] symlink target.
            fi
            break # Ultimate target reached.
        done
        targetDir=$(command pwd -P) # Get canonical dir. path
        # Output the ultimate target's canonical path.
        # Note that we manually resolve paths ending in /. and /.. to make sure we have a normalized path.
        if [ "$fname" = '.' ]; then
            command printf '%s\n' "${targetDir%/}"
        elif [ "$fname" = '..' ]; then
            # Caveat: something like /var/.. will resolve to /private (assuming /var@ -> /private/var), i.e. the '..' is applied
            # AFTER canonicalization.
            command printf '%s\n' "$(command dirname -- "${targetDir}")"
        else
            command printf '%s\n' "${targetDir%/}/$fname"
        fi
    )
    if command realpath -- . >/dev/null 2>&1; then
        REALPATH__IMPLEMENTATION='realpath'
    elif command readlink -f -- . >/dev/null 2>&1; then
        REALPATH__IMPLEMENTATION='readlink'
    elif command greadlink -f -- . >/dev/null 2>&1; then
        REALPATH__IMPLEMENTATION='greadlink'
    else
        REALPATH__IMPLEMENTATION='rreadlink'
        print_warning 'Unable to find realpath or readlink' \
            'with support for the -f option on your system.' \
            'Substituting custom portable realpath implementation' \
            'for these missing utilities.'
    fi
    realpath_() { # args: FILE...
        if [ "$#" -le 0 ]; then
            echo 'realpath_: missing operand' >&2
            return "${_EX_USAGE:-2}"
        else
            realpath__status="${_EX_OK:-0}"
            while [ "$#" -gt 0 ]; do
                case $REALPATH__IMPLEMENTATION in
                    'realpath') command realpath -- "$1" ;;
                    'readlink') command readlink -f -- "$1" ;;
                    'greadlink') command greadlink -f -- "$1" ;;
                    *)
                        # FIXME: Need to resolve basename target.
                        [ -e "$1" ] && rreadlink "$1" || {
                            dirname=$(dirname "$1") &&
                                dirname_=$(rreadlink "$dirname") &&
                                basename=$(basename "$1") &&
                                printf '%s\n' "${dirname_%/}/$basename"
                        }
                        ;;
                esac
                status=$?
                [ "$status" -eq "${_EX_OK:-0}" ] || realpath__status="$status"
                shift
            done
            return "$realpath__status"
        fi
    }
}

probe_terminal() {
    if [ -t 2 ] && tput setaf bold sgr0 >/dev/null 2>&1; then
        _TPUT_AF_RED=$(tput setaf 1)
        _TPUT_AF_BLUE=$(tput setaf 4)
        _TPUT_AF_BLUE_BOLD=$(tput bold setaf 4)
        _TPUT_AF_GREEN=$(tput setaf 2)
        _TPUT_AF_YELLOW=$(tput setaf 3)
        _TPUT_AF_CYAN=$(tput setaf 6)
        _TPUT_SGR0=$(tput sgr0)
    else
        _TPUT_AF_RED=
        _TPUT_AF_BLUE=
        _TPUT_AF_BLUE_BOLD=
        _TPUT_AF_GREEN=
        _TPUT_AF_YELLOW=
        _TPUT_AF_CYAN=
        _TPUT_SGR0=
    fi
}

probe_wget_() {
    missing_wget_() {
        print_error 'Failed to find curl or wget on your system.'
        return "${_EX_CNF:-127}"
    }
    if command -v curl >/dev/null 2>&1; then
        WGET__IMPLEMENTATION='curl'
    elif command -v wget >/dev/null 2>&1; then
        WGET__IMPLEMENTATION='wget'
    else
        WGET__IMPLEMENTATION=
        is_option_set "$PROBE_MISSING" && missing_wget_
    fi
    wget_() { # args: FILE URL
        case $WGET__IMPLEMENTATION in
            'curl')
                http_code=$(
                    command curl --max-redirs 3 -sfw '%{http_code}' -o "$1" "$2"
                ) &&
                    [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]
                ;;
            'wget') command wget --max-redirect 3 -qO "$1" "$2" ;;
            *) missing_wget_ ;;
        esac
    }
}

# Copied verbatim from https://unix.stackexchange.com/a/464963.
read1() { # arg: <variable-name>
    if [ -t 0 ]; then
        # if stdin is a tty device, put it out of icanon, set min and
        # time to sane value, but don't otherwise touch other input or
        # or local settings (echo, isig, icrnl...). Take a backup of the
        # previous settings beforehand.
        saved_tty_settings=$(stty -g)
        stty -icanon min 1 time 0
    fi
    eval "$1="
    while
        # read one byte, using a work around for the fact that command
        # substitution strips trailing newline characters.
        c=$(
            dd bs=1 count=1 2>/dev/null
            echo .
        )
        c=${c%.}

        # break out of the loop on empty input (eof) or if a full character
        # has been accumulated in the output variable (using "wc -m" to count
        # the number of characters).
        [ -n "$c" ] &&
            eval "$1=\${$1}"'$c
        [ "$(($(printf %s "${'"$1"'}" | wc -m)))" -eq 0 ]'
    do
        continue
    done
    if [ -t 0 ]; then
        # restore settings saved earlier if stdin is a tty device.
        stty "$saved_tty_settings"
    fi
}

_arkenfox_init() {
    # The pipefail option was added in POSIX.1-2024 (SUSv5),
    # and has long been supported by most major POSIX-compatible shells,
    # with the notable exceptions of dash and ksh88-based shells.
    # There are some caveats to switching on this option though:
    # https://mywiki.wooledge.org/BashPitfalls#set_-euo_pipefail.
    # Note that we have to test in a subshell first so that
    # the non-interactive POSIX sh is not aborted by an error in set,
    # a special built-in utility:
    # https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_08_01.
    # shellcheck disable=SC3040 # In POSIX sh, set option pipefail is undefined.
    (set -o pipefail 2>/dev/null) && set -o pipefail
    # Disable the nounset option as yash enables it by default,
    # which is both inconvenient and against the POSIX recommendation.
    # Use ShellCheck or ${parameter?word} to catch unset variables instead.
    # The set -o option form is picked for readability and supported
    # if the system supports the User Portability Utilities option.
    (set +o nounset >/dev/null 2>&1) && set +o nounset || set +u || return
    # To prevent the accidental insertion of SGR commands in the grep output,
    # even when not directed at a terminal, and because the --color option
    # is neither specified in POSIX nor supported by OpenBSD's grep,
    # we explicitly set the following three environment variables:
    export GREP_COLORS='mt=:ms=:mc=:sl=:cx=:fn=:ln=:bn=:se='
    export GREP_COLOR='0' # Obsolete. Use on macOS and some Unix operating systems
    :                     # where the provided grep implementations do not support GREP_COLORS.
    export GREP_OPTIONS=  # Obsolete. Use on systems with GNU grep 2.20 or earlier installed.
    export LC_ALL=C
    exit_status_definitions >/dev/null || return
    while IFS='=' read -r name code; do
        # Trim trailing whitespace characters. Needed for zsh and yash.
        code=${code%"${code##*[![:space:]]}"} # https://stackoverflow.com/a/3352015
        # "When reporting the exit status with the special parameter '?',
        # the shell shall report the full eight bits of exit status available."
        # ―https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_08_02
        # "exit [n]: If n is specified, but its value is not between 0 and 255
        # inclusively, the exit status is undefined."
        # ―https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_21
        [ "$code" -ge 0 ] && [ "$code" -le 255 ] || {
            printf '%s %s\n' 'Undefined exit status in the definition:' \
                "$name=$code." >&2
            return 70 # Internal software error.
        }
        (eval readonly "$name=$code" 2>/dev/null) &&
            eval readonly "$name=$code" || {
            eval [ "\"\$$name\"" = "$code" ] &&
                continue # $name is already readonly and set to $code.
            printf '%s %s\n' "Failed to make the exit status $name readonly." \
                'Try again in a new shell environment?' >&2
            return 75 # Temp failure.
        }
    done <<EOF
$(exit_status_definitions)
EOF
}

# https://kb.mozillazine.org/Profile_folder_-_Firefox#Files
# https://searchfox.org/mozilla-central/source/toolkit/profile/nsProfileLock.cpp
arkenfox_check_firefox_profile_lock() { # arg: DIRECTORY
    lock_file="${1%/}/.parentlock"
    # FIXME: fuser is buggy, unmaintained and not preinstalled on FreeBSD.
    # TODO: Add probe_fuser_ to select among fuser, lsof, fstat and sockstat.
    while [ -f "$lock_file" ] && fuser "$lock_file" >/dev/null 2>&1 ||
        arkenfox_is_firefox_profile_symlink_locked "$1"; do
        print_warning 'This Firefox profile seems to be in use.' \
            'Close Firefox and try again.'
        print_info '\nPress any key to continue. '
        read1 REPLY
        print_info '\n\n'
    done
}

arkenfox_is_firefox_profile_symlink_locked() { # arg: DIRECTORY
    if [ "$(uname)" = 'Darwin' ]; then         # macOS
        symlink_lock="${1%/}/.parentlock"
    else
        symlink_lock="${1%/}/lock"
    fi
    [ -L "$symlink_lock" ] &&
        symlink_lock_target=$(realpath_ "$symlink_lock") ||
        return
    lock_signature=$(
        basename "$symlink_lock_target" |
            sed -n 's/^\(.*\):+\{0,1\}\([0123456789]\{1,\}\)$/\1:\2/p'
    ) &&
        [ -n "$lock_signature" ] &&
        lock_acquired_ip=${lock_signature%:*} &&
        lock_acquired_pid=${lock_signature##*:} || {
        print_error 'Failed to resolve the symlink target signature' \
            "of the lock file: $symlink_lock."
        return "${_EX_DATAERR:?}"
    }
    [ "$lock_acquired_ip" != '127.0.0.1' ] ||
        kill -s 0 "$lock_acquired_pid" 2>/dev/null
}

arkenfox_script_version() { # arg: {updater.sh|prefsCleaner.sh}
    # Why are we not using character classes or range expressions?
    # Because they are locale-dependent: https://unix.stackexchange.com/a/654391.
    version_format='[0123456789]\{1,\}\.[0123456789]\{1,\}'
    version=$(
        sed -n "5s/.*version:[[:blank:]]*\($version_format\).*/\1/p" "$1"
    ) &&
        [ -n "$version" ] &&
        printf '%s\n' "$version" || {
        print_error "Failed to determine the version of the script file: $1."
        return "${_EX_DATAERR:?}"
    }
}

download_file() { # arg: URL
    # The try-finally construct can be implemented as a series of trap commands.
    # However, it is notoriously difficult to write them portably and reliably.
    # Since mktemp_ creates temporary files that are periodically cleared
    # on any sane system, we leave it to the OS or the user to do the cleaning
    # themselves for simplicity's sake.
    output_temp=$(mktemp_) &&
        wget_ "$output_temp" "$1" 2>/dev/null &&
        printf '%s\n' "$output_temp" || {
        print_error "Failed to download file from the URL: $1."
        return "${_EX_UNAVAILABLE:?}"
    }
}

###############################################################################
####              === prefsCleaner.sh specific functions ===               ####
###############################################################################

_arkenfox_prefs_cleaner_init() {
    probe_terminal &&
        PROBE_MISSING=0 probe_wget_ &&
        PROBE_MISSING=0 probe_mktemp_ &&
        probe_realpath_ ||
        return
    # IMPORTANT! ARKENFOX_PREFS_CLEANER_NAME must be synced to the name of this file!
    # This is so that we may somewhat determine if the script is sourced or not
    # by comparing it to the basename of the canonical path of $0,
    # which should be better than hard coding all the names of the
    # interactive and non-interactive POSIX shells in existence.
    # Cf. https://stackoverflow.com/a/28776166.
    [ -z "$ARKENFOX_PREFS_CLEANER_NAME" ] &&
        ARKENFOX_PREFS_CLEANER_NAME='prefsCleaner.sh'
    run_path=$(realpath_ "$0") &&
        run_dir=$(dirname "$run_path") &&
        run_name=$(basename "$run_path") || {
        print_error 'Failed to resolve the run file path.'
        return "${_EX_UNAVAILABLE:?}"
    }
    (
        readonly "_ARKENFOX_PREFS_CLEANER_RUN_PATH=$run_path" \
            "_ARKENFOX_PREFS_CLEANER_RUN_DIR=$run_dir" \
            "_ARKENFOX_PREFS_CLEANER_RUN_NAME=$run_name" 2>/dev/null
    ) &&
        readonly "_ARKENFOX_PREFS_CLEANER_RUN_PATH=$run_path" \
            "_ARKENFOX_PREFS_CLEANER_RUN_DIR=$run_dir" \
            "_ARKENFOX_PREFS_CLEANER_RUN_NAME=$run_name" || {
        [ "$_ARKENFOX_PREFS_CLEANER_RUN_PATH" = "$run_path" ] &&
            [ "$_ARKENFOX_PREFS_CLEANER_RUN_DIR" = "$run_dir" ] &&
            [ "$_ARKENFOX_PREFS_CLEANER_RUN_NAME" = "$run_name" ] || {
            print_error 'Failed to make the resolved run file path readonly.' \
                'Try again in a new shell environment?'
            return "${_EX_TEMPFAIL:?}"
        }
    }
}

arkenfox_prefs_cleaner() { # args: [options]
    arkenfox_prefs_cleaner_parse_options "$@" &&
        arkenfox_prefs_cleaner_set_profile_path &&
        arkenfox_prefs_cleaner_check_nonroot || return
    is_option_set "$_ARKENFOX_PREFS_CLEANER_OPTION_D_DONT_UPDATE" ||
        arkenfox_prefs_cleaner_update_self "$@" || return
    arkenfox_prefs_cleaner_banner
    if is_option_set "$_ARKENFOX_PREFS_CLEANER_OPTION_S_START"; then
        arkenfox_prefs_cleaner_start || return
    else
        print_info 'In order to proceed, select a command below' \
            'by entering its corresponding number.\n\n'
        while print_info '1) Start\n2) Help\n3) Exit\n'; do
            while print_info '#? ' && read -r REPLY; do
                case $REPLY in
                    1)
                        arkenfox_prefs_cleaner_start
                        return
                        ;;
                    2)
                        arkenfox_prefs_cleaner_usage
                        arkenfox_prefs_cleaner_help
                        return
                        ;;
                    3) return ;;
                    '') break ;;
                    *) : ;;
                esac
            done
        done
    fi
}

arkenfox_prefs_cleaner_usage() {
    cat >&2 <<EOF

Usage: $ARKENFOX_PREFS_CLEANER_NAME [-ds]

Options:
    -s           Start immediately.
    -d           Don't auto-update prefsCleaner.sh.

EOF
}

arkenfox_prefs_cleaner_parse_options() { # args: [options]
    OPTIND=1                             # OPTIND must be manually reset between multiple calls to getopts.
    # IMPORTANT! Make sure to initialize all options!
    _ARKENFOX_PREFS_CLEANER_OPTION_D_DONT_UPDATE=
    _ARKENFOX_PREFS_CLEANER_OPTION_S_START=
    while getopts 'sd' opt; do
        case $opt in
            s) _ARKENFOX_PREFS_CLEANER_OPTION_S_START=1 ;;
            d) _ARKENFOX_PREFS_CLEANER_OPTION_D_DONT_UPDATE=1 ;;
            \?)
                arkenfox_prefs_cleaner_usage
                return "${_EX_USAGE:?}"
                ;;
        esac
    done
    if [ -z "$MKTEMP__IMPLEMENTATION" ] || [ -z "$WGET__IMPLEMENTATION" ]; then
        is_option_set "$_ARKENFOX_PREFS_CLEANER_OPTION_D_DONT_UPDATE" ||
            print_warning 'Unable to find curl or wget on your system.' \
                'Automatic self-update disabled!'
        _ARKENFOX_PREFS_CLEANER_OPTION_D_DONT_UPDATE=1
    fi
}

arkenfox_prefs_cleaner_set_profile_path() {
    _ARKENFOX_PROFILE_PATH=$(realpath_ "$_ARKENFOX_PREFS_CLEANER_RUN_DIR") &&
        [ -w "$_ARKENFOX_PROFILE_PATH" ] &&
        cd "$_ARKENFOX_PROFILE_PATH" || {
        print_error 'The path to your Firefox profile' \
            "('$_ARKENFOX_PROFILE_PATH') failed to be a directory to which" \
            'the user has both write and execute access.'
        return "${_EX_UNAVAILABLE:?}"
    }
    _ARKENFOX_PROFILE_USERJS="${_ARKENFOX_PROFILE_PATH%/}/user.js"
    _ARKENFOX_PROFILE_PREFSJS="${_ARKENFOX_PROFILE_PATH%/}/prefs.js"
    _ARKENFOX_PROFILE_PREFSJS_BACKUP_DIR="${_ARKENFOX_PROFILE_PATH%/}/prefsjs_backups"
}

arkenfox_prefs_cleaner_check_nonroot() {
    if [ "$(id -u)" -eq 0 ]; then
        print_error "You shouldn't run this with elevated privileges" \
            '(such as with doas/sudo).'
        return "${_EX_USAGE:?}"
    fi
}

arkenfox_prefs_cleaner_update_self() { # args: [options]
    # Here, we use _ARKENFOX_PROFILE_PATH/ARKENFOX_PREFS_CLEANER_NAME
    # instead of _ARKENFOX_PREFS_CLEANER_RUN_PATH as the latter would be
    # incorrect if the script is sourced.
    : "${_ARKENFOX_PROFILE_PATH:?}"
    arkenfox_prefs_cleaner="${_ARKENFOX_PROFILE_PATH%/}/${ARKENFOX_PREFS_CLEANER_NAME:?}"
    master_prefs_cleaner=$(
        download_file \
            'https://raw.githubusercontent.com/arkenfox/user.js/master/prefsCleaner.sh'
    ) &&
        local_version=$(arkenfox_script_version "$arkenfox_prefs_cleaner") &&
        master_version=$(arkenfox_script_version "$master_prefs_cleaner") ||
        return
    if [ "${local_version%%.*}" -eq "${master_version%%.*}" ] &&
        [ "${local_version#*.}" -lt "${master_version#*.}" ] ||
        [ "${local_version%%.*}" -lt "${master_version%%.*}" ]; then
        mv -f "$master_prefs_cleaner" "$arkenfox_prefs_cleaner" &&
            chmod u+r+x "$arkenfox_prefs_cleaner" || {
            print_error 'Failed to update the arkenfox prefs.js cleaner' \
                'and make it executable.'
            return "${_EX_CANTCREAT:?}"
        }
        "$arkenfox_prefs_cleaner" -d "$@"
    fi
}

arkenfox_prefs_cleaner_banner() {
    cat >&2 <<'EOF'



                   ╔══════════════════════════╗
                   ║     prefs.js cleaner     ║
                   ║    by claustromaniac     ║
                   ║           v2.2           ║
                   ╚══════════════════════════╝

This script should be run from your Firefox profile directory.

It will remove any entries from prefs.js that also exist in user.js.
This will allow inactive preferences to be reset to their default values.

This Firefox profile shouldn't be in use during the process.


EOF
}

arkenfox_prefs_cleaner_help() {
    cat >&2 <<'EOF'

This script creates a backup of your prefs.js file before doing anything.
It should be safe, but you can follow these steps if something goes wrong:

1. Make sure Firefox is closed.
2. Delete prefs.js in your profile folder.
3. Delete Invalidprefs.js if you have one in the same folder.
4. Rename or copy your latest backup to prefs.js.
5. Run Firefox and see if you notice anything wrong with it.
6. If you do notice something wrong, especially with your extensions, and/or with the UI, go to about:support, and restart Firefox with add-ons disabled. Then, restart it again normally, and see if the problems were solved.
If you are able to identify the cause of your issues, please bring it up on the arkenfox user.js GitHub repository.

EOF
}

arkenfox_prefs_cleaner_start() {
    [ -f "${_ARKENFOX_PROFILE_USERJS:?}" ] &&
        [ -f "${_ARKENFOX_PROFILE_PREFSJS:?}" ] || {
        print_error 'Failed to find both user.js and prefs.js' \
            "in the profile path: ${_ARKENFOX_PROFILE_PATH:?}."
        return "${_EX_NOINPUT:?}"
    }
    arkenfox_check_firefox_profile_lock "${_ARKENFOX_PROFILE_PATH:?}"
    backup_dir="${_ARKENFOX_PROFILE_PREFSJS_BACKUP_DIR:?}"
    prefsjs_backup="$backup_dir/prefs.js.backup.$(date +"%Y-%m-%d_%H%M")"
    mkdir -p "$backup_dir" &&
        mv -f "${_ARKENFOX_PROFILE_PREFSJS:?}" "$prefsjs_backup" || {
        print_error "Failed to backup prefs.js: $prefsjs_backup."
        return "${_EX_CANTCREAT:?}"
    }
    print_ok "Your prefs.js has been backed up: $prefsjs_backup."
    print_info 'Cleaning prefs.js...\n\n'
    arkenfox_prefs_cleaner_clean "$prefsjs_backup" || return
    print_ok 'All done!'
}

# FIXME: Rewrite.
arkenfox_prefs_cleaner_clean() { # arg: prefs.js
    prefs_regex="user_pref[[:blank:]]*\([[:blank:]]*[\"']([^\"']+)[\"'][[:blank:]]*,"
    all_userjs_prefs=$(
        grep -E "$prefs_regex" "${_ARKENFOX_PROFILE_USERJS:?}" |
            awk -F"[\"']" '{ print "\"" $2 "\"" }' |
            sort |
            uniq
    ) &&
        unneeded_prefs=$(
            printf '%s\n' "$all_userjs_prefs" |
                grep -E -f - "$1" |
                grep -E -e "^$prefs_regex"
        ) &&
        printf '%s\n' "$unneeded_prefs" |
        grep -v -f - "$1" >"${_ARKENFOX_PROFILE_PREFSJS:?}"
}

_arkenfox_init && _arkenfox_prefs_cleaner_init
init_status=$?
if [ "$init_status" -eq 0 ]; then
    if [ "$_ARKENFOX_PREFS_CLEANER_RUN_NAME" = "$ARKENFOX_PREFS_CLEANER_NAME" ]; then
        arkenfox_prefs_cleaner "$@"
    else
        print_ok 'The prefs.js cleaner script has been successfully sourced.'
        print_warning 'If this is not intentional,' \
            'you may have either made a typo in the shell commands,' \
            'or renamed this file without defining the environment variable' \
            'ARKENFOX_PREFS_CLEANER_NAME to match the new name.' \
            "

         Detected name of the run file: $_ARKENFOX_PREFS_CLEANER_RUN_NAME
         ARKENFOX_PREFS_CLEANER_NAME: $ARKENFOX_PREFS_CLEANER_NAME

        " \
            'Please note that this is not the expected way' \
            'to run the prefs.js cleaner script.' \
            'Dot sourcing support is experimental' \
            'and all function and variable names are still subject to change.'
    fi
else
    # '&& true' to avoid exiting the shell if the shell option errexit is set.
    (exit "$init_status") && true
fi
