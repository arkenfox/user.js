#!/bin/sh

# prefs.js cleaner for macOS, Linux and Unix-like operating systems
# authors: @claustromaniac, @earthlng, @9ao9ai9ar
# version: 3.0

# IMPORTANT: The version string must be on the 5th line of this file
# and must be of the format "version: MAJOR.MINOR" (spaces are optional).
# This restriction is set by the function arkenfox_script_version.

# Example advanced script usage:
# $ yes | tr -d '\n' | env WGET__IMPLEMENTATION=wget ./prefsCleaner.sh 2>/dev/null
# $ TERM=dumb . ./prefsCleaner.sh && arkenfox_prefs_cleaner

# This ShellCheck warning is just noise for those who know what they are doing:
# "Note that A && B || C is not if-then-else. C may run when A is true."
# shellcheck disable=SC2015

###############################################################################
####                   === Common utility functions ===                    ####
#### Code that is shared between updater.sh and prefsCleaner.sh, inlined   ####
#### and duplicated only to maintain the same file count as before.        ####
###############################################################################

# Save the starting errexit shell option for later restoration.
# Note that we do not choose the restoration method of running eval on
# the saved output of `set +o` as that would be problematic because:
# 1. bash turns off the errexit option in command substitutions
#    and also does not clear errexit in a command substitution
#    if `shopt -s inherit_errexit` is in effect:
#    https://unix.stackexchange.com/a/383581.
# 2. oksh fails to restore the errexit option using this method.
# 3. oksh turns off the interactive option in command substitutions,
#    and trying to toggle this option results in an error.
# 4. it clutters up the command history with lots of set commands.
# It is also more trouble than it is worth to try to work around
# these limitations just to restore one shell option we may have changed,
# not counting the posix and pipefail options as we want to keep them enabled.
case $- in
    *e*) _STARTING_SH_OPTION_ERREXIT=1 ;;
    *) _STARTING_SH_OPTION_ERREXIT=0 ;;
esac && {
    # Unset function of the same name so that it is not invoked in place of
    # the `command` regular built-in utility that we are going to be using:
    # https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_09_01_01.
    # In some ksh88 derivatives like the pdksh and XPG4 sh, the exit status
    # will not be 0 if the function to unset is not already defined.
    # In bash, there is no guarantee that the operation will succeed as:
    # 1. readonly functions can not be unset.
    # 2. all built-in utilities, including special built-in utilities
    #    like unset and exit, can be overridden by functions.
    # 3. to make matters worse, even the reserved words can be overridden
    #    by aliases when not in POSIX mode.
    # So we have no choice but to trust that the job is done faithfully.
    # If secure shell scripting is ever a possibility, it is not found in bash.
    \unset -f command && \: Suppress errexit if enabled.
    \: Set a zero exit status for the grouping command.
} &&
    # https://pubs.opengroup.org/onlinepubs/9799919799/utilities/command.html
    # The `command` built-in, when used without options, serves two purposes:
    # 1. it causes the shell to treat the arguments as a simple command
    #    that is not subject to alias substitution and shell function lookup.
    # 2. it suppresses the special characteristics of the special built-ins,
    #    so that an error does not cause a non-interactive script to abort.
    # Though some shells do not respect point 2 above,
    # so a prior test run in a subshell is still required.
    # alias/unalias are not implemented in posh, hush and gash, and executing
    # either in gash will exit the shell, so a safeguard is needed.
    if (\command alias >/dev/null 2>&1) &&
        (\command unalias -a 2>/dev/null); then
        # Save the starting aliases for later restoration, then unset
        # all aliases asap as alias substitution occurs right before parsing:
        # https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_03_01.
        {
            # The `-p` option used by several implementations is absolutely
            # required in order to properly save and restore alias definitions.
            (\command alias -p >/dev/null 2>&1) &&
                _STARTING_ALIASES=$(\command alias -p) ||
                _STARTING_ALIASES=
        } &&
            \command unalias -a
    else
        _STARTING_ALIASES=
    fi && {
    # Enable POSIX mode. Needed for yash, as otherwise parsing will fail on
    # non-ASCII characters if not supported by LC_CTYPE.
    (command set -o posix 2>/dev/null) && command set -o posix
    : Set a zero exit status for the grouping command.
} &&
    # Detect spoofing by external, readonly functions.
    set -o errexit
# In case of a variable assignment error (or any other shell error):
# "In all of the cases shown in the table where an interactive shell
# is required not to exit, the shell shall not perform any further processing
# of the command in which the error occurred."
# ―https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_08_01
# We are being extra cautious here by checking the exit status
# in a separate command because the words "any further processing of
# the command in which the error occurred" are too vague to be relied on.
# For example, if the following shell script is dot sourced in bash:
# ```sh
# readonly r
# r= || echo continue in OR list
# echo next command
# ```
# only "next command" is shown in the output, whereas in most other shells
# no output is produced as the processing is halted at the dot source command.
# The behavior gets more complicated when we start using functions;
# add in the plethora of shell features and all consistency is lost.
case $? in
    0) \: ;;
    *)
        # "The behavior of return when not in a function or dot script
        # differs between the System V shell and the KornShell.
        # In the System V shell this is an error,
        # whereas in the KornShell, the effect is the same as exit."
        # ―https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_24_18
        \command return 69 2>/dev/null # Service unavailable.
        \exit 69                       # Service unavailable.
        ;;
esac

download_file() { # args: url
    # The try-finally construct can be implemented as a set of trap commands.
    # However, it is notoriously difficult to write them portably and reliably.
    # Since mktemp_ creates temporary files that are periodically cleared
    # on any sane system, we leave it to the OS or the user
    # to do the cleaning themselves for simplicity's sake.
    temp=$(mktemp_) &&
        wget_ "$temp" "$1" >/dev/null 2>&1 &&
        printf '%s\n' "$temp" || {
        print_error "Failed to download file from the URL: $1."
        return "${_EX_UNAVAILABLE:?}"
    }
}

