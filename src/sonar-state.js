"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.sonarStateFactory = exports.SonarState = void 0;
var sonar_1 = require("./sonar");
var audio_manager_1 = require("./audio-manager");
var pigpio_1 = require("pigpio");
var _a = require("child_process"), exec = _a.exec, spawn = _a.spawn;
var PIN_LED = 23;
var TRIGGER_DIST = 50;
var TRIGGER_END_DIST = TRIGGER_DIST * 2;
var SAMPLE_COUNT = 4;
var MIN_VOLUME = 30;
var MAX_VOLUME = 85;
var VOL_STEP = 5;
var VOL_WAIT = 150;
var SonarState;
(function (SonarState) {
    SonarState["OnTrigger"] = "OnTrigger";
    SonarState["OnTriggerEnd"] = "OnTriggerEnd";
    SonarState["OffTrigger"] = "OffTrigger";
    SonarState["OffTriggerEnd"] = "OffTriggerEnd";
})(SonarState = exports.SonarState || (exports.SonarState = {}));
var wait = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, VOL_WAIT);
            })];
    });
}); };
var fadeIn = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_1 = function (i) {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                    var vol = spawn("amixer", ["set", "PCM", i + "%"]);
                                    vol.on("close", function () {
                                        resolve();
                                    });
                                })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, wait()];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                i = MIN_VOLUME;
                _a.label = 1;
            case 1:
                if (!(i <= MAX_VOLUME)) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1(i)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i += VOL_STEP;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
var fadeOut = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_2, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_2 = function (i) {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                    var vol = spawn("amixer", ["set", "PCM", i + "%"]);
                                    vol.on("close", function () {
                                        resolve();
                                    });
                                })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, wait()];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                i = MAX_VOLUME;
                _a.label = 1;
            case 1:
                if (!(i >= MIN_VOLUME)) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_2(i)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i -= VOL_STEP;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
var sonarStateFactory = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sonar_2, audio_1, led_1, isLedOn_1, sonarState_1, toggleLed_1, median_1, filter_1, stateTick, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, sonar_1.sonarFactory()];
            case 1:
                sonar_2 = _a.sent();
                return [4 /*yield*/, audio_manager_1.audioPlayManagerFactory()];
            case 2:
                audio_1 = _a.sent();
                exec("amixer set PCM " + MIN_VOLUME + "%");
                led_1 = new pigpio_1.Gpio(PIN_LED, { mode: pigpio_1.Gpio.OUTPUT });
                isLedOn_1 = false;
                led_1.digitalWrite(0);
                sonarState_1 = SonarState.OnTrigger;
                toggleLed_1 = function () {
                    led_1.digitalWrite(isLedOn_1 ? 0 : 1);
                    isLedOn_1 = !isLedOn_1;
                };
                median_1 = function (arr) {
                    if (arr.length % 2 === 0) {
                        return arr[arr.length / 2];
                    }
                    else if (arr.length === 1) {
                        return arr[0];
                    }
                    else {
                        var lower = arr[Math.floor(arr.length / 2)];
                        var upper = arr[Math.ceil(arr.length / 2)];
                        return (lower + upper) / 2;
                    }
                };
                filter_1 = function (arr) {
                    arr.sort(function (a, b) { return a - b; });
                    return median_1(arr);
                };
                stateTick = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var samples, i, dist_1, dist, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                samples = [];
                                i = 0;
                                _b.label = 1;
                            case 1:
                                if (!(i < SAMPLE_COUNT)) return [3 /*break*/, 4];
                                return [4 /*yield*/, sonar_2.getDistance()];
                            case 2:
                                dist_1 = _b.sent();
                                if (dist_1 > 0) {
                                    samples.push(dist_1);
                                }
                                _b.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4:
                                if (samples.length === 0) {
                                    return [2 /*return*/];
                                }
                                dist = filter_1(samples);
                                _a = sonarState_1;
                                switch (_a) {
                                    case SonarState.OnTrigger: return [3 /*break*/, 5];
                                    case SonarState.OnTriggerEnd: return [3 /*break*/, 8];
                                    case SonarState.OffTrigger: return [3 /*break*/, 9];
                                    case SonarState.OffTriggerEnd: return [3 /*break*/, 12];
                                }
                                return [3 /*break*/, 13];
                            case 5:
                                if (!(dist < TRIGGER_DIST)) return [3 /*break*/, 7];
                                sonarState_1 = SonarState.OnTriggerEnd;
                                toggleLed_1();
                                audio_1.welcome();
                                return [4 /*yield*/, fadeIn()];
                            case 6:
                                _b.sent();
                                _b.label = 7;
                            case 7: return [3 /*break*/, 13];
                            case 8:
                                if (dist > TRIGGER_END_DIST) {
                                    sonarState_1 = SonarState.OffTrigger;
                                }
                                return [3 /*break*/, 13];
                            case 9:
                                if (!(dist < TRIGGER_DIST)) return [3 /*break*/, 11];
                                sonarState_1 = SonarState.OffTriggerEnd;
                                return [4 /*yield*/, fadeOut()];
                            case 10:
                                _b.sent();
                                toggleLed_1();
                                audio_1.bye();
                                _b.label = 11;
                            case 11: return [3 /*break*/, 13];
                            case 12:
                                if (dist > TRIGGER_END_DIST) {
                                    sonarState_1 = SonarState.OnTrigger;
                                }
                                return [3 /*break*/, 13];
                            case 13: return [2 /*return*/];
                        }
                    });
                }); };
                return [2 /*return*/, {
                        stateTick: stateTick,
                        getSonarState: function () {
                            return sonarState_1;
                        }
                    }];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [2 /*return*/, undefined];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sonarStateFactory = sonarStateFactory;
