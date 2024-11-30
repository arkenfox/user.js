#!/bin/sh

# arkenfox user.js updater for macOS, Linux and other Unix operating systems
# authors: @overdodactyl, @earthlng, @9ao9ai9ar
# version: 5.0

# IMPORTANT! The version string must be on the 5th line of this file
# and must be of the format "version: MAJOR.MINOR" (spaces are optional).
# This restriction is set by the function arkenfox_script_version.

# Example advanced script usage:
# $ env PROBE_MISSING=1 ./updater.sh -v
# $ ( . ./updater.sh && WGET__IMPLEMENTATION=wget arkenfox_updater )
# $ ( TERM=dumb . ./updater.sh && yes | arkenfox_updater 2>./stderr.log )

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

print_yN() { # args: [ARGUMENT]...
    printf '%s' "${_TPUT_AF_RED}$* [y/N]${_TPUT_SGR0}" >&2
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

probe_open_() {
    missing_open_() {
        print_error 'Failed to find xdg-open or open on your system.'
        return "${_EX_CNF:-127}"
    }
    if command -v xdg-open >/dev/null 2>&1; then
        OPEN__IMPLEMENTATION='xdg-open'
    elif command -v open >/dev/null 2>&1; then
        OPEN__IMPLEMENTATION='open'
    else
        OPEN__IMPLEMENTATION=
        is_option_set "$PROBE_MISSING" && missing_open_
    fi
    open_() { # args: FILE...
        case $OPEN__IMPLEMENTATION in
            'xdg-open')
                if [ "$#" -le 0 ]; then
                    command xdg-open
                else
                    open__status="${_EX_OK:-0}"
                    while [ "$#" -gt 0 ]; do
                        command xdg-open "$1"
                        status=$?
                        [ "$status" -eq "${_EX_OK:-0}" ] ||
                            open__status="$status"
                        shift
                    done
                    return "$open__status"
                fi
                ;;
            'open') command open "$@" ;;
            *) missing_open_ ;;
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

# https://kb.mozillazine.org/Profiles.ini_file
arkenfox_select_firefox_profile_path() {
    if [ "$(uname)" = 'Darwin' ]; then # macOS
        profiles_ini="$HOME/Library/Application\ Support/Firefox/profiles.ini"
    else
        profiles_ini="$HOME/.mozilla/firefox/profiles.ini"
    fi
    [ -f "$profiles_ini" ] || {
        print_error 'Failed to find the Firefox profiles.ini file' \
            'at the standard location.'
        return "${_EX_NOINPUT:?}"
    }
    selected_profile=$(arkenfox_select_firefox_profile "$profiles_ini") ||
        return
    path=$(printf '%s\n' "$selected_profile" | sed -n 's/^Path=\(.*\)$/\1/p')
    is_relative=$(
        printf '%s\n' "$selected_profile" |
            sed -n 's/^IsRelative=\([01]\)$/\1/p'
    )
    [ -n "$path" ] && [ -n "$is_relative" ] || {
        print_error 'Failed to get the value of the Path or IsRelative key' \
            'from the selected Firefox profile section.'
        return "${_EX_DATAERR:?}"
    }
    if [ "$is_relative" = 1 ]; then
        default_profile_dir=$(dirname "$profiles_ini") &&
            path="${default_profile_dir%/}/$path" || {
            print_error 'Failed to convert the selected Firefox profile path' \
                'from relative to absolute.'
            return "${_EX_DATAERR:?}"
        }
    fi
    printf '%s\n' "$path"
}