# An improvement on the "secure shell script" example demonstrated in
# https://pubs.opengroup.org/onlinepubs/9699919799/utilities/command.html#tag_20_22_17.
init() {
    # Unset all functions whose name is found in the intersection of
    # the standard utilities defined in POSIX.1-2017 and in POSIX.1-2024.
    \set -- admin alias ar asa at awk basename batch bc bg cal cat cd cflow \
        chgrp chmod chown cksum cmp comm command compress cp crontab csplit \
        ctags cut cxref date dd delta df diff dirname du echo ed env ex \
        expand expr false fc fg file find fold fuser gencat get getconf \
        getopts grep hash head iconv id ipcrm ipcs jobs join kill lex link ln \
        locale localedef logger logname lp ls m4 mailx make man mesg mkdir \
        mkfifo more mv newgrp nice nl nm nohup od paste patch pathchk pax pr \
        printf prs ps pwd read renice rm rmdel rmdir sact sccs sed sh sleep \
        sort split strings strip stty tabs tail talk tee test time touch tput \
        tr true tsort tty type ulimit umask unalias uname uncompress unexpand \
        unget uniq unlink uucp uudecode uuencode uustat uux val vi wait wc \
        what who write xargs yacc zcat && {
        # If the unset is unsuccessful, there are two known possibilities:
        # 1. there are readonly functions (bash).
        # 2. at least some in the list are not functions (ksh88).
        # We check each in turn using the built-in utility `typeset` that is
        # available in these shells to see if there are any defined function.
        \unset -f "$@" ||
            while [ "$#" -gt 0 ]; do
                # Evaluates to true if `typeset` is not available.
                ! \command -- typeset -f "$1" >/dev/null &&
                    \shift || {
                    # Reset $# to 0 to break the loop as $1 is a function.
                    \set --
                    # Note that this command is not affected by errexit.
                    ! \: Set a non-zero exit status for the while loop.
                }
            done
    } &&
        if (\unalias -a 2>/dev/null); then
            # It is already too late to run the unalias command at this stage,
            # but might still be useful in the case the script is dot sourced,
            # acting as a reset mechanism.
            \unalias -a
        fi &&
        LC_ALL=C &&
        # To prevent the accidental insertion of SGR commands in grep's output,
        # even when not directed at a terminal, we explicitly set
        # the following three environment variables:
        GREP_COLORS='mt=:ms=:mc=:sl=:cx=:fn=:ln=:bn=:se=' &&
        GREP_COLOR='0' &&
        GREP_OPTIONS= &&
        export LC_ALL GREP_COLORS GREP_COLOR GREP_OPTIONS && {
        path=$(command -p getconf PATH 2>/dev/null) &&
            PATH="$path:$PATH" &&
            export PATH ||
            test "$?" -eq 127 # getconf: command not found (Haiku).
    } && {
        # The pipefail option was added in POSIX.1-2024 (SUSv5),
        # and has long been supported by most major POSIX-compatible shells,
        # with the notable exceptions of dash and ksh88-based shells.
        # There are some caveats to switching on this option though:
        # https://mywiki.wooledge.org/BashPitfalls#set_-euo_pipefail.
        (command set -o pipefail 2>/dev/null) &&
            command set -o pipefail ||
            : Do without.
    } && {
        # In XPG4 sh, `unset -f '['` is an error.
        # In bash 3, `command` always exits the shell on failure
        # when errexit is on, even if guarded by AND/OR lists.
        (unset -f '[') 2>/dev/null &&
            unset -f '[' 2>/dev/null ||
            command -V '[' | { ! grep -q function; }
    } &&
        IFS=$(printf '%b' ' \n\t') &&
        umask 0077 && # cp/mv need execute access to parent directories.
        # Inspired by https://stackoverflow.com/q/1101957.
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
EOF
        } &&
            exit_status_definitions >/dev/null || {
            echo 'Failed to initialize the environment.' >&2
            return 69 # Service unavailable.
        }
    name= && status_= || return
    while IFS='= ' read -r name status_; do
        # "When reporting the exit status with the special parameter '?',
        # the shell shall report the full eight bits of exit status available."
        # ―https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_08_02
        # "The exit status shall be n, if specified, except that
        # the behavior is unspecified if n is not an unsigned decimal integer
        # or is greater than 255."
        # ―https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_21_14
        is_integer "$status_" &&
            [ "$status_" -ge 0 ] && [ "$status_" -le 255 ] || {
            printf '%s %s\n' 'Undefined exit status in the definition:' \
                "$name=$status_." >&2
            return 70 # Internal software error.
        }
        (eval "$name=" 2>/dev/null) &&
            eval "$name=$status_" &&
            eval readonly "$name" || {
            eval [ "\"\$$name\"" = "$status_" ] &&
                continue # $name is already readonly and set to $status_.
            printf '%s %s\n' \
                "Failed to assign $status_ to $name and make $name readonly." \
                'Try again in a new shell environment?' >&2
            return 75 # Temp failure.
        }
    done <<EOF
$(exit_status_definitions)
EOF
}

# Copied from https://unix.stackexchange.com/a/172109.
is_integer() { # args: name
    case $1 in
        "" | - | *[!0123456789-]* | ?*-*) return 1 ;;
        *) return 0 ;;
    esac
}

is_option_set() { # args: name
    [ "${1:-0}" != 0 ] && [ "$1" != false ]
}

print_error() { # args: [string ...]
    printf '%s\n' "${_TPUT_AF_RED?}ERROR: $*${_TPUT_SGR0?}" >&2
}

print_info() { # args: [string ...]
    printf '%b' "$*" >&2
}

print_missing() { # args: [string ...]
    print_error "Failed to find the following utilities on your system: $*."
    return "${_EX_CNF:?}"
}

print_ok() { # args: [string ...]
    printf '%s\n' "${_TPUT_AF_GREEN?}OK: $*${_TPUT_SGR0?}" >&2
}

