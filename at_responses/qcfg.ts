import { ResponseData } from "@/types/types";

export interface QCFG{
    parameter: string;
    value: string | number;
}

export const qcfg = (data: ResponseData): QCFG => {
    return data.response.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('+QCFG:'))
        .map(line => {
            const [parameter, value] = line.split(":")[1].split(",");
            if (parameter.trim().replace(/"/g, "") === "usbnet") {
                return {
                    parameter: parameter.trim().replace(/"/g, ""),
                    value,
                } as QCFG;
            }
        }).filter((item): item is QCFG => item !== null)[0]
};

// +QCFG: paramter_name,query_value


// Actual Data

// AT+QCFG=\"pcie\"\n
// +QCFG: \"pcie\",1\n

// AND

// AT+QCFG=\"usbnet\"\n
// +QCFG: \"usbnet\",1\n

