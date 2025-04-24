import { ResponseData } from "@/types/types";

export interface QMAPBase {
    parameter: string;
}
export interface QMAPWWAN extends QMAPBase {
    status: number;
    profileID: number;
    IP_family: string;
    IP_address: string;
}
export interface QMAPLANIP extends QMAPBase {
    device_address: string;
    client_address: string;
    gateway_address: string;
}

export const qmap = (data: ResponseData): QMAPWWAN[] | QMAPLANIP[] => {
    // Example implementation: Parse the ResponseData and return an array of QMAP objects
    const parsedData = data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QMAP:')).map((line) => {
        const [parameter, ...rest] = line.split(":")[1].split(",");
        if (parameter.trim().replace(/"/g, "") === "WWAN") {
            const [status, profileID, IP_family, IP_address] = rest;
            return {
                parameter: parameter.trim().replace(/"/g, ""),
                status: parseInt(status, 10),
                profileID: parseInt(profileID, 10),
                IP_family: IP_family.replace(/"/g, ""),
                IP_address: IP_address.replace(/"/g, "")
            } as QMAPWWAN;
        }
        if (parameter.trim().replace(/"/g, "") === "LANIP") {
            const [device_address, client_addr, gateway_address] = rest;
            return {
                parameter: parameter.trim().replace(/"/g, ""),
                device_address: device_address.replace(/"/g, ""),
                client_address: client_addr.replace(/"/g, ""),
                gateway_address: gateway_address.replace(/"/g, ""),
            } as QMAPLANIP;
        }
    }).filter((item): item is QMAPWWAN | QMAPLANIP => item !== undefined);

    if (parsedData.every(item => item.parameter.trim().replace(/"/g, "") === "WWAN")) {
        return parsedData as QMAPWWAN[];
    }
    if (parsedData.every(item => item.parameter.trim().replace(/"/g, "") === "LANIP")) {
        return parsedData as QMAPLANIP[];
    }
    throw new Error("Mixed or invalid QMAP data");
};


// +QMAP: "WWAN",<status>,<profileID>,<IP_family>,<IP_address>
// +QMAP: "WWAN",<status>,<profileID>,<IP_family>,<IP_address>

// Parameter
// <status> Integer type. Status of default QMAP data call.
// 0 Disconnected
// 1 Connected
// <profileID> Integer type. Profile ID of default QMAP data call. Range: 1–16.
// <IP_family> String type. IP type.
// "IPV4" IPv4
// "IPV6" Ipv6
// <IP_address> String type. IP address of default QMAP data call.
// If IPv4 network is not connected, the address is “0.0.0.0”.
// If IPv6 network is not connected, the address is “0:0:0:0:0:0:0:0”.

// Example
// AT+QMAP="WWAN" //Query IP address of default QMAP data call.
// +QMAP: "WWAN",0,1,"IPV4","0.0.0.0"
// +QMAP: "WWAN",0,1,"IPV6","0:0:0:0:0:0:0:0"


// AT+QMAP=\"WWAN\"\n
// +QMAP: \"WWAN\",1,1,\"IPV4\",\"192.0.0.2\"\n
// +QMAP: \"WWAN\",1,1,\"IPV6\",\"2607:fb90:2fd9:151f:25637:4e2e:8911:00e3\"\n

// AND

// AT+QMAP=\"LANIP\"\n
// +QMAP: \"LANIP\",192.168.224.100,192.168.227.99,192.168.224.1\n