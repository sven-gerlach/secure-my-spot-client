#!/usr/bin/env bash
# this script is being executed during deployment build stage inside the production Dockerfile (just before the deploy
# command is run of the first build-stage

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace


# Set environment values if they exist as arguments
if [ $# -ne 0 ]; then
  echo "===> Overriding env params with args ..."
  for var in "$@"
  do
    export "$var"
  done
fi

echo "===> ENV Variables ..."
env | sort

echo "===> User"
id
