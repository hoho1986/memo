# Repositories Concept

## Package

Package is a directory which contain PHP code, it could be anything in theory, and package description (name and version).
Every version of the package is determined as separated package.

There are two options that relevant for package installation.
- `dist`: Archived version of the package. Usually, it is stable release.
- `source`: It is used for development. Usually, it is source code repository.

## Repository
It is package source which is a list of packages. Looking for required packages.
You may add repositories to your project by declaring them in root `composer.json`.
