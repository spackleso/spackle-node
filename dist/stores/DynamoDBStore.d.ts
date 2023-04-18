import Spackle from '../Spackle';
import Store from './Store';
export type SpackleSession = {
    account_id: string;
    adapter: {
        name: string;
        identity_id: string;
        role_arn: string;
        table_name: string;
        token: string;
        region: string;
    };
};
declare class DynamoDBStore implements Store {
    private spackle;
    private session;
    private client;
    constructor(spackle: Spackle);
    bootstrap(): Promise<void>;
    getCustomerData(customerId: string): Promise<any>;
    setCustomerData(customerId: string, data: any): Promise<void>;
    private customerKey;
    private fetchStateFromApi;
}
export default DynamoDBStore;