print_warning() { # args: [string ...]
    printf '%s\n' "${_TPUT_AF_YELLOW?}WARNING: $*${_TPUT_SGR0?}" >&2
}

print_yN() { # args: [string ...]
    printf '%s' "${_TPUT_AF_RED?}$* [y/N]${_TPUT_SGR0?} " >&2
}

probe_fuser_() {
    fuser_() { # args: file
        output= || return
        case ${FUSER__IMPLEMENTATION?} in
            fuser)
                # Do not add --, as on Ubuntu and Arch Linux at least,
                # fuser does not conform to the XBD Utility Syntax Guidelines.
                output=$(command fuser "$1" 2>/dev/null)
                ;;
            lsof)
                # BusyBox lsof ignores all options and arguments.
                output=$(command lsof -lnPt -- "$1")
                ;;
            fstat)
                # Begin after the header line.
                # Not functional on DragonFly 6.4 if used with an argument.
                output=$(command fstat -- "$1" | tail -n +2)
                ;;
            fdinfo) # Haiku
                # Do not add --, as fdinfo does not conform to the
                # XBD Utility Syntax Guidelines.
                output=$(command fdinfo -f "$1")
                ;;
            *)
                print_missing fuser lsof fstat fdinfo
                return
                ;;
        esac && [ -n "$output" ]
    } || return
    util= && set -- fuser lsof fstat fdinfo || return
    for util in "$@"; do
        if command -v -- "$util" >/dev/null; then
            [ "${FUSER__IMPLEMENTATION:-"$util"}" != "$util" ] || {
                FUSER__IMPLEMENTATION=$util
                return
            }
        fi
    done
    print_missing "${FUSER__IMPLEMENTATION:-"$@"}"
}

probe_mktemp_() {
    mktemp_() {
        case ${MKTEMP__IMPLEMENTATION?} in
            mktemp) command mktemp ;;
            m4)
                # Copied from https://unix.stackexchange.com/a/181996.
                echo 'mkstemp(template)' |
                    m4 -D template="${TMPDIR:-/tmp}/baseXXXXXX"
                ;;
            *) print_missing mktemp m4 ;;
        esac
    } || return
    util= && set -- mktemp m4 || return
    for util in "$@"; do
        if command -v -- "$util" >/dev/null; then
            [ "${MKTEMP__IMPLEMENTATION:-"$util"}" != "$util" ] || {
                MKTEMP__IMPLEMENTATION=$util
                return
            }
        fi
    done
    print_missing "${MKTEMP__IMPLEMENTATION:-"$@"}"
}

probe_realpath_() {
    # Adjusted from https://github.com/ko1nksm/readlinkf.
    # Limitation: `readlinkf` cannot handle filenames that end with a newline.
    # Execute in a subshell to localize variables and the effect of cd.
    readlinkf() ( # args: file
        [ "${1:-}" ] || return "${_EX_FAIL:?}"
        # The maximum depth of symbolic links is 40.
        # This value is the same as defined in the Linux 5.6 kernel.
        # However, `readlink -f` has no such limitation.
        max_symlinks=40
        CDPATH= # To avoid changing to an unexpected directory.
        target=$1
        [ -e "${target%/}" ] ||
            target=${1%"${1##*[!/]}"} # Trim trailing slashes.
        [ -d "${target:-/}" ] && target="$target/"
        cd -P . 2>/dev/null || return "${_EX_FAIL:?}"
        while [ "$max_symlinks" -ge 0 ] &&
            max_symlinks=$((max_symlinks - 1)); do
            if [ ! "$target" = "${target%/*}" ]; then
                case $target in
                    /*) cd -P "${target%/*}/" 2>/dev/null || break ;;
                    *) cd -P "./${target%/*}" 2>/dev/null || break ;;
                esac
                target=${target##*/}
            fi
            if [ ! -L "$target" ]; then
                target="${PWD%/}${target:+/}${target}"
                printf '%s\n' "${target:-/}"
                return "${_EX_OK:?}"
            fi
            # `ls -dl` format: "%s %u %s %s %u %s %s -> %s\n",
            #   <file mode>, <number of links>, <owner name>, <group name>,
            #   <size>, <date and time>, <pathname of link>, <contents of link>
            # https://pubs.opengroup.org/onlinepubs/9699919799/utilities/ls.html
            link=$(ls -dl -- "$target" 2>/dev/null) || break
            target=${link#*" $target -> "}
        done
        return "${_EX_FAIL:?}"
    ) || return
    realpath_() { # args: file ...
        if [ "$#" -eq 0 ]; then
            echo 'realpath_: missing operand' >&2
            return "${_EX_USAGE:?}"
        else
            return_status=${_EX_OK:?} || return
            while [ "$#" -gt 0 ]; do
                case ${REALPATH__IMPLEMENTATION?} in
                    realpath) command realpath -- "$1" ;;
                    readlink) command readlink -f -- "$1" ;;
                    grealpath) command grealpath -- "$1" ;;
                    greadlink) command greadlink -f -- "$1" ;;
                    *) readlinkf "$1" ;;
                esac
                status_=$? || return
                [ "$status_" -eq "${_EX_OK:?}" ] || return_status=$status_
                shift
            done
            return "$return_status"
        fi
    } || return
    # Both realpath and readlink -f as found on the BSDs are quite different
    # from their Linux counterparts and even among themselves,
    # instead behaving similarly to the POSIX realpath -e for the most part.
    # The table below details the varying behaviors where the non-header cells
    # note the exit status followed by any output in parentheses:
    # |               | realpath nosuchfile | realpath nosuchtarget | readlink -f nosuchfile | readlink -f nosuchtarget |
    # |---------------|---------------------|-----------------------|------------------------|--------------------------|
    # | FreeBSD 14.2  | 1 (error message)   | 1 (error message)     | 1                      | 1 (fully resolved path)  |
    # | OpenBSD 7.6   | 1 (error message)   | 1 (error message)     | 1 (error message)      | 1 (error message)        |
    # | NetBSD 10.0   | 0                   | 0                     | 1                      | 1 (fully resolved path)  |
    # | DragonFly 6.4 | 1 (error message)   | 1 (error message)     | 1                      | 1 (input path argument)  |
    # It is also worth pointing out that the BusyBox (v1.37.0)
    # realpath and readlink -f exit with status 1 without outputting
    # the fully resolved path if the argument contains no slash characters
    # and does not name a file in the current directory.
    name=$(uname) &&
        case $name in
            NetBSD) : ;;               # NetBSD realpath works as intended.
            Darwin | *BSD | DragonFly) # Other BSDs and macOS should use readlinkf.
                REALPATH__IMPLEMENTATION=${REALPATH__IMPLEMENTATION:-readlinkf}
                ;;
        esac ||
        return
    util= && set -- realpath readlink greadlink || return
    for util in "$@"; do
        if case $util in
            readlink | greadlink) command "$util" -f -- . >/dev/null 2>&1 ;;
            *) command "$util" -- . >/dev/null 2>&1 ;;
        esac then
            [ "${REALPATH__IMPLEMENTATION:-"$util"}" != "$util" ] || {
                REALPATH__IMPLEMENTATION=$util
                return
            }
        fi
    done
    REALPATH__IMPLEMENTATION=readlinkf
}

