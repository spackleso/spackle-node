import Waiters from './Waiters';
import { CustomersResource } from './resources';
import { Store } from './stores';
declare class Spackle {
    apiKey: string;
    apiBase: string;
    store: Store | null;
    schemaVersion: number;
    customers: CustomersResource;
    waiters: Waiters;
    constructor(apiKey: string, store?: Store | null);
    bootstrap(): void;
    getStore(): Store;
}
export default Spackle;
