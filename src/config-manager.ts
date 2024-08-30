import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

interface IStreamConfig {
  id: string;
  name: string;
  url: string;
}

interface IConfig {
  activeStreamId: string;
  streams: IStreamConfig[];
  minVolume: number;
  maxVolume: number;
  volStep: number;
  isActive: boolean;
  isSonarDisabled: boolean;
  ledBrightness: number;
  isLedIgnore: boolean;
}

interface IConfigManager {
  setActiveStreamId: (id: string) => void;
  getActiveStreamId: () => string;
  addStreamUrl: (name: string, url: string) => void;
  removeStreamUrl: (id: string) => void;
  getStreamUrls: () => IStreamConfig[];
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
  getLedBrightness: () => number;
  setLedBrightness: (value: number) => void;
  setLedIgnore: (value: boolean) => void;
  getLedIgnore: () => boolean;
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
  setActiveStreamId: (id: string) => {
    parsed.activeStreamId = id;
    saveConfig();
  },
  getActiveStreamId: () => {
    return parsed.activeStreamId;
  },
  addStreamUrl: (name: string, url: string) => {
    const id = uuidv4();
    parsed.streams.push({
      id,
      name,
      url,
    });
    saveConfig();
  },
  removeStreamUrl: (id: string) => {
    parsed.streams = parsed.streams.filter((s) => s.id !== id);
    saveConfig();
  },
  getStreamUrls: () => {
    return parsed.streams;
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
  getLedBrightness: () => {
    return parsed.ledBrightness;
  },
  setLedBrightness: (value: number) => {
    parsed.ledBrightness = value;
    saveConfig();
  },
  setLedIgnore: (value: boolean) => {
    parsed.isLedIgnore = value;
    saveConfig();
  },
  getLedIgnore: () => {
    return parsed.isLedIgnore;
  },
};
