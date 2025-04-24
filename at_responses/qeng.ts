import { ResponseData } from "@/types/types";

export interface BaseQENG {
    state?: string | null;
    action?: string | null;
}

export interface ENDC_QENG extends BaseQENG {
    nsa?: ENDC_NSA_QENG;
    lte?: LTE_QENG;
}
export interface ENDC_NSA_QENG {
    type?: string | null;
    mcc?: number | string;
    mnc?: number | string;
    pcid?: number | string;
    rsrp?: number | string;
    sinr?: number | string;
    rsrq?: number | string;
    earfcn?: string;
    band?: string;
    nr_dl_bandwidth?: string;
    scs?: number | string;
}

export interface LTE_QENG extends BaseQENG {
    type?: string | null;
    is_tdd?: string;
    mcc?: number | string;
    mnc?: number | string;
    rawCellId?: string;
    cellId?: number | string;
    pcid?: number | string;
    earfcn?: number | string;
    band?: string;
    ul_bandwidth?: number | string;
    dl_bandwidth?: number | string;
    rawTac?: string;
    tac?: number | string;
    rsrp?: number | string;
    rsrq?: number | string;
    rssi?: number | string;
    sinr?: number | string;
    cqi?: number | string;
    tx_power?: number | string;
    srxlev?: string;
}
export interface SA_QENG extends BaseQENG, ENDC_NSA_QENG {
    duplex_mode?: string;
    rawCellId?: string;
    cellId?: number | string;
    tac?: number | string;
    rawTac?: string;
    srxlev?: string;
}
export const qeng = (data: ResponseData): SA_QENG | ENDC_QENG | LTE_QENG  => {
    const lines = data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QENG:'));
    const outputType = lines.length > 1 ? "ENDC" : lines[0].includes("NR5G-SA") ? "NR5G-SA" : "LTE";
    const endcOutput: ENDC_QENG = { };
    const nonEndcOutput: SA_QENG | LTE_QENG = { };
    lines.forEach((line, index) => {
        const parts = line.split(':')[1].split(',');
        let action = null;
        let state = null;
        let type = null;
        if (outputType === "ENDC") { // ENDC Mode
            if (index === 0) {
                action = parts[0].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim();
                state = parts[1].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim();
            } else {
                type = parts[0].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim();
                const lteObject = {};
                const nsaObject = {};
                const earfcnIndex = type === "LTE" ? 6 : 7 ;
                const bandIndex = type === "LTE" ? 7 : 8;
                if (type === "LTE") {
                    Object.assign(lteObject, {
                        type,
                        is_tdd: parts[1].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        mcc: parts[2].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        mnc: parts[3].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        cellId: parts[4].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        pcid: parts[5].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        earfcn: parts[earfcnIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        band: parts[bandIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        ul_bandwidth: parts[8].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        dl_bandwidth: parts[9].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        tac: parts[10].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        rsrp: parts[11].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        rsrq: parts[12].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        rssi: parts[13].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        sinr: parts[14].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        cqi: parts[15].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        tx_power: parts[16].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        srxlev: parts[17].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                    });
                } else if (type === "NR5G-NSA") {
                    Object.assign(nsaObject, {
                        type,
                        mcc: parts[1].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        mnc: parts[2].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        pcid: parts[3].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        rsrp: parts[4].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        sinr: parts[5].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        rsrq: parts[6].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        arfcn: parts[7].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        band: parts[8].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        nr_dl_bandwidth: parts[9].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                        scs: parts[10].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                    });
                }
                return {
                    action,
                    state,
                    nsa: nsaObject,
                    lte: lteObject,
                };
            }
        } else { // SA/LTE Mode
            const tacIndex = outputType === "NR5G-SA" ? 8 :12;
            const earfcnIndex = outputType === "NR5G-SA" ? 9 : 8 ;
            const bandIndex = outputType === "NR5G-SA" ? 10 : 9;
            const rsrpIndex = outputType === "NR5G-SA" ? 12 : 13;
            const rsrqIndex = outputType === "NR5G-SA" ? 13 : 14;
            const sinrIndex = outputType === "NR5G-SA" ? 14 : 16;
            const srxlevIndex = outputType === "NR5G-SA" ? 16 : 19;
            const band = parts[bandIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim();
            const output = {
                action: parts[0].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                state: parts[1].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                type: parts[2].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                [`${outputType === "LTE" ? "is_tdd" : "duplex_mode"}`]: parts[3].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                mcc: parseInt(parts[4].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                mnc: parseInt(parts[5].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                cellIdRaw: parts[6].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                cellId: parseInt(parts[6].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),16) || "-",
                pcid: parseInt(parts[7].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                tacRaw: parts[tacIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                tac: parseInt(parts[tacIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),16) || "-",
                earfcn: parseInt(parts[earfcnIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                band: outputType === "NR5G-SA" ? `n${band}` : `b${band}`,
                [`${outputType === "LTE" ? "dl_bandwidth" : "nr_dl_bandwidth"}`]: parts[11].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                rsrp: parseInt(parts[rsrpIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                rsrq: parseInt(parts[rsrqIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                sinr: parseInt(parts[sinrIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                srxlev: parts[srxlevIndex].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
            };
            if (outputType === "NR5G-SA") {
                Object.assign(output, {
                    scs: parseInt(parts[15].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim())
                });
            } else if (outputType === "LTE") {
                Object.assign(output, {
                    ul_bandwidth: parts[10].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim(),
                    rssi: parseInt(parts[15].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                    cqi: parseInt(parts[17].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                    tx_power: parseInt(parts[18].trim().replace(/\\\\/g, "").replace(/\\/g, "").replace(/"/g, "").trim()),
                });
            }
            Object.assign(nonEndcOutput, output);
        }
    });
    return outputType === "ENDC" ? endcOutput : nonEndcOutput;
};
// In LTE mode:
// +QENG: "servingcell",<state>,"LTE",<is_tdd>,<MCC>,<MNC>,<cellID>,<PCID>,<earfcn>,<freq_band_ind>,<UL_bandwidth>,<DL_bandwidth>,<TAC>,<RSRP>,<RSRQ>,<RSSI>,<SINR>,<CQI>,<tx_power>,<srxlev>

// In SA mode:
// +QENG: "servingcell",<state>,"NR5G-SA",<duplex_mode>,<MCC>,<MNC>,<cellID>,<PCID>,<TAC>,<ARFCN>,<band>,<NR_DL_bandwidth>,<RSRP>,<RSRQ>,<SINR>,<scs>,<srxlev>

// In EN-DC mode:
// +QENG: "servingcell",<state>
// +QENG: "LTE",<is_tdd>,<MCC>,<MNC>,<cellID>,<PCID>,<earfcn>,<freq_band_ind>,<UL_bandwidth>,<DL_bandwidth>,<TAC>,<RSRP>,<RSRQ>,<RSSI>,<SINR>,<CQI>,<tx_power>,<srxlev>
// +QENG: "NR5G-NSA",<MCC>,<MNC>,<PCID>,<RSRP>,<SINR>,<RSRQ>,<ARFCN>,<band>,<NR_DL_bandwidth>,<scs>





































// SA MODE

// +QENG: \"servingcell\",\"NOCONN\",\"NR5G-SA\",\"TDD\",310,260,105FB012D,153,A80000,501390,41,12,-76,-10,26,1,-\n

// NSA Mode

// +QENG: \"servingcell\",\"NOCONN\"\n
// +QENG: \"LTE\",\"FDD\",310,260,1C3C70B,126,854,2,3,3,A800,-94,-11,-66,15,12,190,-\n
// +QENG: \"NR5G-NSA\",310,260,153,-78,23,-10,501390,41,12,1\n


