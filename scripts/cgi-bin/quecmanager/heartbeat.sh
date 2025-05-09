#!/bin/sh

echo "Content-Type: application/json"
echo "Cache-Control: no-cache, no-store, must-revalidate"
echo "Pragma: no-cache"
echo "Expires: 0"
echo ""

PLATFORM=$(cat /sys/devices/soc0/machine)

# Basic response indicating the server is up
echo "{\"alive\": true, \"platform\": \"$PLATFORM\"}"