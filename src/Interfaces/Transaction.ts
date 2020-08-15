/**
 * An enum to of allowed transaction types
 */
export enum TransactionType {
  order = 'order',
  refund = 'refund'
}

/**
 * The basic interface for a transaction
 */
export default interface Transaction {
  sku: String,
  qty: number,
  type: TransactionType
}
