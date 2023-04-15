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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const client_sts_1 = require("@aws-sdk/client-sts");
const property_provider_1 = require("@aws-sdk/property-provider");
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto_1 = __importDefault(require("crypto"));
class DynamoDBStore {
    constructor(spackle) {
        this.session = null;
        this.client = null;
        this.spackle = spackle;
    }
    bootstrap() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.session) {
                this.session = yield createSession(this.spackle);
            }
            if (!this.client) {
                this.client = new client_dynamodb_1.DynamoDBClient({
                    region: this.session.adapter.region,
                    credentials: fromSpackleCredentials(this.spackle, this.session, (s) => (this.session = s)),
                });
            }
        });
    }
    getCustomerData(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bootstrap();
            if (!this.session || !this.client) {
                throw new Error('spackle: session or client not initialized');
            }
            const item = yield this.client.send(new client_dynamodb_1.GetItemCommand({
                TableName: this.session.adapter.table_name,
                Key: {
                    AccountId: {
                        S: this.session.adapter.identity_id,
                    },
                    CustomerId: {
                        S: this.customerKey(customerId),
                    },
                },
            }));
            if (item.Item && item.Item.State && item.Item.State.S) {
                return JSON.parse(item.Item.State.S);
            }
            return yield this.fetchStateFromApi(customerId);
        });
    }
    setCustomerData(customerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('setCustomerData() is not supported on DynamoDBStore');
        });
    }
    customerKey(customerId) {
        return `${customerId}:${this.spackle.schemaVersion}`;
    }
    fetchStateFromApi(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn('spackle: state not found in DynamoDB, fetching from API...');
            const url = `${this.spackle.apiBase}/customers/${customerId}/state`;
            const response = yield (0, node_fetch_1.default)(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.spackle.apiKey}`,
                },
            });
            if (!response.ok) {
                throw new Error(`spackle: customer not found status: (${response.status})`);
            }
            return yield response.json();
        });
    }
}
function createSession(spackle) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${spackle.apiBase}/sessions`;
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${spackle.apiKey}`,
            },
        });
        return yield response.json();
    });
}
const fromSpackleCredentials = (spackle, session, setSession) => {
    function spackleCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!session) {
                session = yield createSession(spackle);
                setSession(session);
            }
            const sts = new client_sts_1.STSClient({
                region: session.adapter.region,
            });
            const { Credentials } = yield sts.send(new client_sts_1.AssumeRoleWithWebIdentityCommand({
                RoleArn: session.adapter.role_arn,
                RoleSessionName: crypto_1.default.randomBytes(16).toString('hex'),
                WebIdentityToken: session.adapter.token,
            }));
            if (!Credentials ||
                !Credentials.AccessKeyId ||
                !Credentials.SecretAccessKey) {
                throw new property_provider_1.CredentialsProviderError('Credentials not found');
            }
            return {
                accessKeyId: Credentials.AccessKeyId,
                secretAccessKey: Credentials.SecretAccessKey,
                sessionToken: Credentials.SessionToken,
                expiration: Credentials.Expiration,
            };
        });
    }
    return spackleCredentials;
};
exports.default = DynamoDBStore;
