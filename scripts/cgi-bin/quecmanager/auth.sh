#!/bin/sh

# Set Content-Type for CGI script
echo "Content-type: application/json"
echo ""

# Read POST data
read -r POST_DATA

# Debug log for generated hash
DEBUG_LOG="/tmp/auth.log"
touch "/tmp/auth.log"
echo "" > "$DEBUG_LOG"

# Extract the password from POST data (URL encoded)
USER="root"
INPUT_PASSWORD=$(echo "$POST_DATA" | grep -o 'password=[^&]*' | cut -d= -f2-)
echo "User: $USER" >> "$DEBUG_LOG"

# URL-decode the password while preserving most special characters
# First decode percent-encoded sequences
urldecode() {
    local encoded="${1//+/ }"
    printf '%b' "${encoded//%/\\x}"
}

# Decode the password
INPUT_PASSWORD=$(urldecode "$INPUT_PASSWORD")

# Basic validation to reject & and $ characters
if echo "$INPUT_PASSWORD" | grep -q '[&$]'; then
    echo '{"state":"failed", "message":"Password contains forbidden characters (& or $)"}'
    exit 1
fi

# Sanitize the password for shell usage
INPUT_PASSWORD=$(printf '%s' "$INPUT_PASSWORD" | sed 's/[\"]/\\&/g')
# Extract the hashed password from /etc/shadow for the specified user
USER_SHADOW_ENTRY=$(grep "^$USER:" /etc/shadow)

echo "USER: $USER - Shadow User: $USER_SHADOW_ENTRY" >> $DEBUG_LOG

if [ -z "$USER_SHADOW_ENTRY" ]; then
    echo '{"state":"failed", "message":"User not found"}'
    exit 1
fi

# Extract the password hash (it's the second field, colon-separated)
USER_HASH=$(echo "$USER_SHADOW_ENTRY" | cut -d: -f2)

# Extract the salt (MD5 uses the $1$ prefix followed by the salt)
SALT=$(echo "$USER_HASH" | cut -d'$' -f3)


echo "SALT: $SALT" >> $DEBUG_LOG
# Generate a hash from the input password using the same salt
# Use printf to avoid issues with special characters in echo
GENERATED_HASH=$(printf '%s' "$INPUT_PASSWORD" | openssl passwd -1 -salt "$SALT" -stdin)

# Log generated hash for debugging
echo "Generated hash: %s\n" "$GENERATED_HASH" >> "$DEBUG_LOG"

# Compare the generated hash with the one in the shadow file
if [ "$GENERATED_HASH" = "$USER_HASH" ]; then
    echo '{"state":"success"}'
else
    echo '{"state":"failed", "message":"Authentication failed"}'
fi