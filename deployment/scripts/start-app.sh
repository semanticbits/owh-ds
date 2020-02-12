#!/usr/bin/env bash
cd server
echo "-------------------------------"
echo "  Sleeping 1m"
sleep 1m
echo "-------------------------------"
echo "*** Starting Node server ******"
export OWH_HOME=/usr/local/owh/.owh
nohup npm start | bunyan
