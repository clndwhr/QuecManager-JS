import { ResponseData } from "@/types/types";

export interface CGMI {
    cgmi: string;
}

export const cgmi = (data: ResponseData): CGMI => {
    return { cgmi: data.response.split('\n')[1] }
};
// +CGMI: <manufacturer>

// AT+CGMI\n
// Quectel\n
