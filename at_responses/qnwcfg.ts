import { ResponseData } from "@/types/types";

export interface QNWCFGBASE {
    parameter: string;
}
export interface QNWCFGTA extends QNWCFGBASE {
    query_mode: number;
    time_advance?: number;
    secondary_advance?: number;
}
export interface QNWCFG3GPP extends QNWCFGBASE {
    rel1: string | number;
    rel2: string | number;
}

export const qnwcfg = (data: ResponseData): QNWCFGTA | QNWCFG3GPP => {
    return data.response.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('+QNWCFG:'))
        .map(line => {
            const [parameter, ...rest] = line.split(":")[1].split(",");
            if (parameter.trim().replace(/"/g, "") === "3gpp_rel") {
                const [rel1, rel2] = rest.map(item => item.trim().replace(/"/g, ""));
                return {
                    parameter: parameter.trim().replace(/"/g, ""),
                    rel1,
                    rel2,
                } as QNWCFG3GPP;
            }
            if (parameter.trim().replace(/"/g, "") === "lte_time_advance" || parameter.trim().replace(/"/g, "") === "nr5g_time_advance") {
                const [query_mode, time_advance, secondary_advance] = rest.map(item => item.trim().replace(/"/g, ""));
                return {
                    parameter: parameter.trim().replace(/"/g, ""),
                    query_mode: parseInt(query_mode, 10),
                    time_advance: parseInt(time_advance, 10),
                    secondary_advance: parseInt(secondary_advance, 10),
                } as QNWCFGTA;
            }
        }).filter((item): item is QNWCFGTA | QNWCFG3GPP => item !== null)[0]
};

// +QNWCFG: paramter_name,query_mode[,value1[,value2]]


// Actual Data
// AT+QNWCFG=\"lte_time_advance\",1;+QNWCFG=\"lte_time_advance\"\n
// +QNWCFG: \"lte_time_advance\",1,92\n

// AND

// AT+QNWCFG=\"nr5g_time_advance\",1;+QNWCFG=\"nr5g_time_advance\"\n
// +QNWCFG: \"nr5g_time_advance\",1,94208,39936\n

// AND

// AT+QNWCFG=\"3gpp_rel\"\n
// +QNWCFG: \"3gpp_rel\",R17,R17\n