arkenfox_select_firefox_profile() { # arg: profiles.ini
    while :; do
        # https://unix.stackexchange.com/a/786827
        profiles=$(
            awk '/^[[]/ { section = substr($0, 1) }
                 (section ~ /^[[]Profile[0123456789]+[]]$/) { print }' "$1"
        ) &&
            profile_count=$(
                printf '%s' "$profiles" |
                    grep -Ec '^[[]Profile[0123456789]+[]]$'
            ) &&
            [ "${profile_count:-0}" -gt 0 ] || {
            print_error 'Failed to find the profile sections in the INI file.'
            return "${_EX_DATAERR:?}"
        }
        if [ "$profile_count" -eq 1 ]; then
            printf '%s\n' "$profiles"
            return
        else
            display_profiles=$(
                printf '%s\n\n' "$profiles" |
                    grep -Ev -e '^IsRelative=' -e '^Default=' &&
                    awk '/^[[]/ { section = substr($0, 2) }
                         ((section ~ /^Install/) && /^Default=/) { print }' \
                        "$1"
            )
            cat >&2 <<EOF
Profiles found:
––––––––––––––––––––––––––––––
$display_profiles
––––––––––––––––––––––––––––––
EOF
            print_info 'Select the profile number' \
                '(0 for Profile0, 1 for Profile1, etc; q to quit): '
            read -r REPLY
            print_info '\n'
            case $REPLY in
                # Why are we not using character classes or range expressions?
                # Because they are locale-dependent: https://unix.stackexchange.com/a/654391.
                [0123456789] | [123456789][0123456789]*)
                    selected_profile=$(
                        printf '%s\n' "$profiles" |
                            awk -v select="$REPLY" \
                                'BEGIN { regex = "^[[]Profile"select"[]]$" }
                                 /^[[]/ { section = substr($0, 1) }
                                 section ~ regex { print }'
                    ) &&
                        [ -n "$selected_profile" ] &&
                        printf '%s\n' "$selected_profile" &&
                        return ||
                        print_error "Failed to select Profile$REPLY."
                    ;;
                [qQ]) return "${_EX_FAIL:?}" ;;
                *) print_warning 'Invalid input: not a whole number.' ;;
            esac
        fi
    done
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

