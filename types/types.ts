// types.ts

export interface SimCardData {
  slot: string;
  state: "Inserted" | "Not Inserted";
  provider: string;
  phoneNumber: string;
  imsi: string;
  iccid: string;
  imei: string;
}

export interface ConnectionData {
  apn: string;
  operatorState:
    | "Registered"
    | "Searching"
    | "Denied"
    | "Unknown"
    | "Roaming"
    | "Not Registered";
  functionalityState: "Enabled" | "Disabled";
  networkType: "NR5G-NSA" | "LTE" | "NR5G-SA" | "No Signal";
  modemTemperature: string;
  accessTechnology: string;
}

export interface DataTransmissionData {
  carrierAggregation: "Multi" | "Inactive";
  bandwidth?: string| string[];
  connectedBands: string;
  signalStrength?: string;
  mimoLayers: string;
}

export interface CellularInfoData {
  cellId?: string;
  trackingAreaCode?: string;
  physicalCellId?: string;
  cellIdRaw: string, 
  trackingAreaCodeRaw: string,
  earfcn?: string;
  mcc?: string;
  mnc?: string;
  signalQuality?: string;
}

export interface CurrentBandsData {
  id?: number[],
  bandNumber?: string[];
  earfcn?: string[];
  bandwidth?: string[];
  pci?: string[];
  rsrp?: string[];
  rsrq?: string[];
  sinr?: string[];
}

export interface NetworkAddressingData {
  publicIPv4: string;
  cellularIPv4: string;
  cellularIPv6: string;
  carrierPrimaryDNS: string;
  carrierSecondaryDNS: string;
  rawCarrierPrimaryDNS: string;
  rawCarrierSecondaryDNS: string;
}

export interface timeAdvanceData {
  lteTimeAdvance: string;
  nrTimeAdvance: string;
}

export interface HomeData {
  simCard: SimCardData;
  connection: ConnectionData;
  dataTransmission: DataTransmissionData;
  cellularInfo: CellularInfoData;
  currentBands: CurrentBandsData;
  networkAddressing: NetworkAddressingData;
  timeAdvance: timeAdvanceData;
}

export interface Band {
  id: number;
  bandNumber: string;
  earfcn: string;
  bandwidth: string;
  pci: string;
  rsrp: string;
  rsrq: string;
  sinr: string;
}

export interface CellSettingsData {
  APNProfiles?: string[];
  apnPDPType?: string;
  preferredNetworkType?: string;
  nr5gMode?: string;
  simSlot?: string;
  cfunState?: string;
  autoSelState?: string;
  selectedMbnProfile?: string; 
  mbnProfilesList: string[];
  dataProfileIndex: string;
  lteAMBR: string[];
  nr5gAMBR: string[];
}

export interface AboutData {
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  lteCategory?: string;
  phoneNum?: string;
  imsi?: string;
  iccid?: string;
  imei?: string;
  currentDeviceIP?: string;
  lanGateway?: string;
  wwanIPv4?: string;
  wwanIPv6?: string;
  deviceUptime?: string;
  LTE3GppRel?: string;
  NR3GppRel?: string;
}

export interface DiagnosticsData {
  netRegistration?: string;
  simState?: string;
  manualAPN?: string;
  wanIP?: string;
  cellSignal?: string;
  modemTemp?: string;
  netReject?: string;
}

// You might also want to define some utility types for the bandwidth maps and access tech map

export type BandwidthMap = {
  [key: string]: string;
};

export type AccessTechMap = {
  [key: string]: string;
};

const BANDWIDTH_MAP: BandwidthMap = {
  "0": "1.4 MHz",
  "1": "3 MHz",
  "2": "5 MHz",
  "3": "10 MHz",
  "4": "15 MHz",
  "5": "20 MHz",
  "6": "40 MHz",
  "7": "80 MHz",
  "8": "100 MHz",
  "9": "200 MHz",
};

const NR_BANDWIDTH_MAP: BandwidthMap = {
  "0": "5 MHz",
  "1": "10 MHz",
  "2": "15 MHz",
  "3": "20 MHz",
  "4": "25 MHz",
  "5": "30 MHz",
  "6": "40 MHz",
  "7": "50 MHz",
  "8": "60 MHz",
  "9": "80 MHz",
  "10": "100 MHz",
  "11": "200 MHz",
};

const ACCESS_TECH_MAP: AccessTechMap = {
    "2": "UTRAN",
    "4": "HSDPA",
    "5": "HSUPA",
    "6": "HSDPA & HSUPA",
    "7": "E-UTRAN",
    "10": "E-UTRAN - 5GCN",
    "11": "NR - 5GCN",
    "12": "NG-RAN",
    "13": "E-UTRAN-NR Dual",
  };

// If you need to use these types with the existing constants, you can do:
// const BANDWIDTH_MAP: BandwidthMap = { ... };
// const NR_BANDWIDTH_MAP: BandwidthMap = { ... };
// const ACCESS_TECH_MAP: AccessTechMap = { ... };

export interface APNProfile {
  iccid: string;
  apn: string;
  pdpType: string;
}

export interface ServiceStatus {
  status: "running" | "stopped";
  enabled: boolean;
  script: "present" | "missing";
  initScript: "present" | "missing";
}

export interface APNProfileResponse {
  status: "active" | "inactive" | "error";
  message?: string;
  service?: ServiceStatus;
  profiles: {
    profile1?: APNProfile;
    profile2?: APNProfile;
  };
  lastActivity?: string;
}

export const LTE_RB_BANDWIDTH_MAP: BandwidthMap = {
  "6": "1.4 MHz",
  "15": "3 MHz",
  "25": "5 MHz",
  "50": "10 MHz",
  "75": "15 MHz",
  "100": "20 MHz",
  "-" : "-" 
};

