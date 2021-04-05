import { readFileSync, writeFileSync } from "fs";

interface IConfig {
  isStream: boolean;
  streamUrl: string;
  fileName: string;
  minVolume: number;
  maxVolume: number;
  volStep: number;
}

interface IConfigManager {
  isStream: () => boolean;
  setStreamUrl: (url: string) => void;
  getStreamUrl: () => string;
  setFileName: (name: string) => void;
  getFileName: () => string;
  setStream: (value: boolean) => void;
  setMinVolume: (vol: number) => void;
  getMinVolume: () => number;
  setMaxVolume: (vol: number) => void;
  getMaxVolume: () => number;
  setVolStep: (vol: number) => void;
  getVolStep: () => number;
}

const path = "./src/resources/config.json";

let parsed: IConfig;

const readConfig = () => {
  const raw = readFileSync(path).toString();
  parsed = JSON.parse(raw) as IConfig;
};

const saveConfig = () => {
  writeFileSync(path, JSON.stringify(parsed));
};

readConfig();

export const configManager: IConfigManager = {
  isStream: () => {
    return parsed.isStream;
  },
  setStreamUrl: (url: string) => {
    parsed.streamUrl = url;
    saveConfig();
  },
  getStreamUrl: () => {
    return parsed.streamUrl;
  },
  setFileName: (name: string) => {
    parsed.fileName = name;
    saveConfig();
  },
  getFileName: () => {
    return parsed.fileName;
  },
  setStream: (value: boolean) => {
    parsed.isStream = value;
    saveConfig();
  },
  setMinVolume: (vol: number) => {
    parsed.minVolume = vol;
    saveConfig();
  },
  getMinVolume: () => {
    return parsed.minVolume;
  },
  setMaxVolume: (vol: number) => {
    parsed.maxVolume = vol;
    saveConfig();
  },
  getMaxVolume: () => {
    return parsed.maxVolume;
  },
  setVolStep: (vol: number) => {
    parsed.volStep = vol;
    saveConfig();
  },
  getVolStep: () => {
    return parsed.volStep;
  },
};
