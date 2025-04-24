import { ResponseData } from "@/types/types";


export interface CNum {
    phoneNumber: string;
    type: number;
    typeDescription: string;
}

export interface CNumType {
    type: number;
    description: string;
}

export const CNUM_TYPE: CNumType[] = [
    { type: 129, description: "Unknown Type" },
    { type: 145, description: "International type (contains the character \"+\")" },
    { type: 161, description: "National type" },
]

// NOTE: needs additional formatting and value checks, especially for variable type
export const cnum = (data: ResponseData): CNum => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+CNUM:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const phoneNumber = parts[1].trim().replace(/"/g, '');
        const type = parseInt(parts[2].trim());
        const typeDescription = CNUM_TYPE.find((item) => item.type === type)?.description || "Unknown Type";
        return { phoneNumber, type, typeDescription };
    })[0] as CNum;
};

// +QUIMSLOT: <slot>

// SA Mode
// AT+CNUM\n
// +CNUM: ,\"1#########\",129\n

// NSA Mode
// AT+CNUM\n
// +CNUM: ,\"1#########\",129\n
