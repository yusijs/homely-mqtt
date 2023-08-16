#!/bin/sh

echo "Checking architecture to determine packages to be installed"

# This script is used to install additional packages for armv7 architecture
if [ "$TARGETPLATFORM" = "linux/arm/v7" ]; then
  echo "armv7 detected, installing required packages..."
  apk add --update --no-cache build-base python3 sqlite-dev && ln -sf python3 /usr/bin/python
else
  echo "armv7 not detected, skipping installation of additional packages..."
fi
