"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemoryStore {
    constructor() {
        this.store = {};
    }
    bootstrap() {
        return Promise.resolve();
    }
    getCustomerData(key) {
        if (this.store[key]) {
            return Promise.resolve(this.store[key]);
        }
        return Promise.reject(new Error('spackle: customer not found'));
    }
    setCustomerData(key, value) {
        this.store[key] = value;
        return Promise.resolve();
    }
}
exports.default = MemoryStore;
