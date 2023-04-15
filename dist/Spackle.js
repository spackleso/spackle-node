"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Waiters_1 = __importDefault(require("./Waiters"));
const resources_1 = require("./resources");
const stores_1 = require("./stores");
class Spackle {
    constructor(apiKey, store = null) {
        this.apiBase = 'https://api.spackle.so/v1';
        this.store = null;
        this.schemaVersion = 1;
        this.apiKey = apiKey;
        this.customers = new resources_1.CustomersResource(this);
        this.waiters = new Waiters_1.default(this);
        this.store = store;
    }
    bootstrap() {
        if (!this.store) {
            this.store = new stores_1.DynamoDBStore(this);
            this.store.bootstrap();
        }
    }
    getStore() {
        if (!this.store) {
            this.store = new stores_1.DynamoDBStore(this);
        }
        return this.store;
    }
}
exports.default = Spackle;
