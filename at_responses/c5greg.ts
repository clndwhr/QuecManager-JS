import { ResponseData } from "@/types/types";

export interface C5GREG {
    n: number;
    stat: number;
    tac?: string;
    ci?: string;
    act?: number;
    allowedNSSAILength?: number;
    allowedNSSAI?: string[];
}

export const c5greg = (data: ResponseData): C5GREG => {
    return data.response.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('+C5GREG:'))
        .map((line) => {
            const match = line.match(/\+C5GREG:\s*(\d+),(\d+)(?:,([^,]+))?(?:,([^,]+))?(?:,(\d+))?(?:,(\d+))?(?:,(.+))?/);
            if (match) {
                return {
                    n: parseInt(match[1], 10),
                    stat: parseInt(match[2], 10),
                    tac: match[3].replace(/"/g, ''),
                    ci: match[4].replace(/"/g, ''),
                    act: match[5] ? parseInt(match[5], 10) : undefined,
                    allowedNSSAILength: match[6] ? parseInt(match[6], 10) : undefined,
                    allowedNSSAI: match[7] ? match[7].split(':').map(x=>x.replace(/"/g, '')) : undefined,
                } as C5GREG;
            }
            return null;
        })
        .filter((item): item is C5GREG => item !== null)[0];
};

// +C5GREG: <n>,<stat>[,[<tac>],[<ci>],[<AcT>],[<Allowed_NSSAI_length>],[<Allowed_NSSAI>]]

// Parameters:
// <n> Integer type.
// 0 Disable network registration URC
// 1 Enable network registration URC +C5GREG:<stat>
// 2 Enable network registration and location information URC
// +C5GREG: <stat>[,[<tac>],[<ci>],[<AcT>],[<Allowed_NSSAI_length>],[<Allowed
// _NSSAI>]]
// <stat> Integer type. NR registration status.
// 0 Not registered. MT is not currently searching an operator to register to.
// 1 Registered. Home network
// 2 Not registered. MT is currently trying to attach or searching an operator to register to
// 3 Registration denied
// 4 Unknown
// 5 Registered. Roaming
// 8 Registered for emergency services only
// <tac> String type. Three-byte tracking area code in hexadecimal format.
// <ci> String type. Five-byte (NR) cell ID in hexadecimal format.
// <AcT> Integer type. Access technology selected.
// 10 E-UTRAN connected to a 5GCN
// 11 NR connected to a 5GCN
// <Allowed_NSSAI_length> Integer type. Indicate the number of octets of the <Allowed_NSSAI>
// information element.
// <Allowed_NSSAI> String type in hexadecimal format. Dependent of the form, the string can
// be separated by dot(s), semicolon(s) and colon(s). This parameter
// indicates the list of allowed S-NSSAIs received from the network. The
// <Allowed_NSSAI> is coded as a list of <S-NSSAI>s separated by
// colons. See <S-NSSAI> in 3GPP 27.007 subclause 10.1.1. This
// parameter shall not be subject to conventional character conversion as
// per AT+CSCS.
// <S-NSSAI> String type in hexadecimal character format. Depending on the form,
// the string can be separated by dot(s) and semicolon(s). This parameter
// is associated with the PDU session for identifying a network slice in 5GS,
// see 3GPP TS 23.501 and 3GPP TS 24.501. For the format and the
// encoding of S-NSSAI, see also 3GPP TS 23.003. This parameter shall
// not be subject to conventional character conversion as per AT+CSCS.
// The parameter has one of the following forms:
// sst Only slice/service type (SST) is present.
// sst;mapped_sst SST and mapped configured SST are present.
// sst.sd SST and slice differentiator (SD) are present.
// sst.sd;mapped_sst SST, SD and mapped configured SST are present
// sst.sd;mapped_sst.mapped_sd SST, SD, mapped configured SST
// and mapped configured SD are
// present.


// SA Mode
// AT+C5GREG=2;+C5GREG?\n
// +C5GREG: 2,0\n
