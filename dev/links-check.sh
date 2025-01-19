#!/bin/bash

declare TRACE
[[ "${TRACE}" == 1 ]] && set -o xtrace
set -o errexit
set -o nounset
set -o pipefail
set -o noclobber

links-check() {
  lychee \
    --base 'https://github.com/rodmoioliveira/soccer-knockout-standings' \
    --verbose \
    --no-progress \
    --cache \
    --max-cache-age 5d \
    --exclude-path CHANGELOG.md \
    --exclude '(linkedin|substack)' './**/*.md'
  cat .lycheecache | sort >.lycheecache_sorted && mv .lycheecache_sorted .lycheecache
}

main() {
  links-check
}

main
