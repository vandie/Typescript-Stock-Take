import Product from '../../Interfaces/Product';
import { listTransactionsBySku } from '../Transactions/list';
import Transaction, { TransactionType } from '../../Interfaces/Transaction';

/**
 * Calculate a change in stock
 * If I was using es6 Classes then this would be a good candidate to go
 * in the class. I feel like given the structure, not using es6 classes is cleaner
 */
export default async function recalculateStock(product: Product):Promise<Product> {
  const transactions = await listTransactionsBySku(product.sku);
  const stockChange = transactions.reduce((total: number, transaction: Transaction) => {
    let multiplier:number;
    switch (transaction.type) {
      case (TransactionType.order):
        multiplier = -1;
        break;
      case (TransactionType.refund):
        multiplier = 1;
        break;
      default:
        multiplier = 0;
        break;
    }

    return total + (transaction.qty * multiplier);
  }, 0);
  return Object.assign(
    product,
    { stock: product.stock + stockChange },
  );
}
