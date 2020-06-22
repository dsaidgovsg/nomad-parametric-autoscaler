# Not specifying shebang interpreter so that default shell is used
set -euo pipefail

# This exists due to how crappy gofmt (and golint) works
# 1. Cannot skip dot directories unless we use go fmt, but go fmt forces correcting
# 2. gofmt has no option to return non-zero when there is at least one file wrong
assert_each_go_file () {
    failed_files=$(find . -type f -iname '*.go' -not -path "./.*/*" -exec $@ {} \;)
    printf "${failed_files}"

    if [[ ${failed_files} ]]; then
        printf "\nFAILED!\n"
        exit 1
    fi
}

echo "-- gofmt check --"
assert_each_go_file gofmt -l
echo "OK"

echo "-- golint check --"
assert_each_go_file golint
echo "OK"

echo "-- go unit tests --"
gotestsum -- -tags=unit ./...
echo "OK"
