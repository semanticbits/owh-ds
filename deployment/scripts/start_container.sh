#!/usr/bin/env bash

set -e
echo "** starting containers ***"
cd /tmp/deploy
echo "- Executing in /tmp/deploy -"
ls
pwd
echo "executing compose up"
/usr/local/bin/docker-compose up -d --no-build
echo "*** completed***"