# https://mywiki.wooledge.org/BashFAQ/037
probe_terminal() {
    # Testing for multiple terminal capabilities at once is unreliable,
    # and the non-POSIX option -S is not recognized by NetBSD's tput,
    # which also requires a numerical argument after setaf/AF,
    # so we test thus, trying both terminfo and termcap names just in case:
    if [ -t 2 ]; then
        tput setaf 0 >/dev/null 2>&1 &&
            tput bold >/dev/null 2>&1 &&
            tput sgr0 >/dev/null 2>&1 &&
            _TPUT_AF_RED=$(tput setaf 1) &&
            _TPUT_AF_GREEN=$(tput setaf 2) &&
            _TPUT_AF_YELLOW=$(tput setaf 3) &&
            _TPUT_AF_BLUE=$(tput setaf 4) &&
            _TPUT_AF_CYAN=$(tput setaf 6) &&
            _TPUT_BOLD_AF_BLUE=$(tput bold)$(tput setaf 4) &&
            _TPUT_SGR0=$(tput sgr0) &&
            return
        tput AF 0 >/dev/null 2>&1 &&
            tput md >/dev/null 2>&1 &&
            tput me >/dev/null 2>&1 &&
            _TPUT_AF_RED=$(tput AF 1) &&
            _TPUT_AF_GREEN=$(tput AF 2) &&
            _TPUT_AF_YELLOW=$(tput AF 3) &&
            _TPUT_AF_BLUE=$(tput AF 4) &&
            _TPUT_AF_CYAN=$(tput AF 6) &&
            _TPUT_BOLD_AF_BLUE=$(tput md)$(tput AF 4) &&
            _TPUT_SGR0=$(tput me) &&
            return
    fi
    _TPUT_AF_RED= &&
        _TPUT_AF_GREEN= &&
        _TPUT_AF_YELLOW= &&
        _TPUT_AF_BLUE= &&
        _TPUT_AF_CYAN= &&
        _TPUT_BOLD_AF_BLUE= &&
        _TPUT_SGR0=
}

probe_wget_() {
    wget_() { # args: file url
        case ${WGET__IMPLEMENTATION?} in
            curl)
                status_=$(
                    command curl -sSfw '%{http_code}' -o "$1" -- "$2"
                ) &&
                    is_integer "$status_" &&
                    [ "$status_" -ge 200 ] && [ "$status_" -lt 300 ]
                ;;
            wget) command wget -O "$1" -- "$2" ;;
            fetch) command fetch -o "$1" -- "$2" ;;
            ftp) command ftp -o "$1" -- "$2" ;; # Progress meter to stdout.
            *) print_missing curl wget fetch ftp ;;
        esac
    } || return
    util= && set -- curl wget fetch ftp || return
    for util in "$@"; do
        if command -v -- "$util" >/dev/null; then
            [ "${WGET__IMPLEMENTATION:-"$util"}" != "$util" ] || {
                WGET__IMPLEMENTATION=$util
                return
            }
        fi
    done
    print_missing "${WGET__IMPLEMENTATION:-"$@"}"
}

# Copied from https://unix.stackexchange.com/a/464963.
read1() { # args: name
    if [ -t 0 ]; then
        # If stdin is a tty device, put it out of icanon,
        # set min and time to sane values, but do not otherwise
        # touch other inputs or local settings (echo, isig, icrnl...).
        # Take a backup of the previous settings beforehand.
        saved_tty_settings=$(stty -g)
        stty -icanon min 1 time 0
    fi
    eval "$1="
    while
        # Read one byte, using a workaround for the fact that
        # command substitution strips trailing newline characters.
        c=$(
            dd bs=1 count=1 2>/dev/null
            echo .
        )
        c=${c%.}
        # Break out of the loop on empty input (eof)
        # or if a full character has been accumulated in the output variable
        # (using `wc -m` to count the number of characters).
        [ -n "$c" ] &&
            eval "$1=\${$1}"'$c
                  [ "$(($(printf %s "${'"$1"'}" | wc -m)))" -eq 0 ]'
    do
        continue
    done
    if [ -t 0 ]; then
        # Restore settings saved earlier if stdin is a tty device.
        stty "$saved_tty_settings"
    fi
}

