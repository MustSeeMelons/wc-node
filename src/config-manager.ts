import { readFileSync, writeFileSync } from "fs";
import path from "path";

interface IConfig {
  isStream: boolean;
  streamUrl: string;
  fileName: string;
  minVolume: number;
  maxVolume: number;
  volStep: number;
  isActive: boolean;
  isSonarDisabled: boolean;
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
  isActive: () => boolean;
  setActive: (value: boolean) => void;
  isSonarDisabled: () => boolean;
  setSonarDisabled: (value: boolean) => void;
}

const configPath = path.join(__dirname, "/resources/config.json");

let parsed: IConfig;

const readConfig = () => {
  const raw = readFileSync(configPath).toString();
  parsed = JSON.parse(raw) as IConfig;
  // False on startup
  parsed.isActive = false;
  saveConfig();
};

const saveConfig = () => {
  writeFileSync(configPath, JSON.stringify(parsed));
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
  isActive: () => {
    return parsed.isActive;
  },
  setActive: (value: boolean) => {
    parsed.isActive = value;
    saveConfig();
  },
  isSonarDisabled: () => {
    return parsed.isSonarDisabled;
  },
  setSonarDisabled: (value: boolean) => {
    parsed.isSonarDisabled = value;
    saveConfig();
  },
};
