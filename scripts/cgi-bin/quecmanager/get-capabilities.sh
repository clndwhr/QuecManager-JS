#!/bin/sh

CAPES_FILE=/tmp/capbilities.tmp

if [ -f "$CAPES_FILE" ]; then
    if find "$CAPES_FILE" -mmin +1440 | grep -q .; then
        rm -f $CAPES_FILE
    fi
    if [ -f "$CAPES_FILE" ]; then
        cat $CAPES_FILE
        exit 0;
    fi
fi
PLATFORM=$(cat /sys/devices/soc0/machine)
SPEEDTEST=false
if [ command -v speedtest >/dev/null 2>&1 ]; then
    SPEEDTEST=true
fi
EXPERIMENTAL_QUECWATCH=true
EXPERIMENTAL_QUECPROFILES=true
EXPERIMENTAL_KEEPALIVE=true
EXPERIMENTAL_CELLSCAN=true

case $PLATFORM in 
    *LEMUR*|*PRARIE*)
        SPEEDTEST=false
        EXPERIMENTAL_QUECWATCH=false
        EXPERIMENTAL_QUECPROFILES=false
        EXPERIMENTAL_KEEPALIVE=false
        EXPERIMENTAL_CELLSCAN=false
        FIRMWARE_VERSION=$(atcmd 'AT+QGMR' | sed -n '2p' | tr -d '\r' | cut -n8- | rev | cut -n5- | rev)
        MODEM_TYPE=$(atcmd 'AT+CGMM' | sed -n '2p' | tr -d '\r' | cut -n8- | rev | cut -n5- | rev)
        MODEM_MANUFACTURER=$(atcmd 'AT+CGMI' | sed -n '2p' | tr -d '\r' | cut -n8- | rev | cut -n5- | rev)
        ;;
    *)
        FIRMWARE_VERSION=$(sms_tool at -t 3 'AT+QGMR' | sed -n '2p' | tr -d '\r')
        MODEM_TYPE=$(sms_tool at -t 3 'AT+CGMM' | sed -n '2p' | tr -d '\r')
        MODEM_MANUFACTURER=$(sms_tool at -t 3 'AT+CGMI' | sed -n '2p' | tr -d '\r')
        ;;
esac


RESPONSE="Content-Type: application/json\n"
RESPONSE="${RESPONSE}Cache-Control: no-cache, no-store, must-revalidate\n"
RESPONSE="${RESPONSE}Pragma: no-cache\n"
RESPONSE="${RESPONSE}Expires: 0\n\n"
RESPONSE="${RESPONSE}{\n"
RESPONSE="${RESPONSE}  \"speedtest\": ${SPEEDTEST},\n"
RESPONSE="${RESPONSE}  \"quecwatch\": ${EXPERIMENTAL_QUECWATCH},\n"
RESPONSE="${RESPONSE}  \"quecprofiles\": ${EXPERIMENTAL_QUECPROFILES},\n"
RESPONSE="${RESPONSE}  \"keepalive\": ${EXPERIMENTAL_KEEPALIVE},\n"
RESPONSE="${RESPONSE}  \"cellscan\": ${EXPERIMENTAL_CELLSCAN},\n"
RESPONSE="${RESPONSE}  \"updated_on\": \"$(date "+%Y-%m-%d %H:%M:%S")\",\n"
RESPONSE="${RESPONSE}  \"firmware\": \"${FIRMWARE_VERSION}\",\n"
RESPONSE="${RESPONSE}  \"modem\": \"${MODEM_TYPE}\",\n"
RESPONSE="${RESPONSE}  \"manufacturer\": \"${MODEM_MANUFACTURER}\"\n"
RESPONSE="${RESPONSE}}\n"

echo -e "${RESPONSE}" > $CAPES_FILE
echo -e "${RESPONSE}"

exit 0;