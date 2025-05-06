// import { HomeData } from "@/types/types";
import { BANDWIDTH_MAP, NR_BANDWIDTH_MAP } from "@/constants/home/index";


const data = {
        "command": "AT+QCAINFO=1;+QCAINFO;+QCAINFO=0",
        "response": "AT+QCAINFO=1;+QCAINFO;+QCAINFO=0\n+QCAINFO: \"PCC\",521310,11,\"NR5G BAND 41\",153,-75,-11,2593\n+QCAINFO: \"SCC\",393850,3,\"NR5G BAND 25\",1,696,0,-,-,-93,-11,-32768\n+QCAINFO: \"SCC\",501390,12,\"NR5G BAND 41\",1,153,0,-,-,-74,-11,-32768\n",
        "status": "success"
    };

interface ResponseData {
    command: string;
    response: string;
    status: string;
}

interface CAInfo {
    type: string;
    earfcn?: string;
    bandwidth?: string;
    band?: string;
    pci?: string;
    rsrp?: string;
    rsrq?: string;
    sinr?: string;
    mimo?: string;
}


export const caInfo = (data: ResponseData): CAInfo[] => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QCAINFO:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const type = parts[0].trim().replace(/"/g, '');
        const earfcn = parts[1].trim();
        const band = parts[3].trim().replace(/"/g, '');
        const bandwidth = band.includes("NR5G") ? NR_BANDWIDTH_MAP[parts[2].trim()] : BANDWIDTH_MAP[parts[2].trim()];
        const bandNumber = band.includes("NR5G") ? `n${band.split("BAND")[1].trim()}` : `b${band.split("BAND")[1].trim()}`;
        const invalidSINRs = [-37268, -32768, -32767, -32766, -32765, -32764, -32763, -32762, -32761, -32760];
        const invalidRSRPs = [-32768, -140];
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
        const rsrp = parts[rsrpIndex].trim();
        const rsrq = parts[rsrqIndex].trim();
        const rawSINR = parts[sinrIndex]?.trim();

        const sinr = !invalidSINRs.includes(parseInt(rawSINR)) && !isNaN(parseInt(rawSINR)) && !band.includes("LTE")  ? Math.round(parseInt(rawSINR) / 100).toString() : rawSINR || "Unknown";
        return {
            type,
            earfcn,
            bandwidth,
            band: bandNumber,
            pci,
            rsrp,
            rsrq,
            sinr
        };
    });
};

// AT+QCAINFO=1;+QCAINFO;+QCAINFO=0
// +QCAINFO: \"PCC\",521310,11,\"NR5G BAND 41\",153,-75,-11,2593
// +QCAINFO: \"SCC\",393850,3,\"NR5G BAND 25\",1,696,0,-,-,-93,-11,-32768
// +QCAINFO: \"SCC\",501390,12,\"NR5G BAND 41\",1,153,0,-,-,-74,-11,-32768

// +QCAINFO: "PCC",<earfcn>,<bandwidth>,<band>,<PCID>,<RSRP>,<RSRQ>,<RSSNR>
// +QCAINFO: "SCC",<earfcn>,<bandwidth>,<band>,<scell_state>,<PCID>,?,?,<RSRP>,<RSRQ>,<RSSI>,<RSSNR>
// [+QCAINFO: "SCC",<earfcn>,<bandwidth>,<band>,<scell_state>,<PCID>,?,?,<RSRP>,<RSRQ>,<RSSI>,<RSSNR>


