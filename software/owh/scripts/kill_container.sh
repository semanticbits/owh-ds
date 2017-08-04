#!/usr/bin/env bash

set -e
echo "** Killing containers ***"
cd /tmp/deploy
echo "- Executing in /tmp/deploy -"
ls
pwd
echo "- docker compose down - "
docker-compose down
echo " - removing images -"
docker rmi owh_web
echo "***completed***"
