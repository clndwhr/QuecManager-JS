import { ResponseData } from "@/types/types";


export interface QCAPABILITY {
    parameter: string;
    capability: number[];
}

export const qcapability = (data: ResponseData): QCAPABILITY[] => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+QGETCAPABILITY:')).map((line) => {
        const [command, parameter, parts] = line.split(':');
        const capability = parts.split(",").map(Number) as number[];
        return { 
            parameter: parameter.trim(), // Remove leading/trailing whitespace
            capability,
         };
    }) as QCAPABILITY[];
};

// +QUIMSLOT: <slot>

// SA Mode
// AT+QGETCAPABILITY\n
// +QGETCAPABILITY: NR:1,2,3,5,7,8,12,14,20,25,26,28,30,38,40,41,48,71,75,77,78,79,92,257,258,259,260,261\n
// +QGETCAPABILITY: LTE-FDD:1,2,3,4,5,7,8,12,13,14,17,18,19,20,25,26,28,29,30,32,66,70,71\n
// +QGETCAPABILITY: LTE-TDD:34,38,39,40,41,42,43,46,48,53\n
// +QGETCAPABILITY: WCDMA:1,2,4,5,8,19\n
// +QGETCAPABILITY: LTE-CATEGORY:20\n
// +QGETCAPABILITY: LTE-CA:1\n

// NSA Mode
// AT+QGETCAPABILITY\n
// +QGETCAPABILITY: NR:0\n
// +QGETCAPABILITY: LTE-FDD:1,2,3,4,5,7,8,12,13,14,17,18,19,20,25,26,28,29,30,32,66,70,71\n
// +QGETCAPABILITY: LTE-TDD:34,38,39,40,41,42,43,46,48,53\n
// +QGETCAPABILITY: WCDMA:1,2,4,5,8,19\n
// +QGETCAPABILITY: LTE-CATEGORY:20\n
// +QGETCAPABILITY: LTE-CA:1\n