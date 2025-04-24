import { ResponseData } from "@/types/types";

export interface CGSN {
    imei: string;
}

export const cgsn = (data: ResponseData): CGSN => {
    return data.response.split('\n').map(l => {
        return l.trim() ? { imei: l.trim() } : { imei: "Unknown" };
    })[1] as CGSN;
};

// <IMEI>

// SA Mode
// AT+CGSN\n
// 3##5965###81##9\n

// NSA Mode
// AT+CGSN\n
// 3##5965###81##9\n