# https://kb.mozillazine.org/Profile_folder_-_Firefox#Files
# https://searchfox.org/mozilla-central/source/toolkit/profile/nsProfileLock.cpp
arkenfox_check_firefox_profile_lock() { # args: directory
    flock_file=${1%/}/.parentlock || return
    [ -e "$flock_file" ] || [ -L "$flock_file" ] || {
        print_error "Failed to find the .parentlock file under $1."
        return "${_EX_NOINPUT:?}"
    }
    # This way of writing the while loop ensures the proper exit status
    # is returned to the caller function.
    while :; do
        fuser_ "$flock_file" ||
            arkenfox_is_firefox_profile_symlink_locked "$1" || {
            # An exit status of _EX__BASE indicates that
            # the user wishes to proceed with the program.
            [ "$?" -eq "${_EX__BASE:?}" ] || return
            break
        }
        print_warning 'This Firefox profile seems to be in use.' \
            'Close Firefox and try again.'
        print_info '\nPress any key to continue. '
        read1 REPLY
        print_info '\n\n'
    done
}

arkenfox_check_nonroot() {
    name=$(uname) || return
    # Haiku is a single-user operating system.
    [ "$name" != 'Haiku' ] || return "${_EX_OK:?}"
    id=$(id -u) || return
    if is_integer "$id" && [ "$id" -eq 0 ]; then
        print_error "You shouldn't run this with elevated privileges" \
            '(such as with doas/sudo).'
        return "${_EX_USAGE:?}"
    fi
}

arkenfox_is_firefox_profile_symlink_locked() { # args: directory
    name=$(uname) &&
        if [ "$name" = 'Darwin' ]; then # macOS
            lock_file=${1%/}/.parentlock
        else
            lock_file=${1%/}/lock
        fi ||
        return
    [ -L "$lock_file" ] || {
        print_error "$lock_file is not a symbolic link!"
        return "${_EX_DATAERR:?}"
    }
    target=$(realpath_ "$lock_file") &&
        lock_signature=$(
            basename -- "$target" |
                # Character classes and range expressions are locale-dependent:
                # https://unix.stackexchange.com/a/654391.
                sed -n 's/^\(.*\):+\{0,1\}\([0123456789]\{1,\}\)$/\1:\2/p'
        ) &&
        [ -n "$lock_signature" ] &&
        lock_acquired_ip=${lock_signature%:*} &&
        lock_acquired_pid=${lock_signature##*:} || {
        print_error 'Failed to resolve the symlink target signature' \
            "of the lock file: $lock_file."
        return "${_EX_DATAERR:?}"
    }
    if [ "$lock_acquired_ip" = '127.0.0.1' ]; then
        kill -s 0 "$lock_acquired_pid" 2>/dev/null
        [ "$?" -eq "${_EX_OK:?}" ] && return || return "${_EX__BASE:?}"
    else
        print_warning 'Unable to determine if the Firefox profile' \
            'is being used or not.'
        print_yN 'Proceed anyway?'
        read1 REPLY || return
        print_info '\n\n'
        [ "$REPLY" = 'Y' ] || [ "$REPLY" = 'y' ] || return "${_EX_OK:?}"
        return "${_EX__BASE:?}"
    fi
}

arkenfox_script_version() { # args: file
    # Character classes and range expressions are locale-dependent:
    # https://unix.stackexchange.com/a/654391.
    format='[0123456789]\{1,\}\.[0123456789]\{1,\}' &&
        version=$(
            sed -n -- "5s/.*version:[[:blank:]]*\($format\).*/\1/p" "$1"
        ) &&
        [ -n "$version" ] &&
        printf '%s\n' "$version" || {
        print_error "Failed to determine the version of the script file: $1."
        return "${_EX_DATAERR:?}"
    }
}

arkenfox_select_firefox_profile() { # args: file
    while :; do
        # Adapted from https://unix.stackexchange.com/a/786827.
        profiles=$(
            # Character classes and range expressions are locale-dependent:
            # https://unix.stackexchange.com/a/654391.
            awk -- '/^[[]/ { section = substr($0, 1) }
                    (section ~ /^[[]Profile[0123456789]+[]]$/) { print }' "$1"
        ) &&
            profile_count=$(
                printf '%s' "$profiles" |
                    grep -Ec '^[[]Profile[0123456789]+[]]$'
            ) &&
            is_integer "$profile_count" && [ "$profile_count" -gt 0 ] || {
            print_error 'Failed to find the profile sections in the INI file.'
            return "${_EX_DATAERR:?}"
        }
        if [ "$profile_count" -eq 1 ]; then
            printf '%s\n' "$profiles"
            return
        else
            profiles_display=$(
                printf '%s\n\n' "$profiles" |
                    grep -Ev -e '^IsRelative=' -e '^Default=' &&
                    awk -- '/^[[]/ { section = substr($0, 2) }
                            ((section ~ /^Install/) && /^Default=/) \
                            { print }' "$1"
            ) || return
            cat >&2 <<EOF
Profiles found:
––––––––––––––––––––––––––––––
$profiles_display
––––––––––––––––––––––––––––––
EOF
            print_info 'Select the profile number' \
                '(0 for Profile0, 1 for Profile1, etc; q to quit): '
            read -r REPLY || return
            print_info '\n'
            if is_integer "$REPLY" && [ "$REPLY" -ge 0 ]; then
                profile_selected=$(
                    printf '%s\n' "$profiles" |
                        awk -v id="$REPLY" \
                            'BEGIN { regex = "^[[]Profile"id"[]]$" }
                                     /^[[]/ { section = substr($0, 1) }
                                     section ~ regex { print }'
                ) &&
                    [ -n "$profile_selected" ] &&
                    printf '%s\n' "$profile_selected" &&
                    return ||
                    print_warning "Invalid profile number: $REPLY."
            elif [ "$REPLY" = 'Q' ] || [ "$REPLY" = 'q' ]; then
                return "${_EX_FAIL:?}"
            else
                print_warning 'Invalid input: not a whole number.'
            fi
        fi
    done
}

# https://kb.mozillazine.org/Profiles.ini_file
arkenfox_select_firefox_profile_path() {
    name=$(uname) || return
    if [ "$name" = 'Darwin' ]; then # macOS
        profiles_ini=$HOME/Library/Application\ Support/Firefox/profiles.ini
    else
        profiles_ini=$HOME/.mozilla/firefox/profiles.ini
    fi &&
        [ -f "$profiles_ini" ] || {
        print_error 'Failed to find the Firefox profiles.ini file' \
            'at the standard location.'
        return "${_EX_NOINPUT:?}"
    }
    profile_selected=$(arkenfox_select_firefox_profile "$profiles_ini") &&
        path=$(
            printf '%s\n' "$profile_selected" | sed -n 's/^Path=\(.*\)$/\1/p'
        ) &&
        is_relative=$(
            printf '%s\n' "$profile_selected" |
                sed -n 's/^IsRelative=\([01]\)$/\1/p'
        ) ||
        return
    [ -n "$path" ] && [ -n "$is_relative" ] || {
        print_error 'Failed to get the value of the Path or IsRelative key' \
            'from the selected Firefox profile section.'
        return "${_EX_DATAERR:?}"
    }
    if [ "$is_relative" = 1 ]; then
        dir_name=$(dirname -- "$profiles_ini") &&
            path=${dir_name%/}/$path || {
            print_error 'Failed to convert the selected Firefox profile path' \
                'from relative to absolute.'
            return "${_EX_DATAERR:?}"
        }
    fi
    printf '%s\n' "$path"
}

init

###############################################################################
####              === prefsCleaner.sh specific functions ===               ####
###############################################################################

\: \. the above inlined file.
case $? in
    0) \: ;;
    *)
        \command return 69 2>/dev/null # Service unavailable.
        \exit 69                       # Service unavailable.
        ;;