arkenfox_userjs_version() { # arg: user.js
    [ -f "$1" ] && sed -n '4p' "$1" || echo 'Unknown'
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
####                 === updater.sh specific functions ===                 ####
###############################################################################

_arkenfox_updater_init() {
    # The variable assignments before a function in a simple command
    # are not guaranteed to not persist after the completion of the function:
    # https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_09_01.
    # In fact, they do persist in both ksh and zsh,
    # so we have to resort to this workaround.
    probe_missing=$PROBE_MISSING
    probe_terminal &&
        PROBE_MISSING=1 probe_wget_ &&
        PROBE_MISSING=1 probe_mktemp_ &&
        probe_realpath_ &&
        PROBE_MISSING=$probe_missing probe_open_ ||
        return
    # IMPORTANT! ARKENFOX_UPDATER_NAME must be synced to the name of this file!
    # This is so that we may somewhat determine if the script is sourced or not
    # by comparing it to the basename of the canonical path of $0,
    # which should be better than hard coding all the names of the
    # interactive and non-interactive POSIX shells in existence.
    # Cf. https://stackoverflow.com/a/28776166.
    [ -z "$ARKENFOX_UPDATER_NAME" ] && ARKENFOX_UPDATER_NAME='updater.sh'
    run_path=$(realpath_ "$0") &&
        run_dir=$(dirname "$run_path") &&
        run_name=$(basename "$run_path") || {
        print_error 'Failed to resolve the run file path.'
        return "${_EX_UNAVAILABLE:?}"
    }
    (
        readonly "_ARKENFOX_UPDATER_RUN_PATH=$run_path" \
            "_ARKENFOX_UPDATER_RUN_DIR=$run_dir" \
            "_ARKENFOX_UPDATER_RUN_NAME=$run_name" 2>/dev/null
    ) &&
        readonly "_ARKENFOX_UPDATER_RUN_PATH=$run_path" \
            "_ARKENFOX_UPDATER_RUN_DIR=$run_dir" \
            "_ARKENFOX_UPDATER_RUN_NAME=$run_name" || {
        [ "$_ARKENFOX_UPDATER_RUN_PATH" = "$run_path" ] &&
            [ "$_ARKENFOX_UPDATER_RUN_DIR" = "$run_dir" ] &&
            [ "$_ARKENFOX_UPDATER_RUN_NAME" = "$run_name" ] || {
            print_error 'Failed to make the resolved run file path readonly.' \
                'Try again in a new shell environment?'
            return "${_EX_TEMPFAIL:?}"
        }
    }
}

arkenfox_updater() { # args: [options]
    arkenfox_updater_parse_options "$@" &&
        arkenfox_updater_set_profile_path &&
        arkenfox_updater_check_nonroot || return
    arkenfox_updater_exec_general_options
    status=$?
    # The exit status _EX__BASE indicates that no general option is executed.
    # When curl is used, it may also return with exit status _EX__BASE (64)
    # if the requested FTP SSL level failed, but that is not applicable here.
    [ "$status" -eq "${_EX__BASE:?}" ] || return "$status"
    arkenfox_updater_banner
    is_option_set "$_ARKENFOX_UPDATER_OPTION_D_DONT_UPDATE" ||
        arkenfox_updater_update_self "$@" || return
    arkenfox_updater_update_userjs || return
}

arkenfox_updater_usage() {
    cat >&2 <<EOF

${_TPUT_AF_BLUE}Usage: $ARKENFOX_UPDATER_NAME [-h|-r]${_TPUT_SGR0}
${_TPUT_AF_BLUE}       $ARKENFOX_UPDATER_NAME [UPDATER_OPTION]... [USERJS_OPTION]...${_TPUT_SGR0}

General options:
    -h           Show this help message and exit.
    -r           Only download user.js to a temporary file and open it.

Updater options:
    -d           Do not look for updates to updater.sh.
    -u           Update updater.sh and execute silently.  Do not seek confirmation.

user.js options:
    -p PROFILE   Path to your Firefox profile (if different than the dir of this script).
                 IMPORTANT: If the path contains spaces, wrap the entire argument in quotes.
    -l           Choose your Firefox profile from a list.
    -s           Silently update user.js.  Do not seek confirmation.
    -c           Create a diff file comparing old and new user.js within userjs_diffs.
    -b           Only keep one backup of each file.
    -e           Activate ESR related preferences.
    -n           Do not append any overrides, even if user-overrides.js exists.
    -o OVERRIDES Filename or path to overrides file (if different than user-overrides.js).
                 If used with -p, paths should be relative to PROFILE or absolute paths.
                 If given a directory, all files inside will be appended recursively.
                 You can pass multiple files or directories by passing a comma separated list.
                 Note: If a directory is given, only files inside ending in the extension .js are appended.
                 IMPORTANT: Do not add spaces between files/paths.  Ex: -o file1.js,file2.js,dir1
                 IMPORTANT: If any file/path contains spaces, wrap the entire argument in quotes.  Ex: -o "override folder"
    -v           Open the resulting user.js file.

EOF
}

arkenfox_updater_parse_options() { # args: [options]
    OPTIND=1                       # OPTIND must be manually reset between multiple calls to getopts.
    _OPTIONS_PARSED=0
    # IMPORTANT! Make sure to initialize all options!
    _ARKENFOX_UPDATER_OPTION_H_HELP=
    _ARKENFOX_UPDATER_OPTION_R_READ_ONLY=
    _ARKENFOX_UPDATER_OPTION_D_DONT_UPDATE=
    _ARKENFOX_UPDATER_OPTION_U_UPDATER_SILENT=
    _ARKENFOX_UPDATER_OPTION_P_PROFILE_PATH=
    _ARKENFOX_UPDATER_OPTION_L_LIST_FIREFOX_PROFILES=
    _ARKENFOX_UPDATER_OPTION_S_SILENT=
    _ARKENFOX_UPDATER_OPTION_C_COMPARE=
    _ARKENFOX_UPDATER_OPTION_B_BACKUP_SINGLE=
    _ARKENFOX_UPDATER_OPTION_E_ESR=
    _ARKENFOX_UPDATER_OPTION_N_NO_OVERRIDES=
    _ARKENFOX_UPDATER_OPTION_O_OVERRIDES=
    _ARKENFOX_UPDATER_OPTION_V_VIEW=
    while getopts 'hrdup:lscbeno:v' opt; do
        _OPTIONS_PARSED=$((_OPTIONS_PARSED + 1))
        case $opt in
            # General options
            h) _ARKENFOX_UPDATER_OPTION_H_HELP=1 ;;
            r) _ARKENFOX_UPDATER_OPTION_R_READ_ONLY=1 ;;
            # Updater options
            d) _ARKENFOX_UPDATER_OPTION_D_DONT_UPDATE=1 ;;
            u) _ARKENFOX_UPDATER_OPTION_U_UPDATER_SILENT=1 ;;
            # user.js options
            p) _ARKENFOX_UPDATER_OPTION_P_PROFILE_PATH=$OPTARG ;;
            l) _ARKENFOX_UPDATER_OPTION_L_LIST_FIREFOX_PROFILES=1 ;;
            s) _ARKENFOX_UPDATER_OPTION_S_SILENT=1 ;;
            c) _ARKENFOX_UPDATER_OPTION_C_COMPARE=1 ;;
            b) _ARKENFOX_UPDATER_OPTION_B_BACKUP_SINGLE=1 ;;
            e) _ARKENFOX_UPDATER_OPTION_E_ESR=1 ;;
            n) _ARKENFOX_UPDATER_OPTION_N_NO_OVERRIDES=1 ;;
            o) _ARKENFOX_UPDATER_OPTION_O_OVERRIDES=$OPTARG ;;
            v) _ARKENFOX_UPDATER_OPTION_V_VIEW=1 ;;
            \?)
                arkenfox_updater_usage
                return "${_EX_USAGE:?}"
                ;;
            :) return "${_EX_USAGE:?}" ;;
        esac
    done
}

