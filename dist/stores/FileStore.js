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
const fs = __importStar(require("fs/promises"));
class FileStore {
    constructor(path) {
        this.path = path;
    }
    bootstrap() {
        return Promise.resolve();
    }
    getCustomerData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            try {
                const content = yield fs.readFile(this.path, { encoding: 'utf8' });
                data = JSON.parse(content);
            }
            catch (error) {
                data = {};
            }
            if (data[key]) {
                return data[key];
            }
            return Promise.reject(new Error('spackle: customer not found'));
        });
    }
    setCustomerData(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            try {
                const content = yield fs.readFile(this.path, { encoding: 'utf8' });
                data = JSON.parse(content);
            }
            catch (error) {
                console.error(error);
                data = {};
            }
            data[key] = value;
            return fs.writeFile(this.path, JSON.stringify(data), { encoding: 'utf8' });
        });
    }
}
exports.default = FileStore;