esac

arkenfox_prefs_cleaner_init() {
    probe_terminal && probe_realpath_ || return
    # IMPORTANT: ARKENFOX_PREFS_CLEANER_NAME must be synced to
    # the name of this file!
    # This is so that we may somewhat determine if the script is sourced or not
    # by comparing it to the basename of the canonical path of $0,
    # which should be better than hard coding all the names of
    # the interactive and non-interactive POSIX shells in existence.
    # Cf. https://stackoverflow.com/a/28776166.
    ARKENFOX_PREFS_CLEANER_NAME=${ARKENFOX_PREFS_CLEANER_NAME:-prefsCleaner.sh} || return
    (_ARKENFOX_REPO_DOWNLOAD_URL_ROOT=) 2>/dev/null &&
        _ARKENFOX_REPO_DOWNLOAD_URL_ROOT='https://raw.githubusercontent.com/arkenfox/user.js/master' &&
        readonly _ARKENFOX_REPO_DOWNLOAD_URL_ROOT ||
        test "$_ARKENFOX_REPO_DOWNLOAD_URL_ROOT" = \
            'https://raw.githubusercontent.com/arkenfox/user.js/master' || {
        print_error 'Failed to assign the arkenfox repository download URL' \
            'and make it readonly. Try again in a new shell environment?'
        return "${_EX_TEMPFAIL:?}"
    }
    path=$(realpath_ "$0") &&
        dir_name=$(dirname -- "$path") &&
        base_name=$(basename -- "$path") || {
        print_error 'Failed to resolve the run file path.'
        return "${_EX_UNAVAILABLE:?}"
    }
    (
        _ARKENFOX_PREFS_CLEANER_RUN_PATH= &&
            _ARKENFOX_PREFS_CLEANER_RUN_DIR= &&
            _ARKENFOX_PREFS_CLEANER_RUN_NAME=
    ) 2>/dev/null &&
        _ARKENFOX_PREFS_CLEANER_RUN_PATH=$path &&
        _ARKENFOX_PREFS_CLEANER_RUN_DIR=$dir_name &&
        _ARKENFOX_PREFS_CLEANER_RUN_NAME=$base_name &&
        readonly _ARKENFOX_PREFS_CLEANER_RUN_PATH \
            _ARKENFOX_PREFS_CLEANER_RUN_DIR \
            _ARKENFOX_PREFS_CLEANER_RUN_NAME || {
        [ "$_ARKENFOX_PREFS_CLEANER_RUN_PATH" = "$path" ] &&
            [ "$_ARKENFOX_PREFS_CLEANER_RUN_DIR" = "$dir_name" ] &&
            [ "$_ARKENFOX_PREFS_CLEANER_RUN_NAME" = "$base_name" ] || {
            print_error 'Failed to make the resolved run file path readonly.' \
                'Try again in a new shell environment?'
            return "${_EX_TEMPFAIL:?}"
        }
    }
}

arkenfox_prefs_cleaner() { # args: [option ...]
    arkenfox_prefs_cleaner_parse_options "$@" || return
    arkenfox_prefs_cleaner_exec_general_options || {
        status_=$? || return
        # An exit status of _EX__BASE indicates that a command tied to
        # a general option has been executed successfully.
        [ "$status_" -eq "${_EX__BASE:?}" ] &&
            return "${_EX_OK:?}" ||
            return "$status_"
    }
    arkenfox_check_nonroot &&
        arkenfox_prefs_cleaner_update_self "$@" &&
        if is_option_set \
            "${_ARKENFOX_PREFS_CLEANER_OPTION_S_START_IMMEDIATELY?}"; then
            arkenfox_prefs_cleaner_start
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

Usage: ${ARKENFOX_PREFS_CLEANER_NAME:?} [-hdsl] [-p PROFILE]

Options:
    -h           Show this help message and exit.
    -d           Don't auto-update prefsCleaner.sh.
    -s           Start immediately.
    -p PROFILE   Path to your Firefox profile (if different from the containing directory of this script).
                 IMPORTANT: If the path contains spaces, wrap the entire argument in quotes.
    -l           Choose your Firefox profile from a list.

EOF
}

