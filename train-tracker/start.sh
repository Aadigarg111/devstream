#!/bin/bash
cd /home/ubuntu/.openclaw/workspace/train-tracker
pkill -f "node server.js"
sleep 1
nohup node server.js > server.log 2>&1 &