arkenfox_updater_set_profile_path() {
    if [ -n "$_ARKENFOX_UPDATER_OPTION_P_PROFILE_PATH" ]; then
        _ARKENFOX_PROFILE_PATH=$_ARKENFOX_UPDATER_OPTION_P_PROFILE_PATH
    elif is_option_set "$_ARKENFOX_UPDATER_OPTION_L_LIST_FIREFOX_PROFILES"; then
        _ARKENFOX_PROFILE_PATH=$(arkenfox_select_firefox_profile_path) || return
    else
        _ARKENFOX_PROFILE_PATH=$_ARKENFOX_UPDATER_RUN_DIR
    fi
    _ARKENFOX_PROFILE_PATH=$(realpath_ "$_ARKENFOX_PROFILE_PATH") &&
        [ -w "$_ARKENFOX_PROFILE_PATH" ] &&
        cd "$_ARKENFOX_PROFILE_PATH" || {
        print_error 'The path to your Firefox profile' \
            "('$_ARKENFOX_PROFILE_PATH') failed to be a directory to which" \
            'the user has both write and execute access.'
        return "${_EX_UNAVAILABLE:?}"
    }
    _ARKENFOX_PROFILE_USERJS="${_ARKENFOX_PROFILE_PATH%/}/user.js"
    _ARKENFOX_PROFILE_USERJS_BACKUP_DIR="${_ARKENFOX_PROFILE_PATH%/}/userjs_backups"
    _ARKENFOX_PROFILE_USERJS_DIFF_DIR="${_ARKENFOX_PROFILE_PATH%/}/userjs_diffs"
}

arkenfox_updater_check_nonroot() {
    if [ "$(id -u)" -eq 0 ]; then
        print_error "You shouldn't run this with elevated privileges" \
            '(such as with doas/sudo).'
        return "${_EX_USAGE:?}"
    fi
    root_owned_files=$(
        find "${_ARKENFOX_PROFILE_USERJS:?}" \
            "${_ARKENFOX_PROFILE_USERJS_BACKUP_DIR:?}/" \
            "${_ARKENFOX_PROFILE_USERJS_DIFF_DIR:?}/" \
            -user 0 -print 2>/dev/null
    )
    if [ -n "$root_owned_files" ]; then
        # \b is a backspace to keep the trailing newlines
        # from being stripped by command substitution.
        print_error 'It looks like this script' \
            'was previously run with elevated privileges.' \
            'Please change ownership of the following files' \
            'to your user and try again:' \
            "$(printf '%s\n\b' '')$root_owned_files"
        return "${_EX_CONFIG:?}"
    fi
}

arkenfox_updater_exec_general_options() {
    if [ "$_OPTIONS_PARSED" -eq 1 ]; then
        if is_option_set "$_ARKENFOX_UPDATER_OPTION_H_HELP"; then
            arkenfox_updater_usage 2>&1
            return
        elif is_option_set "$_ARKENFOX_UPDATER_OPTION_R_READ_ONLY"; then
            arkenfox_updater_wget__open__userjs
            return
        fi
    else
        if is_option_set "$_ARKENFOX_UPDATER_OPTION_H_HELP" ||
            is_option_set "$_ARKENFOX_UPDATER_OPTION_R_READ_ONLY"; then
            arkenfox_updater_usage
            return "${_EX_USAGE:?}"
        fi
    fi
    return "${_EX__BASE:?}"
}

arkenfox_updater_wget__open__userjs() {
    master_userjs=$(
        download_file \
            'https://raw.githubusercontent.com/arkenfox/user.js/master/user.js'
    ) &&
        master_userjs_js="$master_userjs.js" &&
        mv "$master_userjs" "$master_userjs_js" &&
        print_ok "user.js was saved to the temporary file: $master_userjs_js." &&
        open_ "$master_userjs_js"
}

