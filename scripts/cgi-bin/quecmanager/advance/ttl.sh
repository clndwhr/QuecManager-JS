#!/bin/sh

echo "Content-type: application/json"
echo ""

ttl_file="/etc/firewall.user.ttl"
lan_utils_script="/etc/data/lanUtils.sh"
PLATFORM=$(cat /sys/devices/soc0/machine)

setup_persistent_config() {
    if [ ! -f "$lan_utils_script" ]; then
        echo "{\"success\": false, \"error\": \"lanUtils.sh not found\"}"
        return 1
    fi

    # Backup the original script if not already done
    if [ ! -f "${lan_utils_script}.bak" ]; then
        cp "$lan_utils_script" "${lan_utils_script}.bak"
    fi

    # Add the local ttl_firewall_file line if it's not already present
    if ! grep -q "local ttl_firewall_file" "$lan_utils_script"; then
        sed -i '/local tcpmss_firewall_filev6/a \  local ttl_firewall_file=/etc/firewall.user.ttl' "$lan_utils_script"
    fi

    # Add the condition to include the ttl_firewall_file if it's not already present
    if ! grep -q "if \[ -f \"\$ttl_firewall_file\" \]; then" "$lan_utils_script"; then
        sed -i '/if \[ -f "\$tcpmss_firewall_filev6" \]; then/i \  if [ -f "\$ttl_firewall_file" ]; then\n    cat \$ttl_firewall_file >> \$firewall_file\n  fi' "$lan_utils_script"
    fi
}

clear_existing_rules() {
    local current_ttl=$1
    if [ -n "$current_ttl" ]; then
        iptables -t mangle -D POSTROUTING -o rmnet+ -j TTL --ttl-set "$current_ttl" 2>/dev/null
        ip6tables -t mangle -D POSTROUTING -o rmnet+ -j HL --hl-set "$current_ttl" 2>/dev/null
    fi
}

case "$REQUEST_METHOD" in
    GET)
        # Ensure consistent JSON format for GET requests
        case "$PLATFORM" in
            *LEMUR*)
                # Check iptables for ttlvalue
                ttlvalue=$(/opt/bin/sudo /usr/sbin/iptables -w 5 -t mangle -vnL | grep TTL | awk '{print $13}' | head -n1)
                ttlenabled=true;

                # Set Variables
                if [ "${ttlvalue}" == "" ] || [ "${ttlvalue}" == "0" ] || [ "${ttlvalue}" == 0 ]; then
                    ttlvalue=0
                    ttlenabled=false
                fi
                ;;
            *)
                if [ -s "$ttl_file" ]; then
                    ttl_value=$(grep 'iptables -t mangle -A POSTROUTING' "$ttl_file" | awk '{for(i=1;i<=NF;i++){if($i=="--ttl-set"){print $(i+1)}}}')
                    # Ensure ttl_value is a number, default to 0 if not
                    if ! [[ "$ttl_value" =~ ^[0-9]+$ ]]; then
                        ttl_value=0
                    fi
                    ttlenabled=true
                else
                    ttlenabled=false
                    ttlvalue=0
                fi
                ;;
        esac
        echo "{\"isEnabled\": $ttlenabled, \"currentValue\": $ttlvalue}"
        ;;
    POST)
        read -r post_data
        ttl_value=$(echo "$post_data" | sed 's/ttl=//')
        case "$PLATFORM" in
            *LEMUR*)
                setTTL=$(printf '%b\n' "${ttl_value//%/\\x}")
                if [ -n "${setTTL}" ]; then
                    log_debug "Stopping service to remove rules"
                    /usrdata/simplefirewall/ttl-override stop &>/dev/null

                    # Convert ttl_value to integer
                    if [ "${ttl_value}" ]; then
                        ttlvalue_int=$(echo "${ttl_value}" | sed 's/[^0-9]//g')
                        log_debug "Converted ttl_value to integer: $ttlvalue_int"
                    fi

                    # Call the sh script with the appropriate parameters
                    if [ "${ttlvalue_int}" != 0 ]; then
                        log_debug "Enabling TTL with value: ${setTTL}"
                        /usrdata/simpleadmin/script/ttl_script.sh enable "${setTTL}" &>/dev/null
                        commandRan="/usrdata/simpleadmin/script/ttl_script.sh enable ${setTTL}"
                        ttlenabled=true
                        ttl_value=$ttlvalue_int
                    elif [ "${ttlvalue_int}" = 0 ]; then
                        log_debug "Disabling TTL"
                        /usrdata/simpleadmin/script/ttl_script.sh disable 0 &>/dev/null
                        commandRan="/usrdata/simpleadmin/script/ttl_script.sh disable 0"
                        ttlenabled=false
                        ttl_value=0
                    fi

                    # log_debug "Starting service to apply rules"
                    /usrdata/simplefirewall/ttl-override start &>/dev/null
                fi

                echo "{\"success\": true, \"debug_logs\": [$(printf '"%s",' "${debug_logs[@]}")]}"
                ;;
            *)
                Ensure ttl_file exists
                touch "$ttl_file" 2>/dev/null
                if [ ! -f "$ttl_file" ]; then
                    echo "{\"success\": false, \"error\": \"Cannot create TTL file\"}"
                    exit 1
                fi

                # Setup persistent configuration
                setup_persistent_config

                # Get current TTL value for cleanup
                current_ttl=$(grep 'iptables -t mangle -A POSTROUTING' "$ttl_file" | awk '{for(i=1;i<=NF;i++){if($i=="--ttl-set"){print $(i+1)}}}')

                if ! [[ "$ttl_value" =~ ^[0-9]+$ ]]; then
                    echo "{\"success\": false, \"error\": \"Invalid TTL value\"}"
                elif [ "$ttl_value" = "0" ]; then
                    clear_existing_rules "$current_ttl"
                    > "$ttl_file"
                    echo "{\"success\": true}"
                else
                    # Clear existing rules
                    clear_existing_rules "$current_ttl"

                    # Set new rules
                    echo "iptables -t mangle -A POSTROUTING -o rmnet+ -j TTL --ttl-set $ttl_value" > "$ttl_file"
                    echo "ip6tables -t mangle -A POSTROUTING -o rmnet+ -j HL --hl-set $ttl_value" >> "$ttl_file"

                    # Apply the rules
                    iptables -t mangle -A POSTROUTING -o rmnet+ -j TTL --ttl-set "$ttl_value"
                    ip6tables -t mangle -A POSTROUTING -o rmnet+ -j HL --hl-set "$ttl_value"

                    echo "{\"success\": true}"
                fi
                ;;
        esac
        ;;
    *)
        echo "{\"success\": false, \"error\": \"Invalid request method\"}"
        ;;
esac