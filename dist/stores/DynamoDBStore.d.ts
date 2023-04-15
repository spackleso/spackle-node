import Spackle from '../Spackle';
import Store from './Store';
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
