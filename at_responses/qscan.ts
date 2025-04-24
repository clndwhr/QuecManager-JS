import { ResponseData } from "@/types/types";


export interface QScan {
    type: string;
    earfcn?: string;
    bandwidth?: string;
    band?: string;
    pci?: string;
    rsrp?: string;
    rsrq?: string;
    sinr?: string;
}

export interface QScanNR extends QScan {
    scs?: string;
    rawCellId?: string;
    cellId?: string;
    rawTac?: string;
    tac?: string;
    bandwidth?: string;
    band?: string;
}

export interface QScanLTE extends QScan {
    squall?: string;
    rawCellId?: string;
    cellId?: string;
    rawTac?: string;
    tac?: string;
}

// NOTE: needs additional formatting and value checks, especially for variable type
export const qscan = (data: ResponseData): QScanNR[] | QScanLTE[] => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QSCAN:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const type = parts[0].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim();
        const mcc = parts[1].trim();
        const mnc = parts[2].trim();
        const earfcn = parts[3].trim();
        const pci = parts[4].trim();
        const rsrp = parts[5].trim();
        const rsrq = parts[6].trim();
        const srxlev = parts[7].trim();
        let extendedResult: QScanNR | QScanLTE;
        let rawCellId: string | undefined;
        let rawTac: string | undefined;
        const baseQScan = {
            type,
            mcc,
            mnc,
            earfcn,
            pci,
            rsrp,
            rsrq,
            srxlev,
        }
        if (type === "NR5G") {
            const scs = parts[8].trim();
            rawCellId = parts[9].trim();
            rawTac = parts[10].trim();
            const bandwidth = parts[11].trim();
            const band = parts[12].trim().replace(/"/g, '');
            extendedResult = { ...baseQScan, scs, rawCellId, cellId: parseInt(rawCellId, 16).toString(),rawTac, tac: parseInt(rawTac, 16).toString(), bandwidth, band };
        } else {
            const squall = parts[8].trim();
            rawCellId = parts[9].trim();
            rawTac = parts[10].trim();
            extendedResult = { ...baseQScan, squall, rawCellId, cellId: parseInt(rawCellId, 16).toString(),rawTac, tac: parseInt(rawTac, 16).toString() };
        }
        return extendedResult;
    });
};

// [+QSCAN: "LTE", <MCC>,<MNC>,<freq>,<PCI>,<RSRP>,<RSRQ>,<srxlev>,<squal>[,<cellID>,<TAC>]]
// [+QSCAN: "NR5G",<MCC>,<MNC>,<freq>,<PCI>,<RSRP>,<RSRQ>,<srxlev>,<scs>  [,<cellID>,<TAC>,<bandwidth>,<band>]]

// SA Mode
// AT+QSCAN=3,1\n
// +QSCAN: \\\"NR5G\\\",310,260,126270,93,-82,-12,35,0,105FB0001,A80000,79,71,12,0,-\n
// +QSCAN: \\\"NR5G\\\",310,260,393850,696,-98,-12,21,0,105FB0015,A80000,106,25,38,10,-\n
// +QSCAN: \\\"NR5G\\\",310,260,521310,153,-78,-11,31,1,105FB0137,A80000,245,41,34,14,-\n
// +QSCAN: \\\"NR5G\\\",313,340,401050,44,-118,-14,3,0,03C4E7077,6143,133,70,44,0,-\n
// +QSCAN: \\\"NR5G\\\",313,340,431530,44,-120,-15,1,0,03C4E707A,6143,25,66,3,4,-\n
// +QSCAN: \\\"NR5G\\\",313,340,123870,848,-100,-14,21,0,03C4E7047,6143,25,71,1,    8,-\n
// +QSCAN: \\\"NR5G\\\",311,480,648672,3,-,-,-,1,8F46A001A,-,273,77,140,6,-\

// NSA Mode
// AT+QSCAN=3,1\n
// +QSCAN: \\\"NR5G\\\",310,260,501390,153,-77,-11,32,1,105FB012D,A80000,273,41,36,0,-\n
// +QSCAN: \\\"NR5G\\\",310,260,126270,93,-81,-11,36,0,105FB0001,A80000,79,71,12,0,-\n
// +QSCAN: \\\"NR5G\\\",310,260,393850,696,-97,-12,22,0,105FB0015,A80000,106,25,38,10,-\n
// +QSCAN: \\\"NR5G\\\",310,260,521310,153,-78,-11,31,1,105FB0137,A80000,245,41,34,14,-\n
// +QSCAN: \\\"NR5G\\\",313,340,123870,848,-99,-16,22,0,03C4E7047,6143,25,71,1,8,-\n
// +QSCAN: \\\"NR5G\\\",313,340,431530,44,-119,-14,2,0,03C4E707A,6143,25,66,3,4,-\n
// +QSCAN: \\\"NR5G\\\",313,340,401050,44,-123,-15,-2,0,03C4E7077,6143,133,70,44,0,-\n
// +QSCAN: \\\"NR5G\\\",311,480,648672,3,-,-,-,1,8F46A001A,-,273,77,140,6,-\n
// +QSCAN: \\\"NR5G\\\",310,410,174770,191,-,-,-,0,5885B3819,-,52,5,15,2,-\n
// +QSCAN: \\\"NR5G\\\",313,100,174770,191,-,-,-,0,5885B3819,-,52,5,15,2,-\n
// +QSCAN: \\\"NR5G\\\",310,410,177150,655,-,-,-,0,588562C49,-,52,5,20,2,-\n
// +QSCAN: \\\"NR5G\\\",313,100,177150,655,-,-,-,0,588562C49,-,52,5,20,2,-