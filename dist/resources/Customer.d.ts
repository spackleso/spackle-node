import Spackle from '../Spackle';
import stripe from 'stripe';
export type Feature = {
    id: number;
    name: string;
    key: string;
    type: 0 | 1;
    value_flag: boolean;
    value_limit: number;
};
export type CustomerData = {
    version: number;
    features: Feature[];
    subscriptions: stripe.Subscription[];
};
export declare class Customer {
    data: CustomerData;
    customerId: string;
    constructor(customerId: string, data: CustomerData);
    enabled(key: string): boolean | undefined;
    limit(key: string): number | undefined;
    subscriptions(): stripe.Subscription[];
}
export declare class CustomersResource {
    private spackle;
    constructor(spackle: Spackle);
    retrieve(customerId: string): Promise<Customer>;
}
