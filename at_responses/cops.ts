import { ResponseData, FieldData } from "@/types/types";


export interface COps {
    mode: number;
    modeDescription?: string;
    format: number;
    formatDescription?: string;
    oper: string;
    AcT: number;
    AcTDescription?: string;
}

const COps_mode: FieldData[] = [
    { value: 0, description: "Automatic Operator Selection, <oper> field is ignored" },
    { value: 1, description: "Manual Operator Selection, , <oper> field is required, <AcT> field is optional" },
    { value: 2, description: "Deregister from network" },
    { value: 3, description: "Set Only <format> and do not attempt (de)registration" },
    { value: 4, description: "Manual/Automatic Selection, if manual fails, auto mode (0) will be entered" },
]

const COps_format: FieldData[] = [
    { value: 0, description: "Long alphanumeric format (\"Max 16 characters\")" },
    { value: 1, description: "Short alphanumeric format" },
    { value: 2, description: "Numeric format. GSM location area identification number" }
]

const COps_AcT: FieldData[] = [
    { value: 2, description: "UTRAN" },
    { value: 4, description: "UTRAN W/HSDPA" },
    { value: 5, description: "UTRAN W/HSUPA" },
    { value: 6, description: "UTRAN W/HSDPA and HSUPA" },
    { value: 7, description: "E-UTRA" },
    { value: 10, description: "E-UTRAN connected to a 5GCN" },
    { value: 11, description: "NR connected to 5GCN" },
    { value: 12, description: "NG-RAN" },
    { value: 13, description: "E-UTRAN-NR dual connectivity" },
]

export const cops = (data: ResponseData): COps => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+COPS:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const  mode = parseInt(parts[0].trim());
        const format = parseInt(parts[1].trim());
        const oper = parts[2].trim().replace(/"/g, '');
        const AcT = parseInt(parts[3].trim());
        const modeDescription = COps_mode.find((item) => item.value === mode)?.description || "Unknown Mode";
        const formatDescription = COps_format.find((item) => item.value === format)?.description || "Unknown Format";
        const AcTDescription = COps_AcT.find((item) => item.value === AcT)?.description || "Unknown AcT";
        return { mode, modeDescription, format, formatDescription, oper, AcT, AcTDescription };
    })[0] as COps;
};

// +COPS: <mode>[,<format>[,<oper>][,<AcT>]]

// SA Mode
// AT+COPS?\n
// +COPS: 0,0,\"T-Mobile\",11\n

// NSA Mode
// AT+COPS?\n
// +COPS: 0,0,\"T-Mobile\",11\n