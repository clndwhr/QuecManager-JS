import { ResponseData } from "@/types/types";

export interface CIMI {
    imsi: number | string;
}

export const cimi = (data: ResponseData): CIMI => {
    return { imsi: parseInt(data.response.split('\n')[1]) }
};

// <IMSI>

// SA Mode
// AT+CIMI\n
// 310260000920030\n

// NSA Mode
// AT+CIMI\n
// 310260###9###3#\n
