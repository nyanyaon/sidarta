"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const edgePaths = __importStar(require("edge-paths"));
const puppeteer = __importStar(require("puppeteer-core"));
const fs = __importStar(require("fs"));
class Auth {
    static save() {
        return __awaiter(this, void 0, void 0, function* () {
            Auth.browser = yield puppeteer.launch({
                executablePath: Auth.EDGE_PATH,
                headless: false
            });
            const page = yield Auth.browser.newPage();
            yield page.goto('https://aplikasi.atrbpn.go.id/login', {
                waitUntil: 'networkidle2',
            });
            yield page.type('#username', '199005172014021002');
            yield page.type('#inputPassword', '@PANDU170590');
            yield page.click('#kc-next');
            yield page.waitForNavigation({
                waitUntil: 'networkidle2',
                timeout: 9999999
            });
            const cookies = yield page.cookies();
            fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));
            console.log("cookie save");
        });
    }
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            Auth.browser = yield puppeteer.launch({
                executablePath: Auth.EDGE_PATH,
                headless: false
            });
            const page = yield Auth.browser.newPage();
            const cookiesStr = fs.readFileSync('./cookies.json').toString();
            const cookies = JSON.parse(cookiesStr);
            yield page.setCookie(...cookies);
            console.log("cookie load");
            yield page.goto('https://aplikasi.atrbpn.go.id/login', {
                waitUntil: 'networkidle2',
            });
        });
    }
}
exports.Auth = Auth;
Auth.EDGE_PATH = edgePaths.getEdgePath();
