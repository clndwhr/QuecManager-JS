import { ResponseData } from "@/types/types";


export interface QuimSlot {
    slot: number;
}

// NOTE: needs additional formatting and value checks, especially for variable type
export const quimslot = (data: ResponseData): QuimSlot => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QUIMSLOT:')).map((line) => {
        const parts = line.split(':')[1].split(',');
        const slot = parseInt(parts[0].trim());
        return { slot };
    })[0] as QuimSlot;
};

// +QUIMSLOT: <slot>

// SA Mode
// AT+QUIMSLOT?\n
// +QUIMSLOT: 1\n

// NSA Mode
// AT+QUIMSLOT?\n
// +QUIMSLOT: 1\n