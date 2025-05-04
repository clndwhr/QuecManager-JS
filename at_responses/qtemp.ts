import { ResponseData } from "@/types/types";

export interface QTEMP {
    sensor: string;
    temp: number;
}

// reformat this to put like keys into array...?

export const qtemp = (data: ResponseData): QTEMP[] => {
    if (!data || !data.response) return [];
    return data.response
        .split("\n")
        .filter(line => line.startsWith("+QTEMP:"))
        .map(line => {
            const match = line.match(/\+QTEMP: "([^"]+)",\s*"([^"]+)"/);
            if (match) {
                return {
                    sensor: match[1],
                    temp: parseFloat(match[2]),
                };
            }
            return null;
        })
        .filter((item): item is QTEMP => item !== null);
};


// [+QTEMP: <sensor>,<temp>]


// SA MODE
// AT+QTEMP\n
// +QTEMP: \"sdr0\",\"34\"\n
// +QTEMP: \"mmw0\",\"-273\"\n
// +QTEMP: \"aoss-0\",\"37\"\n
// +QTEMP: \"cpuss-0\",\"41\"\n
// +QTEMP: \"cpuss-1\",\"41\"\n
// +QTEMP: \"cpuss-2\",\"41\"\n
// +QTEMP: \"cpuss-3\",\"41\"\n
// +QTEMP: \"ethphy-0\",\"39\"\n
// +QTEMP: \"mvmss-0\",\"38\"\n
// +QTEMP: \"mdmq6-0\",\"39\"\n
// +QTEMP: \"ctile\",\"37\"\n
// +QTEMP: \"mdmss-0\",\"38\"\n
// +QTEMP: \"mdmss-1\",\"38\"\n
// +QTEMP: \"mdmss-2\",\"38\"\n
// +QTEMP: \"sys-therm-1\",\"34\"\n
// +QTEMP: \"sys-therm-2\",\"-40\"\n
// +QTEMP: \"sys-therm-4\",\"35\"\n

// NSA MODE
// AT+QTEMP\n
// +QTEMP: \"sdr0\",\"35\"\n
// +QTEMP: \"mmw0\",\"-273\"\n
// +QTEMP: \"aoss-0\",\"37\"\n
// +QTEMP: \"cpuss-0\",\"41\"\n
// +QTEMP: \"cpuss-1\",\"41\"\n
// +QTEMP: \"cpuss-2\",\"41\"\n
// +QTEMP: \"cpuss-3\",\"41\"\n
// +QTEMP: \"ethphy-0\",\"40\"\n
// +QTEMP: \"mvmss-0\",\"38\"\n
// +QTEMP: \"mdmq6-0\",\"39\"\n
// +QTEMP: \"ctile\",\"38\"\n
// +QTEMP: \"mdmss-0\",\"38\"\n
// +QTEMP: \"mdmss-1\",\"38\"\n
// +QTEMP: \"mdmss-2\",\"38\"\n
// +QTEMP: \"sys-therm-1\",\"34\"\n
// +QTEMP: \"sys-therm-2\",\"-40\"\n
// +QTEMP: \"sys-therm-4\",\"36\"\n