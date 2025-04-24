import { ResponseData } from "@/types/types";

export interface IccId {
    iccid: string;
}

export const iccid = (data: ResponseData): IccId => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+ICCID:')).map((line) => {
        return { iccid: line.split(':')[1].trim() };
    })[0] as IccId;
};

// +ICCID: <ICCID>

// SA Mode
// AT+ICCID\n
// +ICCID: 8901260487759545390F\n

// NSA Mode
// AT+ICCID\n
// +ICCID: 8901260487759545390F\n
