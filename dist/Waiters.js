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
Object.defineProperty(exports, "__esModule", { value: true });
class Waiters {
    constructor(spackle) {
        this.spackle = spackle;
    }
    waitForCustomer(customerId, timeout = 15) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const end = start + timeout * 1000;
            while (Date.now() < end) {
                try {
                    return yield this.spackle.customers.retrieve(customerId);
                }
                catch (error) { }
                yield new Promise((resolve) => setTimeout(resolve, 1000));
            }
            throw new Error('spackle: timeout waiting for customer');
        });
    }
    waitForSubscription(customerId, subscriptionId, timeout = 15, filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const end = start + timeout * 1000;
            while (Date.now() < end) {
                try {
                    const customer = yield this.spackle.customers.retrieve(customerId);
                    for (const subscription of customer.subscriptions()) {
                        if (subscription.id === subscriptionId &&
                            this.matchesFilters(subscription, filters)) {
                            return subscription;
                        }
                    }
                }
                catch (error) { }
                yield new Promise((resolve) => setTimeout(resolve, 1000));
            }
            throw new Error('spackle: timeout waiting for customer');
        });
    }
    matchesFilters(subscription, filters) {
        for (const key in filters) {
            if (subscription[key] !== filters[key]) {
                return false;
            }
        }
        return true;
    }
}
exports.default = Waiters;
