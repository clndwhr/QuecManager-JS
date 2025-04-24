import { ResponseData } from "@/types/types";

export interface CREG {
    n: number;
    stat: number;
    lac?: string;
    ci?: string;
    act?: number;
}

export const creg = (data: ResponseData): CREG => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+CREG:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const n = parseInt(parts[0].trim());
        const stat = parseInt(parts[1].trim());
        const lac = parts[2] ? parts[2].trim() : null;
        const ci = parts[3] ? parts[3].trim() : null;
        const act = parts[4] ? parseInt(parts[4].trim()) : null;
        return { n, stat, lac, ci, act };
    })[0] as CREG;
};

// +CREG: <n>,<stat>[,<lac>,<ci>[,<AcT>]]

// SA Mode
// AT+CREG?\n
// +CREG: 0,0\n

// NSA Mode
// AT+CREG?\n
// +CREG: 0,0\n