arkenfox_updater_banner() {
    cat >&2 <<EOF
${_TPUT_AF_BLUE_BOLD}
##############################################################################
####                                                                      ####
####                           arkenfox user.js                           ####
####        Hardening the Privacy and Security Settings of Firefox        ####
####            Maintained by @Thorin-Oakenpants and @earthlng            ####
####             Updater for macOS and Linux by @overdodactyl             ####
####                                                                      ####
##############################################################################
${_TPUT_SGR0}

Documentation for this script is available here:${_TPUT_AF_CYAN}
https://github.com/arkenfox/user.js/wiki/5.1-Updater-%5BOptions%5D#-maclinux
${_TPUT_SGR0}
EOF
}

arkenfox_updater_update_self() { # args: [options]
    # Here, we use _ARKENFOX_PROFILE_PATH/ARKENFOX_UPDATER_NAME
    # instead of _ARKENFOX_UPDATER_RUN_PATH as the latter would be incorrect
    # if the script is sourced.
    : "${_ARKENFOX_PROFILE_PATH:?}"
    arkenfox_updater="${_ARKENFOX_PROFILE_PATH%/}/${ARKENFOX_UPDATER_NAME:?}"
    master_updater=$(
        download_file \
            'https://raw.githubusercontent.com/arkenfox/user.js/master/updater.sh'
    ) &&
        local_version=$(arkenfox_script_version "$arkenfox_updater") &&
        master_version=$(arkenfox_script_version "$master_updater") ||
        return
    if [ "${local_version%%.*}" -eq "${master_version%%.*}" ] &&
        [ "${local_version#*.}" -lt "${master_version#*.}" ] ||
        [ "${local_version%%.*}" -lt "${master_version%%.*}" ]; then
        if ! is_option_set "$_ARKENFOX_UPDATER_OPTION_U_UPDATER_SILENT"; then
            print_info 'There is a newer version of updater.sh available. '
            print_yN 'Update and execute?'
            read1 REPLY
            print_info '\n\n'
            [ "$REPLY" = 'Y' ] || [ "$REPLY" = 'y' ] || return "${_EX_OK:?}"
        fi
        mv -f "$master_updater" "$arkenfox_updater" &&
            chmod u+r+x "$arkenfox_updater" || {
            print_error 'Failed to update the arkenfox user.js updater' \
                'and make it executable.'
            return "${_EX_CANTCREAT:?}"
        }
        "$arkenfox_updater" -d "$@"
    fi
}

arkenfox_updater_update_userjs() {
    master_userjs=$(
        download_file \
            'https://raw.githubusercontent.com/arkenfox/user.js/master/user.js'
    ) || return
    userjs="${_ARKENFOX_PROFILE_USERJS:?}"
    cat >&2 <<EOF

Please observe the following information:
    Firefox profile:  ${_TPUT_AF_YELLOW}${_ARKENFOX_PROFILE_PATH:?}${_TPUT_SGR0}
    Available online: ${_TPUT_AF_YELLOW}$(arkenfox_userjs_version "$master_userjs")${_TPUT_SGR0}
    Currently using:  ${_TPUT_AF_YELLOW}$(arkenfox_userjs_version "$userjs")${_TPUT_SGR0}


EOF
    if ! is_option_set "$_ARKENFOX_UPDATER_OPTION_S_SILENT"; then
        print_info 'This script will update to the latest user.js file' \
            'and apply any custom configurations' \
            'from the supplied user-overrides.js files. '
        print_yN 'Continue?'
        read1 REPLY
        print_info '\n\n'
        [ "$REPLY" = 'Y' ] || [ "$REPLY" = 'y' ] || {
            print_error 'Process aborted!'
            return "${_EX_FAIL:?}"
        }
    fi
    userjs_backup=$(arkenfox_updater_backup_userjs "$userjs") &&
        mv "$master_userjs" "$userjs" &&
        print_ok 'user.js has been backed up' \
            'and replaced with the latest version!' ||
        return
    arkenfox_updater_customize_userjs "$userjs" || return
    if is_option_set "$_ARKENFOX_UPDATER_OPTION_C_COMPARE"; then
        diff_file=$(arkenfox_updater_diff_userjs "$userjs" "$userjs_backup")
        diff_status=$?
        if [ -n "$diff_file" ]; then
            [ "$diff_status" -eq "${_EX_FAIL:?}" ] ||
                print_warning "Unexpected diff status: $diff_status."
            print_ok "A diff file was created: $diff_file."
        else
            [ "$diff_status" -eq "${_EX_OK:?}" ] || return "$diff_status"
            print_warning 'Your new user.js file appears to be identical.' \
                'No diff file was created.'
            is_option_set "$_ARKENFOX_UPDATER_OPTION_B_BACKUP_SINGLE" ||
                rm "$userjs_backup"
        fi
    fi
    is_option_set "$_ARKENFOX_UPDATER_OPTION_V_VIEW" && open_ "$userjs"
}

