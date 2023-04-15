import Spackle from './Spackle';
import stripe from 'stripe';
declare class Waiters {
    private spackle;
    constructor(spackle: Spackle);
    waitForCustomer(customerId: string, timeout?: number): Promise<import("./resources/Customer").Customer>;
    waitForSubscription(customerId: string, subscriptionId: string, timeout?: number, filters?: any): Promise<stripe.Subscription>;
    private matchesFilters;
}
export default Waiters;
