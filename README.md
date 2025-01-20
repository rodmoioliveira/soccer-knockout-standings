<p align="center">
  <img src="https://raw.githubusercontent.com/rodmoioliveira/soccer-knockout-standings/main/images/knockout_heap2.png">
</p>

# soccer-knockout-standings

# index

- [About](#about)
- [Website](#website)
- [Make Recipes](#make-recipes)
- [How to Release](#how-to-release)

# About

[back^](#index)

Knockout standings implemented with a heap data structure.

# Website

[back^](#index)

https://rodmoioliveira.github.io/soccer-knockout-standings/

# Make Recipes

[back^](#index)

```
bash-all               Run all bash tests
bash-check             Check format bash code
bash-deps              Install bash dependencies
bash-fmt               Format bash code
bash-lint              Check lint bash code
doc-changelog          Write CHANGELOG.md
doc-readme             Write README.md
dprint-check           Dprint check
dprint-fmt             Dprint format
help                   Display this help screen
links-check            Check links
links-mirror           Mirror links
makefile-descriptions  Check if all Makefile rules have descriptions
typos                  Check typos
typos-fix              Fix typos
```

# How to Release

[back^](#index)

To generate a new version, you need to follow these steps:

1. Run the command `git tag -a <your.new.version> -m "version <your.new.version>"`.
2. Run the command `make doc-changelog && make doc-readme`.
3. Run the command `git add -A && git commit -m "release: <your.new.version>"`.
4. Run `git push` to `main`.
