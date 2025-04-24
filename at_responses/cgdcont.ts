import { ResponseData } from "@/types/types";

export interface CGDCONT {
    cid: number;
    pdpType: string;
    apn: string;
    pdpAddr: string;
    dComp?: number | "-";
    hComp?: number | "-";
    ipv4AddrAlloc?: number | "-";
    requestType?: number | "-";
    sscMode?: number | "-";
    sNSSAI?: string;
    prefAccessType?: number | "-";
    alwaysOnReq?: number;
}

export const cgdcont = (data: ResponseData): CGDCONT[] => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+CGDCONT:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const cid = parseInt(parts[0].trim().replace(/"/g, ''));
        const pdpType = parts[1].trim().replace(/"/g, '');
        const apn = parts[2].trim().replace(/"/g, '');
        const pdpAddr = parts[3].trim().replace(/"/g, '');
        const dComp = parseInt(parts[4].trim().replace(/"/g, ''));
        const hComp = parseInt(parts[5].trim().replace(/"/g, ''));
        const ipv4AddrAlloc = parts[6].trim().replace(/"/g, '');
        const requestType = parts[7].trim().replace(/"/g, '');
        const sscMode = parts[16].trim().replace(/"/g, '');
        const sNSSAI = parts[17].trim().replace(/"/g, '');
        const prefAccessType = parts[18].trim().replace(/"/g, '');
        const alwaysOnReq = parts[21].trim().replace(/"/g, '');
        return {
            cid,
            pdpType,
            apn,
            pdpAddr,
            dComp,
            hComp,
            ipv4AddrAlloc: ipv4AddrAlloc.trim() === "" ? "-" : parseInt(ipv4AddrAlloc),
            requestType: requestType.trim() === "" ? "-" : parseInt(requestType),
            sscMode: sscMode === "" ? "-" : parseInt(sscMode),
            sNSSAI: sNSSAI.trim() === "" ? "-" : sNSSAI,
            prefAccessType: prefAccessType.trim() === "" ? "-" : parseInt(prefAccessType),
            alwaysOnReq: parseInt(alwaysOnReq),
        };
    });
};


// In LTE mode:
// +CGDCONT: <cid>,<PDP_type>,<APN>,<PDP_addr>,<d_comp>,<h_comp>,<IPv4AddrAlloc>,<request_type>,,,,,,,,,<SSC_mode>,<S-NSSAI>,<Pref_access_type>,,,<Always-on_req>
// […]

// SA MODE
// AT+CGDCONT?\n
// +CGDCONT: 1,\"IPV4V6\",\"fbb.home\",\"0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0\",0,0,0,0,,,,,,,,,,\"\",,,,0\n
// +CGDCONT: 2,\"IPV4V6\",\"ims\",\"0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0\",0,0,0,0,,,,,,,,,,\"\",,,,0\n
// +CGDCONT: 3,\"IPV4V6\",\"sos\",\"0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0\",0,0,0,1,,,,,,,,,,\"\",,,,0\n

// NSA MODE
// AT+CGDCONT?\n
// +CGDCONT: 1,\"IPV4V6\",\"fbb.home\",\"0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0\",0,0,0,0,,,,,,,,,,\"\",,,,0\n
// +CGDCONT: 2,\"IPV4V6\",\"ims\",\"0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0\",0,0,0,0,,,,,,,,,,\"\",,,,0\n
// +CGDCONT: 3,\"IPV4V6\",\"sos\",\"0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0\",0,0,0,1,,,,,,,,,,\"\",,,,0\n