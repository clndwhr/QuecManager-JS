import { ResponseData } from "@/types/types";
import { BANDWIDTH_MAP, NR_BANDWIDTH_MAP } from "@/constants/home/index";

export interface CAInfo {
    type: string;
    earfcn?: string;
    bandwidth?: string;
    band?: string;
    pci?: string;
    rsrp?: string;
    rsrq?: string;
    sinr?: string;
}

export const qcainfo = (data: ResponseData): CAInfo[] => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QCAINFO:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const type = parts[0].trim().replace(/"/g, '');
        const earfcn = parts[1].trim();
        const band = parts[3].trim().replace(/"/g, '');
        const bandwidth = band.includes("NR5G") ? NR_BANDWIDTH_MAP[parts[2].trim()] : BANDWIDTH_MAP[parts[2].trim()];
        const invalidSINRs = [-32768];
        const pciIndex: 4 | 5 = (() => {
            switch(line.split(":")[1].split(",").length) {
                case 8:
                    return 4; // length 8, PCI is at index 4, NR5G PCC and NR5G SCC Band when NR5G-NSA
                case 13:
                case 12:
                case 10:
                default:
                    return 5; // length 13, PCI is at index 5, LTE SCC Band
            }
        })();
        const rsrpIndex: 5 | 6 |9 = (() => {
            switch (parts.length) {
              case 8: // length 8, PCI is at index 4, NR SA PCC and NR NSA SCC Band when NR5G-NSA
                return 5;
              case 12: // length 12, PCI is at index 5, NR NSA/SA SCC Band X
                return 9;
              case 13: // length 13, PCI is at index 5, LTE SCC Band X
              case 10: // length 10, PCI is at index 5, LTE/NR NSA PCC Band X
                default:
                return 6;
            }
        })();
        const rsrqIndex: 6 | 7 | 10 = (() => {
            switch (parts.length) {
              case 8: // length 8, PCI is at index 4, NR SA PCC and NR NSA SCC Band when NR5G-NSA
                return 6;
              case 12: // length 12, PCI is at index 5, NR NSA/SA SCC Band X
                return 10;
              case 13: // length 13, PCI is at index 5, LTE SCC Band X
              case 10: // length 10, PCI is at index 5, LTE/NR NSA PCC Band X
            default:
                return 7;
            }
        })();
        const sinrIndex: 7 | 9 | 11 = (() => {
            switch (parts.length) {
                case 8: // length 8, NR SA PCC and NR NSA SCC Band when NR5G-NSA
                    return 7;
                case 12: // length 12, NR NSA/SA SCC Band X
                    return 11;
                case 13: // length 13, LTE SCC Band X
                case 10: // length 10, LTE/NR NSA PCC Band X
                default:
                    return 9;
            }
        })();
        const pci = parts[pciIndex].trim();
        const rawRsrp = parts[rsrpIndex].trim();
        const rawRsrq = parts[rsrqIndex].trim();
        const rawSINR = parts[sinrIndex]?.trim();
        return {
            type,
            earfcn,
            bandwidth,
            band: band.includes("NR5G") ? `n${band.split("BAND")[1].trim()}` : `b${band.split("BAND")[1].trim()}`,
            pci,
            rsrp: !isNaN(parseInt(rawRsrp)) && parseInt(rawRsrp) >= -140 && parseInt(rawRsrp) <= -40 ? rawRsrp : "Unknown",
            rsrq: !isNaN(parseInt(rawRsrq)) && parseInt(rawRsrq) >= -20 && parseInt(rawRsrq) <= -3 ? rawRsrq : "Unknown",
            sinr: !invalidSINRs.includes(parseInt(rawSINR)) && !isNaN(parseInt(rawSINR)) && !band.includes("LTE") ? Math.round(parseInt(rawSINR) / 100).toString() : !isNaN(parseInt(rawSINR)) && !invalidSINRs.includes(parseInt(rawSINR)) ? rawSINR : "Unknown"
        };
    });
};


// In LTE mode:
// +QCAINFO: "PCC",<freq>,<bandwidth>,<band>,<pcell_state>,<PCID>,<RSRP>,<RSRQ>,<RSSI>,<RSSNR>
// [+QCAINFO: "SCC",<freq>,<bandwidth>,<band>,<scell_state>,<PCID>,<RSRP>,<RSRQ>,<RSSI>,<RSSNR><UL_configured>,<UL_bandwidth>,<UL_EARFCN>]

// In EN-DC(NSA) mode:
// +QCAINFO: "PCC",<freq>,<bandwidth>,<band>,<pcell_state>,<PCID>,<RSRP>,<RSRQ>,<RSSI>,<RSSNR>
// [+QCAINFO: "SCC",<freq>,<bandwidth>,<band>,<scell_state>,<PCID>,<RSRP>,<RSRQ>,<RSSI>,<RSSNR><UL_configured>,<UL_bandwidth>,<UL_EARFCN>]

// [+QCAINFO: "SCC",<freq>,<NR_DL_bandwidth>,<NR_band>,<PCID>][,<NR_RSRP>,<NR_RSRQ>[,<NR_SNR>]]
// [+QCAINFO: "SCC",<freq>,<NR_DL_bandwidth>,<NR_band>,<scell_state>,<PCID>,<UL_configured>,<NR_UL_bandwidth>,<UL_ARFCN>[,<NR_RSRP>,<NR_RSRQ>[,<NR_SNR>]]

// In SA mode:
// +QCAINFO: "PCC",<freq>,<NR_DL_bandwidth>,<NR_band>,<PCID>[,<NR_RSRP>,<NR_RSRQ>[,<NR_SNR>]]
// [+QCAINFO: "SCC",<freq>,<NR_DL_bandwidth>,<NR_band>,<scell_state>,<PCID>,<UL_configured>,<NR_UL_bandwidth>,<UL_ARFCN>[,<NR_RSRP>,<NR_RSRQ>[,<NR_SNR>]]



// SA MODE
// AT+QCAINFO=1;+QCAINFO;+QCAINFO=0\n
// +QCAINFO: \"PCC\",501390,12,\"NR5G BAND 41\",153,-79,-11,2582\n
// +QCAINFO: \"SCC\",393850,3,\"NR5G BAND 25\",1,696,0,-,-,0,0,-32768\n
// +QCAINFO: \"SCC\",521310,11,\"NR5G BAND 41\",1,153,0,-,-,-76,-11,427\n

// AT+QCAINFO=1;+QCAINFO;+QCAINFO=0
// +QCAINFO: \"PCC\",521310,11,\"NR5G BAND 41\",153,-75,-11,2593
// +QCAINFO: \"SCC\",393850,3,\"NR5G BAND 25\",1,696,0,-,-,-93,-11,-32768
// +QCAINFO: \"SCC\",501390,12,\"NR5G BAND 41\",1,153,0,-,-,-74,-11,-32768

// NSA MODE
// AT+QCAINFO=1;+QCAINFO;+QCAINFO=0\n
// +QCAINFO: \"PCC\",854,50,\"LTE BAND 2\",1,126,-94,-11,-66,10\n
// +QCAINFO: \"SCC\",501390,12,\"NR5G BAND 41\",153,-78,-11,2582\n
// +QCAINFO: \"SCC\",521310,11,\"NR5G BAND 41\",1,153,0,-,-,-78,-11,2582\n