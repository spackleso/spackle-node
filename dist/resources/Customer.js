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
exports.CustomersResource = exports.Customer = void 0;
class Customer {
    constructor(customerId, data) {
        this.customerId = customerId;
        this.data = data;
    }
    enabled(key) {
        for (const feature of this.data.features) {
            if (feature.key === key) {
                return feature.value_flag;
            }
        }
    }
    limit(key) {
        for (const feature of this.data.features) {
            if (feature.key === key) {
                if (feature.value_limit === null) {
                    return Infinity;
                }
                return feature.value_limit;
            }
        }
    }
    subscriptions() {
        return this.data.subscriptions;
    }
}
exports.Customer = Customer;
class CustomersResource {
    constructor(spackle) {
        this.spackle = spackle;
    }
    retrieve(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.spackle
                .getStore()
                .getCustomerData(customerId);
            if (data) {
                return new Customer(customerId, data);
            }
            throw new Error('spackle: customer not found');
        });
    }
}
exports.CustomersResource = CustomersResource;
