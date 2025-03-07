#!/bin/sh

# Script path
SCRIPT_PATH=$(readlink -f "$0")

# Check if files exist and are writable
missing_files=0

# Check apn_profiles.log
if [ ! -f "/tmp/apn_profiles.log" ]; then
    logger -t log_cleanup "File not found: /tmp/apn_profiles.log"
    missing_files=1
elif [ ! -w "/tmp/apn_profiles.log" ]; then
    logger -t log_cleanup "No write permission for file: /tmp/apn_profiles.log"
    missing_files=1
fi

# Check imei_profiles.log
if [ ! -f "/tmp/imei_profiles.log" ]; then
    logger -t log_cleanup "File not found: /tmp/imei_profiles.log"
    missing_files=1
elif [ ! -w "/tmp/imei_profiles.log" ]; then
    logger -t log_cleanup "No write permission for file: /tmp/imei_profiles.log"
    missing_files=1
fi

# Check at_commands.log
if [ ! -f "/var/log/at_commands.log" ]; then
    logger -t log_cleanup "File not found: /var/log/at_commands.log"
    missing_files=1
elif [ ! -w "/var/log/at_commands.log" ]; then
    logger -t log_cleanup "No write permission for file: /var/log/at_commands.log"
    missing_files=1
fi

# Exit if any files are missing or not writable
if [ $missing_files -eq 1 ]; then
    logger -t log_cleanup "Exiting due to missing or unwritable files"
    exit 1
fi

# Fix the spacing in the cron line to ensure exactly 5 fields
CRON_LINE="0 0 * * * $SCRIPT_PATH"

# Install crontab while preserving other entries
if ! crontab -l | grep -Fq "$SCRIPT_PATH"; then
    # Create temporary file
    TEMP_CRON=$(mktemp)
    
    # Get existing crontab
    crontab -l 2>/dev/null > "$TEMP_CRON" || true
    
    # Remove any old instances of this script
    if [ -s "$TEMP_CRON" ]; then
        sed -i "\#$SCRIPT_PATH#d" "$TEMP_CRON"
    fi
    
    # Add new cron line
    echo "$CRON_LINE" >> "$TEMP_CRON"
    
    # Install new crontab
    if crontab "$TEMP_CRON"; then
        logger -t log_cleanup "Successfully installed crontab job"
    else
        logger -t log_cleanup "Failed to install crontab job"
        rm -f "$TEMP_CRON"
        exit 1
    fi
    
    # Clean up
    rm -f "$TEMP_CRON"
fi

# Clean log files
if ! echo "" > "/tmp/apn_profiles.log"; then
    logger -t log_cleanup "Failed to clean file: /tmp/apn_profiles.log"
    exit 1
fi

if ! echo "" > "/tmp/imei_profiles.log"; then
    logger -t log_cleanup "Failed to clean file: /tmp/imei_profiles.log"
    exit 1
fi

if ! echo "" > "/var/log/at_commands.log"; then
    logger -t log_cleanup "Failed to clean file: /var/log/at_commands.log"
    exit 1
fi

logger -t log_cleanup "Successfully cleaned log files"