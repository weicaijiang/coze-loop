#!/usr/bin/env bash

set -ex

# Switch cwd to the project folder
cd $(dirname "$0")

# Import the utilities functions
source ../../../../scripts/scm_base.sh

# Clean up the build directory
rm -rf output output_resource "${ROOT}"/output "${ROOT}"/output_resource

# Prepare
prepare_environment

# Install the dependencies
install_project_deps

build_project

npm run build:storybook

mkdir -p "${ROOT_DIR}"/output
mkdir -p "${ROOT_DIR}"/output_resource

cp -rf ./storybook-static/* "${ROOT_DIR}"/output/
cp -rf ./storybook-static/* "${ROOT_DIR}"/output_resource/
