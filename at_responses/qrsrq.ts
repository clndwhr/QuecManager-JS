import { ResponseData } from "@/types/types";

export interface QRSRQ {
    antenna1: number | string;
    antenna2: number | string;
    antenna3: number | string;
    antenna4: number | string;
    mode: number | string;
}

export const qrsrq = (data: ResponseData): QRSRQ => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QRSRQ:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const antenna1 = parseInt(parts[0].trim()) || "-";
        const antenna2 = parseInt(parts[1].trim()) || "-";
        const antenna3 = parseInt(parts[2].trim()) || "-";
        const antenna4 = parseInt(parts[3].trim()) || "-";
        const mode = parts[4] ? parts[4].trim() : null;
        return { antenna1, antenna2, antenna3, antenna4, mode };
    }).find(x => x.mode) as QRSRQ;
};
// +QRSRQ: <PRX>,<DRX>,<RX2>,<RX3>,<sysmode>

// Parameter
// <PRX> Integer type. PRX path RSRQ value. Range: -20 to -3 dB.
// <DRX> Integer type. DRX path RSRQ value. Range: -20 to -3 dB.
// <RX2> Integer type. RX2 path RSRQ value. Range: -20 to -3 dB.
// <RX3> Integer type. RX3 path RSRQ value. Range: -20 to -3 dB.
// <sysmode> String type. It indicates the service mode in which the MT will report the RSRQ.
// LTE LTE mode
// NR5G NR5G mode
// 1. This command is only supported in LTE and NR5G.
// 2. If the queried <PRX>, <DRX>, <RX2> and <RX3> is -32768, it indicates that the RSRQ value is
// invalid.
// 3. This command is strongly related to the RF link and is generally only used for customer reference
// and cannot be used as a sensitivity test. In addition, it is best to use it when measuring the speed, the
// results are more accurate.

// SA MODE
// AT+QRSRQ\n
// +QRSRQ: -10,-10,-32768,-32768,NR5G\n

// NSA MODE
// AT+QRSRQ\n
// +QRSRQ: -8,-9,-32768,-32768,LTE\n
// +QRSRQ: -10,-10,-32768,-32768,NR5G\n