arkenfox_updater_backup_userjs() { # arg: user.js
    backup_dir="${_ARKENFOX_PROFILE_USERJS_BACKUP_DIR:?}"
    if is_option_set "$_ARKENFOX_UPDATER_OPTION_B_BACKUP_SINGLE"; then
        userjs_backup="$backup_dir/user.js.backup"
    else
        userjs_backup="$backup_dir/user.js.backup.$(date +"%Y-%m-%d_%H%M")"
    fi
    # The -p option is used to suppress errors if directory exists.
    mkdir -p "$backup_dir" &&
        cp "$1" "$userjs_backup" &&
        printf '%s\n' "$userjs_backup"
}

arkenfox_updater_customize_userjs() { # arg: user.js
    if is_option_set "$_ARKENFOX_UPDATER_OPTION_E_ESR"; then
        # Why are we not using character classes or range expressions?
        # Because they are locale-dependent: https://unix.stackexchange.com/a/654391.
        userjs_temp=$(mktemp_) &&
            sed 's/\/\* \(ESR[0123456789]\{2,\}\.x still uses all.*\)/\/\/ \1/' \
                "$1" >"$userjs_temp" &&
            mv "$userjs_temp" "$1" &&
            print_ok 'ESR related preferences have been activated!' ||
            return
    fi
    if ! is_option_set "$_ARKENFOX_UPDATER_OPTION_N_NO_OVERRIDES"; then
        : "${_ARKENFOX_PROFILE_PATH:?}"
        if [ -n "$_ARKENFOX_UPDATER_OPTION_O_OVERRIDES" ]; then
            overrides=$_ARKENFOX_UPDATER_OPTION_O_OVERRIDES
        else
            overrides="${_ARKENFOX_PROFILE_PATH%/}/user-overrides.js"
        fi
        (
            IFS=,
            (set -o noglob 2>/dev/null) && set -o noglob || set -f || return
            # shellcheck disable=SC2086 # Double quote to prevent globbing and word splitting.
            arkenfox_updater_append_userjs_overrides $overrides
        )
    fi
}

