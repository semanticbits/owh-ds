#!/usr/bin/env bash

set -e
echo "** Loading images ***"
cd /tmp/deploy
echo "- Executing in /tmp/deploy -"
ls
pwd
echo "loading images"
docker load -i owh_web.tar.gz
echo "***completed***"
