import { FieldData, ResponseData } from "@/types/types";

export interface CPin {
    cpin: string;
    cpinDescription?: string;
}

const cpinDescription: FieldData[] = [
    { value: "READY", description: "MT is not pending for any password" },
    { value: "SIM PIN", description: "MT is waiting for (U)SIM PIN" },
    { value: "SIM PUK", description: "MT is waiting for (U)SIM PUK" },
    { value: "SIM PIN2", description: "MT is waiting for (U)SIM PIN2" },
    { value: "SIM PUK2", description: "MT is waiting for (U)SIM PUK2" },
    { value: "PH-NET PIN", description: "MT is waiting for network personalization password" },
    { value: "PH-NET PUK", description: "MT is waiting for network personalization unlocking password" },
    { value: "PH-NETSUB PIN", description: "MT is waiting for network subset personalization password" },
    { value: "PH-NETSUB PUK", description: "MT is waiting for network subset personalization unlocking password" },
    { value: "PH-SP PIN", description: "MT is waiting for service provider personalization password" },
    { value: "PH-SP PUK", description: "MT is waiting for service provider personalization unlocking password" },
    { value: "PH-CORP PIN", description: "MT is waiting for corporate personalization password" },
    { value: "PH-CORP PUK", description: "MT is waiting for corporate personalization unlocking password" },
];

export const cpin = (data: ResponseData): CPin => {
    return data.response.split('\n').map(line => line.trim()).filter(line => line.startsWith('+CPIN:')).map((line) => {
        return { cpin: line.split(':')[1].trim(), cpinDescription: cpinDescription.find((item) => item.value === line.split(':')[1].trim())?.description };
    })[0] as CPin;
};

// +CPIN: <code>

// SA Mode
// AT+CPIN?\n
// +CPIN: READY\n

// NSA Mode
// AT+CPIN?\n
// +CPIN: READY\n
