import { ResponseData } from "@/types/types";

export interface CGMM {
    cgmm: string;
}

export const cgmm = (data: ResponseData): CGMM => {
    return { cgmm: data.response.split('\n')[1] }
};
// +CGMM: <hardware model>

// AT+CGMM\n
// RM551E-GL\n