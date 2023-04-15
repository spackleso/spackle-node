import Store from './Store';
declare class MemoryStore implements Store {
    private store;
    bootstrap(): Promise<void>;
    getCustomerData(key: string): Promise<any>;
    setCustomerData(key: string, value: any): Promise<void>;
}
export default MemoryStore;
