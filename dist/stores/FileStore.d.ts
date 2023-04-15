import Store from './Store';
declare class FileStore implements Store {
    private path;
    constructor(path: string);
    bootstrap(): Promise<void>;
    getCustomerData(key: string): Promise<any>;
    setCustomerData(key: string, value: any): Promise<void>;
}
export default FileStore;