arkenfox_updater_append_userjs_overrides() { # args: FILE...
    userjs="${_ARKENFOX_PROFILE_USERJS:?}"
    while [ "$#" -gt 0 ]; do
        override=$(realpath_ "$1") || return
        if [ -f "$override" ]; then
            echo >>"$userjs" &&
                cat -- "$override" >>"$userjs" &&
                print_ok "Override file appended: $override." ||
                return
        elif [ -d "$override" ]; then
            (set +o noglob 2>/dev/null) && set +o noglob || set +f || return
            for overridejs in "$override"/*.js; do
                arkenfox_updater_append_userjs_overrides "$overridejs" ||
                    return
            done
        else
            print_warning "Could not find override file: $override."
        fi
        shift
    done
}

arkenfox_updater_diff_userjs() { # args: FILE1 FILE2
    diff_dir="${_ARKENFOX_PROFILE_USERJS_DIFF_DIR:?}"
    mkdir -p "$diff_dir" &&
        new_userjs_stripped=$(mktemp_) &&
        old_userjs_stripped=$(mktemp_) &&
        remove_js_comments "$1" >"$new_userjs_stripped" &&
        remove_js_comments "$2" >"$old_userjs_stripped" ||
        return "${_EX_UNAVAILABLE:?}"
    diff=$(diff -b -U 0 "$old_userjs_stripped" "$new_userjs_stripped")
    diff_status=$?
    if [ -n "$diff" ]; then
        diff_file="$diff_dir/diff_$(date +"%Y-%m-%d_%H%M").txt"
        printf '%s\n' "$diff" >"$diff_file" &&
            printf '%s\n' "$diff_file" ||
            return "${_EX_UNAVAILABLE:?}"
    fi
    return "$diff_status"
}

# This should ideally be placed immediately after read1,
# but then it would break the JetBrain IDEs' syntax highlighting
# and the functions outline in the structure tool window,
# so it is defined last to minimize disruption.
remove_js_comments() { # arg: FILE
    # Copied verbatim from the public domain sed script at
    # https://sed.sourceforge.io/grabbag/scripts/remccoms3.sed.
    # The best POSIX solution on the internet, though it does not handle files
    # with syntax errors in C as well as emacs does, e.g.
    : Unterminated multi-line strings test case <<'EOF'
/* "not/here
*/"//"
// non "here /*
should/appear
// \
nothere
should/appear
"a \" string with embedded comment /* // " /*nothere*/
"multiline
/*string" /**/ shouldappear //*nothere*/
/*/ nothere*/ should appear
EOF
    # The reference output is given by:
    # cpp -P -std=c99 -fpreprocessed -undef -dD "$1"
    # The options "-Werror -Wfatal-errors" could also be added,
    # which may mimic Firefox's parsing of user.js better.
    remccoms3=$(
        cat <<'EOF'
#! /bin/sed -nf

# Remove C and C++ comments, by Brian Hiles (brian_hiles@rocketmail.com)

# Sped up (and bugfixed to some extent) by Paolo Bonzini (bonzini@gnu.org)
# Works its way through the line, copying to hold space the text up to the
# first special character (/, ", ').  The original version went exactly a
# character at a time, hence the greater speed of this one.  But the concept
# and especially the trick of building the line in hold space are entirely
# merit of Brian.

:loop

# This line is sufficient to remove C++ comments!
/^\/\// s,.*,,

/^$/{
  x
  p
  n
  b loop
}
/^"/{
  :double
  /^$/{
    x
    p
    n
    /^"/b break
    b double
  }

  H
  x
  s,\n\(.[^\"]*\).*,\1,
  x
  s,.[^\"]*,,

  /^"/b break
  /^\\/{
    H
    x
    s,\n\(.\).*,\1,
    x
    s/.//
  }
  b double
}

/^'/{
  :single
  /^$/{
    x
    p
    n
    /^'/b break
    b single
  }
  H
  x
  s,\n\(.[^\']*\).*,\1,
  x
  s,.[^\']*,,

  /^'/b break
  /^\\/{
    H
    x
    s,\n\(.\).*,\1,
    x
    s/.//
  }
  b single
}

/^\/\*/{
  s/.//
  :ccom
  s,^.[^*]*,,
  /^$/ n
  /^\*\//{
    s/..//
    b loop
  }
  b ccom
}

:break
H
x
s,\n\(.[^"'/]*\).*,\1,
x
s/.[^"'/]*//
b loop
EOF
    )
    # Setting LC_ALL=C in _arkenfox_init helps prevent an indefinite loop:
    # https://stackoverflow.com/q/13061785/#comment93013794_13062074.
    sed -n "$remccoms3" "$1" |
        sed '/^[[:space:]]*$/d' # Remove blank lines.
}

_arkenfox_init && _arkenfox_updater_init
init_status=$?
if [ "$init_status" -eq 0 ]; then
    if [ "$_ARKENFOX_UPDATER_RUN_NAME" = "$ARKENFOX_UPDATER_NAME" ]; then
        arkenfox_updater "$@"
    else
        print_ok 'The arkenfox user.js updater script' \
            'has been successfully sourced.'
        print_warning 'If this is not intentional,' \
            'you may have either made a typo in the shell commands,' \
            'or renamed this file without defining the environment variable' \
            'ARKENFOX_UPDATER_NAME to match the new name.' \
            "

         Detected name of the run file: $_ARKENFOX_UPDATER_RUN_NAME
         ARKENFOX_UPDATER_NAME: $ARKENFOX_UPDATER_NAME

        " \
            'Please note that this is not the expected way' \
            'to run the arkenfox user.js updater script.' \
            'Dot sourcing support is experimental' \
            'and all function and variable names are still subject to change.'
    fi
else
    # '&& true' to avoid exiting the shell if the shell option errexit is set.
    (exit "$init_status") && true
fi