arkenfox_prefs_cleaner_parse_options() { # args: [option ...]
    name= &&
        # OPTIND must be manually reset between multiple calls to getopts.
        OPTIND=1 &&
        _ARKENFOX_PREFS_CLEANER_OPTIONS_DISJOINT=0 &&
        _ARKENFOX_PREFS_CLEANER_OPTION_H_HELP= &&
        _ARKENFOX_PREFS_CLEANER_OPTION_D_DONT_UPDATE= &&
        _ARKENFOX_PREFS_CLEANER_OPTION_S_START_IMMEDIATELY= &&
        _ARKENFOX_PREFS_CLEANER_OPTION_P_PROFILE_PATH= &&
        _ARKENFOX_PREFS_CLEANER_OPTION_L_LIST_PROFILES= ||
        return
    while getopts 'hdsp:l' name; do
        ! is_option_set "$_ARKENFOX_PREFS_CLEANER_OPTIONS_DISJOINT" || {
            arkenfox_prefs_cleaner_usage
            return "${_EX_USAGE:?}"
        }
        case $name in
            h)
                _ARKENFOX_PREFS_CLEANER_OPTION_H_HELP=1
                _ARKENFOX_PREFS_CLEANER_OPTIONS_DISJOINT=1
                ;;
            d) _ARKENFOX_PREFS_CLEANER_OPTION_D_DONT_UPDATE=1 ;;
            s) _ARKENFOX_PREFS_CLEANER_OPTION_S_START_IMMEDIATELY=1 ;;
            p) _ARKENFOX_PREFS_CLEANER_OPTION_P_PROFILE_PATH=$OPTARG ;;
            l) _ARKENFOX_PREFS_CLEANER_OPTION_L_LIST_PROFILES=1 ;;
            \?)
                arkenfox_prefs_cleaner_usage
                return "${_EX_USAGE:?}"
                ;;
            :) return "${_EX_USAGE:?}" ;;
        esac
    done
}

arkenfox_prefs_cleaner_exec_general_options() {
    if is_option_set "${_ARKENFOX_PREFS_CLEANER_OPTION_H_HELP?}"; then
        arkenfox_prefs_cleaner_usage 2>&1
    else
        return "${_EX_OK:?}"
    fi
    # We want to return from the caller function as well
    # if a command tied to a general option is executed.
    # To achieve that, we translate an exit status of _EX_OK to _EX__BASE
    # and handle the retranslation back to its original exit status
    # in the caller function.
    status_=$? || return
    if [ "$status_" -eq "${_EX_OK:?}" ]; then
        return "${_EX__BASE:?}"
    else
        return "$status_"
    fi
}

