import { ResponseData } from "@/types/types";

export interface QGMR {
    qgmr: string;
}

export const qgmr = (data: ResponseData): QGMR => {
    return { qgmr: data.response.split('\n')[1] }
};

// +QGMR: <firmare_version>

// AT+QGMR\n
// RM551EGL00AAR01A03M8G_A0.001.A0.001\n
