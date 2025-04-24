import { ResponseData } from "@/types/types";

export interface QSINR {
    antenna1: number | string;
    antenna2: number | string;
    antenna3: number | string;
    antenna4: number | string;
    mode: number | string;
}

export const qsinr = (data: ResponseData): QSINR => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QSINR:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const antenna1 = parseInt(parts[0].trim()) || "-";
        const antenna2 = parseInt(parts[1].trim()) || "-";
        const antenna3 = parseInt(parts[2].trim()) || "-";
        const antenna4 = parseInt(parts[3].trim()) || "-";
        const mode = parts[4].trim() || "Unknown";
        return { antenna1, antenna2, antenna3, antenna4, mode };
    }).find(x => x.mode) as QSINR;
};
// +QSINR: <PRX>,<DRX>,<RX2>,<RX3>,<sysmode>

// Parameter
// <PRX> Integer type. PRX path SINR value. Range: -20 to 30 dB in LTE, -23 to 40 dB in 5G.
// <DRX> Integer type. DRX path SINR value. Range: -20 to 30 dB in LTE, -23 to 40 dB in 5G.
// <RX2> Integer type. RX2 path SINR value. Range: -20 to 30 dB in LTE, -23 to 40 dB in 5G.
// <RX3> Integer type. RX3 path SINR value. Range: -20 to 30 dB in LTE, -23 to 40 dB in 5G.
// <sysmode> String type. It indicates the service mode in which the MT will report the SINR.
// LTE LTE mode
// NR5G 5G mode
// 1. This command is only supported in LTE and NR5G.
// 2. If the queried <PRX>, <DRX>, <RX2> or <RX3> is -32768, it indicates that the SINR value is
// invalid.
// 3. This command is strongly related to the RF link and is generally only used for customer reference
// and cannot be used as a sensitivity test. In addition, it is best to use it when measuring the speed,
// the results are more accurate.


// SA MODE
// AT+QSINR\n
// +QSINR: 25,25,-32768,-32768,NR5G\n

// NSA MODE
// AT+QSINR\n
// +QSINR: 11,9,-32768,-32768,LTE\n
// +QSINR: 23,22,-32768,-32768,NR5G\n
