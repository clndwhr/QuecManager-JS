import { ResponseData } from "@/types/types";

export interface CGREG {
    n: number;
    stat: number;
    lac?: string;
    ci?: string;
    act?: number;
    rac?: string;
}

export const cgreg = (data: ResponseData): CGREG => {
    return data.response.split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('+CGREG:'))
    .map((line) => {
        const match = line.match(/\+CGREG: (\d+),(\d+)(?:,([0-9A-Fa-f]+))?(?:,([0-9A-Fa-f]+))?(?:,(\d+))?(?:,([0-9A-Fa-f]+))?/);
        if (match) {
            return {
                n: parseInt(match[1], 10) || 0,
                stat: parseInt(match[2], 10) || 0,
                lac: match[3],
                ci: match[4],
                act: match[5] ? parseInt(match[5], 10) : null,
                rac: match[6],
            } as CGREG;
        }
    }).filter((item): item is CGREG => item !== null)[0];
};

// +CGREG: <n>,<stat>[,[<lac>],[<ci>],[<AcT>],[<rac>]]

// Parameter
// AT+CGREG PS Network Registration Status
// Test Command
// AT+CGREG=?
// Response
// +CGREG: (list of supported <n>s)
// OK
// Read Command
// AT+CGREG?
// Response
// +CGREG: <n>,<stat>[,[<lac>],[<ci>],[<AcT>],[<rac>]]
// OK
// Write Command
// AT+CGREG=[<n>]
// Response
// OK
// Or
// ERROR
// Maximum Response Time 300 ms
// Characteristics -
// Reference
// 3GPP TS 27.007
// <n> Integer type.
// 0 Disable network registration URC
// 1 Enable network registration URC +CGREG:<stat>
// 2 Enable network registration and location information URC
// +CGREG: <stat>[,[<lac>],[<ci>],[<AcT>],[<rac>]]
// <stat> Integer type. GPRS registration status.
// 0 Not registered, MT is not currently searching an operator to register to. The UE isFF
// in GMM state GMM-NULL or GMM-DEREGISTERED-INITIATED. The GPRS
// service is disabled; the UE is allowed to attach for GPRS if requested by the user.
// 1 Registered, home network. The UE is in GMM state GMM-REGISTERED or
// GMM-ROUTING-AREA-UPDATING-INITIATED INITIATED on the home PLMN.
// 2 Not registered, but MT is currently trying to attach or searching an operator to
// register to. The UE is in GMM state GMM-DEREGISTERED or
// GMM-REGISTERED-INITIATED. The GPRS service is enabled, but an allowable
// PLMN is currently not available. The UE will start a GPRS attach as soon as an
// allowable PLMN is available.
// 3 Registration denied. The UE is in GMM state GMM-NULL. The GPRS service is
// disabled; and the UE is not allowed to attach for GPRS if requested by the user.
// 4 Unknown
// 5 Registered, roaming
// <lac> String type. Two-byte location area code in hexadecimal format (e.g., "00C3" equals 195 in
// decimal).
// <ci> String type. Four-byte (UMTS/LTE) cell ID in hexadecimal format.
// <AcT> Access technology selected.
// 2 UTRAN
// 4 UTRAN W/HSDPA
// 5 UTRAN W/HSUPA
// 6 UTRAN W/HSDPA and HSUPA
// <rac> String type. One-byte routing area code in hexadecimal format.

// Actual Data
// AT+CGREG=2;+CGREG?\n
// +CGREG: 2,0\n