arkenfox_prefs_cleaner_update_self() { # args: [option ...]
    is_option_set "${_ARKENFOX_PREFS_CLEANER_OPTION_D_DONT_UPDATE?}" &&
        return "${_EX_OK:?}" || {
        probe_mktemp_ &&
            probe_wget_ || {
            print_warning 'No download feature is absent.' \
                'Automatic self-update disabled!'
            return "${_EX_OK:?}"
        }
    }
    downloaded_file=$(
        download_file "${_ARKENFOX_REPO_DOWNLOAD_URL_ROOT:?}/prefsCleaner.sh"
    ) ||
        return
    local_version=$(
        arkenfox_script_version "${_ARKENFOX_PREFS_CLEANER_RUN_PATH:?}"
    ) &&
        downloaded_version=$(
            arkenfox_script_version "$downloaded_file"
        ) &&
        local_version_major=${local_version%%.*} &&
        is_integer "$local_version_major" &&
        local_version_minor=${local_version#*.} &&
        is_integer "$local_version_minor" &&
        downloaded_version_major=${downloaded_version%%.*} &&
        is_integer "$downloaded_version_major" &&
        downloaded_version_minor=${downloaded_version#*.} &&
        is_integer "$downloaded_version_minor" || {
        print_error 'Failed to obtain valid version parts for comparison.'
        return "${_EX_DATAERR:?}"
    }
    if [ "$local_version_major" -eq "$downloaded_version_major" ] &&
        [ "$local_version_minor" -lt "$downloaded_version_minor" ] ||
        [ "$local_version_major" -lt "$downloaded_version_major" ]; then
        # Suppress diagnostic message on FreeBSD/DragonFly
        # (mv: set owner/group: Operation not permitted).
        mv -f -- \
            "$downloaded_file" \
            "${_ARKENFOX_PREFS_CLEANER_RUN_PATH:?}" 2>/dev/null &&
            chmod -- u+rx "${_ARKENFOX_PREFS_CLEANER_RUN_PATH:?}" || {
            print_error 'Failed to update the arkenfox prefs.js cleaner' \
                'and make it executable.'
            return "${_EX_CANTCREAT:?}"
        }
        "${_ARKENFOX_PREFS_CLEANER_RUN_PATH:?}" -d "$@"
    fi
}

arkenfox_prefs_cleaner_start() {
    probe_mktemp_ &&
        probe_fuser_ &&
        arkenfox_prefs_cleaner_set_profile_path ||
        return
    [ -f "${_ARKENFOX_PROFILE_USERJS:?}" ] &&
        [ -f "${_ARKENFOX_PROFILE_PREFSJS:?}" ] || {
        print_error 'Failed to find both user.js and prefs.js' \
            "in the profile path: ${_ARKENFOX_PROFILE_PATH:?}."
        return "${_EX_NOINPUT:?}"
    }
    arkenfox_prefs_cleaner_banner
    arkenfox_check_firefox_profile_lock "${_ARKENFOX_PROFILE_PATH:?}" &&
        backup=${_ARKENFOX_PROFILE_PREFSJS_BACKUP_DIR:?} &&
        backup=${backup%/}/prefs.js.backup.$(date +"%Y-%m-%d_%H%M") ||
        return
    # Add the -p option so that mkdir does not return a >0 exit status
    # if any of the specified directories already exists.
    mkdir -p -- "${_ARKENFOX_PROFILE_PREFSJS_BACKUP_DIR:?}" &&
        cp -f -- "${_ARKENFOX_PROFILE_PREFSJS:?}" "$backup" || {
        print_error 'Failed to backup prefs.js:' \
            "${_ARKENFOX_PROFILE_PREFSJS:?}."
        return "${_EX_CANTCREAT:?}"
    }
    print_ok "Your prefs.js has been backed up: $backup."
    print_info 'Cleaning prefs.js...\n\n'
    arkenfox_prefs_cleaner_clean "$backup" || return
    print_ok 'All done!'
}

arkenfox_prefs_cleaner_set_profile_path() {
    if [ -n "${_ARKENFOX_PREFS_CLEANER_OPTION_P_PROFILE_PATH?}" ]; then
        _ARKENFOX_PROFILE_PATH=${_ARKENFOX_PREFS_CLEANER_OPTION_P_PROFILE_PATH?}
    elif is_option_set \
        "${_ARKENFOX_PREFS_CLEANER_OPTION_L_LIST_PROFILES?}"; then
        _ARKENFOX_PROFILE_PATH=$(arkenfox_select_firefox_profile_path)
    else
        _ARKENFOX_PROFILE_PATH=${_ARKENFOX_PREFS_CLEANER_RUN_DIR:?}
    fi &&
        _ARKENFOX_PROFILE_PATH=$(realpath_ "$_ARKENFOX_PROFILE_PATH") ||
        return
    [ -w "$_ARKENFOX_PROFILE_PATH" ] &&
        cd -- "$_ARKENFOX_PROFILE_PATH" || {
        print_error 'The path to your Firefox profile' \
            "('$_ARKENFOX_PROFILE_PATH') failed to be a directory to which" \
            'the user has both write and execute access.'
        return "${_EX_UNAVAILABLE:?}"
    }
    _ARKENFOX_PROFILE_USERJS=${_ARKENFOX_PROFILE_PATH%/}/user.js &&
        _ARKENFOX_PROFILE_PREFSJS=${_ARKENFOX_PROFILE_PATH%/}/prefs.js &&
        _ARKENFOX_PROFILE_PREFSJS_BACKUP_DIR=${_ARKENFOX_PROFILE_PATH%/}/prefsjs_backups
}

arkenfox_prefs_cleaner_banner() {
    cat >&2 <<'EOF'



                   ╔══════════════════════════╗
                   ║     prefs.js cleaner     ║
                   ║    by claustromaniac     ║
                   ║           v3.0           ║
                   ╚══════════════════════════╝

This script will remove all entries from prefs.js that also exist in user.js.
This will allow inactive preferences to be reset to their default values.

This Firefox profile shouldn't be in use during the process.


EOF
}

arkenfox_prefs_cleaner_clean() { # args: file
    format="user_pref[[:blank:]]*\([[:blank:]]*[\"']([^\"']+)[\"'][[:blank:]]*," &&
        # SunOS/OpenBSD's grep do not recognize - as stdin,
        # so we create temp files for use as pattern files.
        prefs_in_userjs=$(mktemp_) &&
        prefs_to_clean=$(mktemp_) &&
        grep -E -- "$format" "${_ARKENFOX_PROFILE_USERJS:?}" |
        awk -F"[\"']" '{ print "\"" $2 "\""; print "'\''" $2 "'\''"; }' |
            sort |
            uniq >|"$prefs_in_userjs" ||
        return
    grep -F -f "$prefs_in_userjs" -- "$1" |
        grep -E -e "^[[:blank:]]*$format" >|"$prefs_to_clean" ||
        # It is not an error if there are no prefs to clean.
        [ "$?" -eq "${_EX_FAIL:?}" ] ||
        return
    if [ -s "$prefs_to_clean" ]; then # File size is greater than zero.
        temp=$(mktemp_) &&
            grep -F -v -f "$prefs_to_clean" -- "$1" >|"$temp" &&
            # Suppress diagnostic message on FreeBSD/DragonFly
            # (mv: set owner/group: Operation not permitted).
            mv -f -- "$temp" "${_ARKENFOX_PROFILE_PREFSJS:?}" 2>/dev/null
    fi
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
6. If you do notice something wrong, especially with your extensions, and/or with the UI,
   go to about:support, and restart Firefox with add-ons disabled.
   Then, restart it again normally, and see if the problems were solved.
   If you are able to identify the cause of your issues, please bring it up on the arkenfox user.js GitHub repository.

EOF
}

# Restore the starting errexit shell option.
is_option_set "${_STARTING_SH_OPTION_ERREXIT?}" || set +o errexit
# "Command appears to be unreachable. Check usage (or ignore if invoked indirectly)."
# shellcheck disable=SC2317
(main() { :; }) && : For quick navigation in IDEs only.
arkenfox_prefs_cleaner_init && : Suppress errexit if enabled.
status_=$? &&
    if [ "$status_" -eq 0 ]; then
        if test "${_ARKENFOX_PREFS_CLEANER_RUN_NAME:?}" = \
            "${ARKENFOX_PREFS_CLEANER_NAME:?}"; then
            arkenfox_prefs_cleaner "$@"
        else
            print_ok 'The arkenfox prefs.js cleaner script' \
                'has been successfully sourced.'
            print_warning 'If this is not intentional, you may have either' \
                'made a typo in the shell commands, or renamed this file' \
                'without defining the environment variable' \
                'ARKENFOX_PREFS_CLEANER_NAME to match the new name.' \
                "

         Detected name of the run file: ${_ARKENFOX_PREFS_CLEANER_RUN_NAME:?}
         ARKENFOX_PREFS_CLEANER_NAME  : ${ARKENFOX_PREFS_CLEANER_NAME:?}
" \
                "$(printf '%s\n\b' '')Please note that this is not the" \
                'expected way to run the arkenfox prefs.js cleaner script.' \
                'Dot sourcing support is experimental' \
                'and all function and variable names' \
                'are still subject to change.'
            # Make arkenfox_prefs_cleaner_update_self a no-op as this function
            # can not be run reliably when dot sourced.
            eval 'arkenfox_prefs_cleaner_update_self() { :; }' &&
                # Restore the starting aliases.
                eval "${_STARTING_ALIASES?}"
        fi
    else
        # Restore the starting aliases.
        eval "${_STARTING_ALIASES?}" &&
            (exit "$status_")
    fi
