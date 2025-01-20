#!/bin/bash

declare TRACE
[[ "${TRACE}" == 1 ]] && set -o xtrace
set -o errexit
set -o nounset
set -o pipefail
set -o noclobber
shopt -s inherit_errexit

index() {
  paste -d "" \
    <(
      cat dev/doc-readme.sh |
        grep -E '^#{1,} [A-Z]' |
        sed 's/^ {1,}//g' |
        sed -E 's/(^#{1,}) (.+)/\1\[\2]/g' |
        sed 's/#/  /g' |
        sed -E 's/\[/- [/g'
    ) \
    <(
      cat dev/doc-readme.sh |
        grep -E '^#{1,} [A-Z]' |
        sed 's/#//g' |
        sed -E 's/^ {1,}//g' |
        # https://www.gnu.org/software/grep/manual/html_node/Character-Classes-and-Bracket-Expressions.html
        sed -E "s1[][!#$%&'()*+,./:;<=>?@\\^_\`{|}~]11g" |
        sed -E 's/"//g' |
        sed 's/[A-Z]/\L&/g' |
        sed 's/ /-/g' |
        sed -E 's@(.+)@(#\1)@g'
    )
}

backlink() {
  sed -i -E '/^#{1,} [A-Z]/a\\n\[back^\](#index)' README.md
}

readme() {
  cat <<EOF >|README.md
<p align="center">
  <img src="https://raw.githubusercontent.com/rodmoioliveira/soccer-knockout-standings/main/images/knockout_heap2.png">
</p>

# soccer-knockout-standings

# index

$(index)

# About

Knockout standings implemented with a heap data structure.

# Website

https://rodmoioliveira.github.io/soccer-knockout-standings/

# Make Recipes

\`\`\`
$(make help)
\`\`\`

# How to Release

$(cat RELEASE.md)
EOF

  sed -i -E '/^make\[[0-9]/d' README.md
  backlink
  dprint fmt README.md CHANGELOG.md
}

trap readme EXIT
