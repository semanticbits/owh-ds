#!/usr/bin/env bash
cd server
echo "-------------------------------"
echo "  Sleeping 1m"
echo "-------------------------------"
echo "*** Starting Node server ******"
export OWH_HOME=/usr/local/owh/.owh
nohup npm run start
exit 0
