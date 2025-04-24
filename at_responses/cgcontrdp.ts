import { ResponseData } from "@/types/types";

export interface CGCONTRDP {
    cid: number;
    bearer_type: number;
    apn: string;
    local_addr_and_subnet_mask: string;
    gateway_addr: string;
    dns_prim_addr: string;
    dns_sec_addr: string;
}

export const cgcontrdp = (data: ResponseData): CGCONTRDP => {
    const result = data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+CGCONTRDP:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const cid = parseInt(parts[0].trim());
        const bearer_type = parseInt(parts[1].trim());
        const apn = parts[2].trim().replace(/\"/g, '');
        const local_addr_and_subnet_mask = parts[3].trim().replace(/\"/g, '');
        const gateway_addr = parts[4].trim().replace(/\"/g, '');
        const dns_prim_addr = parts[5].trim().replace(/\"/g, '');
        const dns_sec_addr = parts[6].trim().replace(/\"/g, '');
        return { cid, bearer_type, apn, local_addr_and_subnet_mask, gateway_addr, dns_prim_addr, dns_sec_addr };
    })[0] as CGCONTRDP;

    return result;
};

// +CGCONTRDP: <cid>,<bearer_type>,<APN>,<local_addr_and_subnet_mask>,<gateway_addr>,<DNS_prim_addr>,<DNS_sec_addr>

// AT+CGCONTRDP\n
// +CGCONTRDP: 1,4,\"fbb.home\",\"38.7.251.144.44.169.21.31.10.210.110.87.100.94.204.156\", \"254.128.0.0.0.0.0.0.180.109.87.255.254.69.69.69\", \"253.0.151.106.0.0.0.0.0.0.0.0.0.0.0.9\", \"253.0.151.106.0.0.0.0.0.0.0.0.0.0.0.16\"\n
