import { ResponseData } from "@/types/types";
import { qcapability }  from "@/at_responses/qgetcapability";
import { cgcontrdp }    from "@/at_responses/cgcontrdp";
import { quimslot }     from "@/at_responses/quimslot";
import { qcainfo }      from "@/at_responses/qcainfo";
import { cgdcont }      from "@/at_responses/cgdcont";
import { c5greg }       from "@/at_responses/c5greg";
import { qnwcfg }       from "@/at_responses/qnwcfg";
import { cgreg }        from "@/at_responses/cgreg";
import { qscan }        from "@/at_responses/qscan";
import { qsinr }        from "@/at_responses/qsinr";
import { qrsrp }        from "@/at_responses/qrsrp";
import { qrsrq }        from "@/at_responses/qrsrq";
import { qtemp }        from "@/at_responses/qtemp";
import { iccid }        from "@/at_responses/iccid";
import { cgsn }         from "@/at_responses/cgsn";
import { creg }         from "@/at_responses/creg";
import { cfun }         from "@/at_responses/cfun";
import { qeng }         from "@/at_responses/qeng";
import { qmap }         from "@/at_responses/qmap";
import { cimi }         from "@/at_responses/cimi";
import { cnum }         from "@/at_responses/cnum";
import { cops }         from "@/at_responses/cops";
import { cpin }         from "@/at_responses/cpin";
import { qgmr }         from "@/at_responses/qgmr";
import { cgmm }         from "@/at_responses/cgmm";
import { cgmi }         from "@/at_responses/cgmi";

const atResponses = {
  cgcontrdp,
  cgdcont,
  qnwcfg,
  qscan,
  qsinr,
  qrsrp,
  qrsrq,
  cgsn,
  cgreg,
  creg,
  c5greg,
  cfun,
  qeng,
  qcainfo,
  qmap,
  qtemp,
  quimslot,
  cimi,
  cnum,
  cops,
  cpin,
  iccid,
  qcapability,
  qgmr,
  cgmm,
  cgmi,
};

  const commandMap: Record<string, keyof typeof atResponses> = {
    "AT+CGCONTRDP": "cgcontrdp",
    "AT+CGDCONT": "cgdcont",
    "AT+QNWCFG": "qnwcfg",
    "AT+QSCAN": "qscan",
    "AT+QSINR": "qsinr",
    "AT+QRSRP": "qrsrp",
    "AT+QRSRQ": "qrsrq",
    "AT+CGREG": "cgreg",
    "AT+CREG": "creg",
    "AT+CGSN": "cgsn",
    "AT+C5GREG": "c5greg",
    "AT+CFUN": "cfun",
    "AT+QENG": "qeng",
    "AT+QCAINFO": "qcainfo",
    "AT+QMAP": "qmap",
    "AT+QTEMP": "qtemp",
    "AT+QUIMSLOT": "quimslot",
    "AT+CIMI": "cimi",
    "AT+CNUM": "cnum",
    "AT+COPS": "cops",
    "AT+CPIN": "cpin",
    "AT+ICCID": "iccid",
    "AT+QGETCAPABILITY": "qcapability",
    "AT+QGMR": "qgmr",
    "AT+CGMM": "cgmm",
    "AT+CGMI": "cgmi",
  };
// Utility function to map commands to parsers
const getParser = (command: string): ((data: ResponseData) => any) | null => {
  for (const [key, parserName] of Object.entries(commandMap)) {
    if (command.startsWith(key)) {
      return atResponses[parserName] || null;
    }
  }

  return null;
};

// Process a single set of responses
export const processSet = (set: ResponseData[]) => {
  const dataState: Record<string, any> = {};

  set.forEach((item) => {
    const { command, response, status } = item;

    if (status !== "success") {
      console.warn(`Command failed: ${command}`);
      return;
    }

    // console.log(`Processing command: ${command} and response ${response}`);

    try {
      const parser = getParser(command);
      if (parser) {
        const parsed = parser({ response } as ResponseData);
        // Split commands by `;`
        const parts = command.split(";");
        parts.forEach((part, index) => {
          // Remove `AT+` from the first command and just `+` from subsequent commands
          let [cmd, args] = part.split("=");
          if (index === 0) {
            cmd = cmd.replace(/^AT\+/, ""); // Remove `AT+` for the first command
          } else {
            cmd = cmd.replace(/^\+/, ""); // Remove only `+` for subsequent commands
          }
          cmd = cmd.replace(/\?/, "").toLowerCase(); // Strip `?` and force lowercase

          // Parse the argument if it exists and is non-numerical
          let argumentKeys: string[] = [];
          if (args) {
            argumentKeys = args
              .split(",") // Split arguments by `,`
              .filter((arg) => isNaN(Number(arg))) // Exclude numerical arguments
              .map((arg) => arg.replace(/"/g, "").toLowerCase()); // Remove `"` and force lowercase
          }

          // Initialize the command in the result if not already present
          if (!dataState[cmd]) {
            dataState[cmd] = argumentKeys.length > 0 ? {} : []; // Use an object for arguments, or an array for no arguments
          }

          // Add the arguments as key-value pairs or push to the array
          if (argumentKeys.length > 0) {
            argumentKeys.forEach((arg) => {
              dataState[cmd][arg] = { ...parsed }; // Replace `{ ...parsed }` with actual parsed data
            });
          } else if (Array.isArray(dataState[cmd])) {
            dataState[cmd] = { ...parsed }; // Replace `{ ...parsed }` with actual parsed data
          }
        });
      } else {
        console.log(`No parser available for command: ${command}`);
      }
    } catch (error) {
      // console.error(`Error processing command: ${command}`, error);
    }
  });
  console.log("dataState: ", dataState);
};

// Main function to process all sets
export const processAllSets = (data: ResponseData[]) => {
  processSet(data);
};


// AT+QNWCFG="nr5g_time_advance",1;+QNWCFG="nr5g_time_advance"
// AT+QNWCFG="lte_time_advance",1;+QNWCFG="lte_time_advance"
// AT+CGREG=2;+CGREG?
// AT+C5GREG=2;+C5GREG?
// AT+QMAP="WWAN"
// AT+QCAINFO=1;+QCAINFO;+QCAINFO=0
// AT+QENG="servingcell"
// AT+CFUN?
// AT+QNWPREFCFG="lte_band";+QNWPREFCFG="nsa_nr5g_band";+QNWPREFCFG="nr5g_band"