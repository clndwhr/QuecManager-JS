import { FieldData, ResponseData } from "@/types/types";

export interface CFUN {
    cfun: string;
}

export const cfun = (data: ResponseData): CFUN => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+CFUN:')).map((line) => {
        return { cfun: line.split(':')[1].trim() };
    })[0] as CFUN;
};

// +CFUN: <fun>

// SA Mode
// AT+CFUN?\n
// +CFUN: 1\n

// NSA Mode
// AT+CFUN?\n
// +CFUN: 1\n
