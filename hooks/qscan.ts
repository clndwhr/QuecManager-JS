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

interface QScan {
    type: string;
    earfcn?: string;
    bandwidth?: string;
    band?: string;
    pci?: string;
    rsrp?: string;
    rsrq?: string;
    sinr?: string;
}


export const qscan = (data: ResponseData): QScan[] => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QCAINFO:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const type = parts[0].trim().replace(/"/g, '');
        const earfcn = parts[1].trim();
        const band = parts[3].trim().replace(/"/g, '');
        const bandwidth = band.includes("NR5G") ? NR_BANDWIDTH_MAP[parts[2].trim()] : BANDWIDTH_MAP[parts[2].trim()];
        const bandNumber = band.includes("NR5G") ? `n${band.split("BAND")[1].trim()}` : `b${band.split("BAND")[1].trim()}`;
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
        const pci = parts[pciIndex].trim();
        const rsrp = parts[pciIndex + 1].trim();
        const rsrq = parts[pciIndex + 2].trim();
        const sinr = parts[pciIndex + 3]?.trim() || "-"; // Optional, may not be present in all cases
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




// [+QSCAN: "LTE", <MCC>,<MNC>,<freq>,<PCI>,<RSRP>,<RSRQ>,<srxlev>,<squal>[,<cellID>,<TAC>]]
// [+QSCAN: "NR5G",<MCC>,<MNC>,<freq>,<PCI>,<RSRP>,<RSRQ>,<srxlev>,<scs>  [,<cellID>,<TAC>,<bandwidth>,<band>]]