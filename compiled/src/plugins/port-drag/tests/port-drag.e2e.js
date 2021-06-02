"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var test_utils_1 = require("../../../utils/test-utils");
describe("Dragging from port", function () {
    var server;
    var ports = {};
    beforeAll(function (done) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_utils_1.serveCompiled()];
                    case 1:
                        server = _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        });
    });
    afterAll(function () {
        server.close();
    });
    function locatePorts() {
        var _this = this;
        var ports = {};
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var portQuery;
            return __generator(this, function (_a) {
                portQuery = protractor_1.$$(".port");
                portQuery.each(function (finder) { return __awaiter(_this, void 0, void 0, function () {
                    var connectionID, _a, side, node, port;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, finder.getAttribute("data-connection-id")];
                            case 1:
                                connectionID = _b.sent();
                                _a = __read(connectionID.split("/"), 3), side = _a[0], node = _a[1], port = _a[2];
                                ports[node] = ports[node] || {};
                                ports[node][side] = ports[node][side] || {};
                                ports[node][side][port] = finder;
                                return [2 /*return*/];
                        }
                    });
                }); }).then(function () {
                    resolve(ports);
                }).catch(function (err) {
                    reject(err);
                });
                return [2 /*return*/];
            });
        }); });
    }
    beforeEach(function (done) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, locatePorts()];
                    case 1:
                        ports = _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        });
    });
    it("initially marks suggested ports", function (done) {
        return __awaiter(this, void 0, void 0, function () {
            var actions, originPort, inputs, suggestedPorts, nonSuggestedPorts, suggestedPorts_1, suggestedPorts_1_1, sp, isSuggestion, labelOpacity, e_1_1, nonSuggestedPorts_1, nonSuggestedPorts_1_1, sp, isSuggestion, labelOpacity, e_2_1, e_1, _a, e_2, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        actions = protractor_1.browser.actions();
                        return [4 /*yield*/, protractor_1.element(protractor_1.by.css("[data-id=first] [data-port-id=first_out] .port-handle"))];
                    case 1:
                        originPort = _c.sent();
                        return [4 /*yield*/, actions.mouseDown(originPort)
                                .mouseMove({ x: 0, y: 30 })
                                .mouseMove({ x: 0, y: 30 })
                                .mouseMove({ x: 0, y: 30 })
                                .perform()];
                    case 2:
                        _c.sent();
                        inputs = ports.second.in;
                        suggestedPorts = [inputs.nini, inputs.alpha, inputs.agode];
                        nonSuggestedPorts = [inputs.upato, inputs.egeba];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 9, 10, 11]);
                        suggestedPorts_1 = __values(suggestedPorts), suggestedPorts_1_1 = suggestedPorts_1.next();
                        _c.label = 4;
                    case 4:
                        if (!!suggestedPorts_1_1.done) return [3 /*break*/, 8];
                        sp = suggestedPorts_1_1.value;
                        return [4 /*yield*/, test_utils_1.hasClass(sp, "__port-drag-suggestion")];
                    case 5:
                        isSuggestion = _c.sent();
                        return [4 /*yield*/, sp.$(".label").getCssValue("opacity")];
                    case 6:
                        labelOpacity = _c.sent();
                        expect(isSuggestion).toBe(true, "Expected to have a drag suggestion class, but it doesn't");
                        expect(Number(labelOpacity)).toBeCloseTo(1, 0.1, "Expected port label to be visible, but it is not");
                        _c.label = 7;
                    case 7:
                        suggestedPorts_1_1 = suggestedPorts_1.next();
                        return [3 /*break*/, 4];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (suggestedPorts_1_1 && !suggestedPorts_1_1.done && (_a = suggestedPorts_1.return)) _a.call(suggestedPorts_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        _c.trys.push([11, 17, 18, 19]);
                        nonSuggestedPorts_1 = __values(nonSuggestedPorts), nonSuggestedPorts_1_1 = nonSuggestedPorts_1.next();
                        _c.label = 12;
                    case 12:
                        if (!!nonSuggestedPorts_1_1.done) return [3 /*break*/, 16];
                        sp = nonSuggestedPorts_1_1.value;
                        return [4 /*yield*/, test_utils_1.hasClass(sp, "__port-drag-suggestion")];
                    case 13:
                        isSuggestion = _c.sent();
                        return [4 /*yield*/, sp.$(".label").getCssValue("opacity")];
                    case 14:
                        labelOpacity = _c.sent();
                        expect(isSuggestion).toBe(false, "Expected to not have a drag suggestion class, but it does");
                        expect(Number(labelOpacity)).toBeCloseTo(0, 0.1, "Expected port label to be invisible, but it is not");
                        _c.label = 15;
                    case 15:
                        nonSuggestedPorts_1_1 = nonSuggestedPorts_1.next();
                        return [3 /*break*/, 12];
                    case 16: return [3 /*break*/, 19];
                    case 17:
                        e_2_1 = _c.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 19];
                    case 18:
                        try {
                            if (nonSuggestedPorts_1_1 && !nonSuggestedPorts_1_1.done && (_b = nonSuggestedPorts_1.return)) _b.call(nonSuggestedPorts_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 19:
                        done();
                        return [2 /*return*/];
                }
            });
        });
    });
    it("shows labels on all input ports and not output ports when dragging close", function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var actions, originPort, _a, inputs, outputs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        actions = protractor_1.browser.actions();
                        return [4 /*yield*/, protractor_1.element(protractor_1.by.css("[data-id=first] [data-port-id=first_out] .port-handle"))];
                    case 1:
                        originPort = _b.sent();
                        return [4 /*yield*/, actions.mouseDown(originPort)
                                .mouseMove({ x: 15, y: -20 })
                                .mouseMove({ x: 15, y: -20 })
                                .mouseMove({ x: 15, y: -20 })
                                .perform()];
                    case 2:
                        _b.sent();
                        _a = ports.second, inputs = _a.in, outputs = _a.out;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b, _i, portID, labelOpacity, _c, _d, _e, portID, labelOpacity, ex_1;
                                    return __generator(this, function (_f) {
                                        switch (_f.label) {
                                            case 0:
                                                _f.trys.push([0, 9, , 10]);
                                                _a = [];
                                                for (_b in inputs)
                                                    _a.push(_b);
                                                _i = 0;
                                                _f.label = 1;
                                            case 1:
                                                if (!(_i < _a.length)) return [3 /*break*/, 4];
                                                portID = _a[_i];
                                                return [4 /*yield*/, inputs[portID].$(".label").getCssValue("opacity")];
                                            case 2:
                                                labelOpacity = _f.sent();
                                                expect(Number(labelOpacity)).toBeGreaterThan(0.5, "Expected port label to be visible, but it is not");
                                                _f.label = 3;
                                            case 3:
                                                _i++;
                                                return [3 /*break*/, 1];
                                            case 4:
                                                _c = [];
                                                for (_d in outputs)
                                                    _c.push(_d);
                                                _e = 0;
                                                _f.label = 5;
                                            case 5:
                                                if (!(_e < _c.length)) return [3 /*break*/, 8];
                                                portID = _c[_e];
                                                return [4 /*yield*/, outputs[portID].$(".label").getCssValue("opacity")];
                                            case 6:
                                                labelOpacity = _f.sent();
                                                expect(Number(labelOpacity)).toBeLessThan(0.5, "Expected port label to be invisible, but it is");
                                                _f.label = 7;
                                            case 7:
                                                _e++;
                                                return [3 /*break*/, 5];
                                            case 8:
                                                resolve();
                                                return [3 /*break*/, 10];
                                            case 9:
                                                ex_1 = _f.sent();
                                                reject(ex_1);
                                                return [3 /*break*/, 10];
                                            case 10: return [2 /*return*/];
                                        }
                                    });
                                }); }, 500);
                            })];
                    case 3: 
                    /**
                     * We need to delay checks because labels fade in and out, so give them some time to appear or disappear
                     */
                    return [2 /*return*/, _b.sent()];
                }
            });
        });
    });
    xit("shows edge information when hovering over newly created edges");
});
//# sourceMappingURL=port-drag.e2e.js.map