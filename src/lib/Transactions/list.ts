import fs from 'fs';
import Path from 'path';
import util from 'util';
import Transaction from '../../Interfaces/Transaction';

export const asyncReadFile = util.promisify(fs.readFile);

/**
 * The path to the transactions file
 */
const transactionsFilePath = Path.join(__dirname, '../../../data/transactions.json');

/**
 * Get all transactions
 */
export default async function listTransactions():Promise<Array<Transaction>> {
  // I could require this json file but I figure that reading the file
  // is a better bet, as this is in theory meant to be a simulation of accessing
  // a database
  try {
    console.log(`Fetching Transactions from "${transactionsFilePath}"`);
    const transactionsText = await asyncReadFile(transactionsFilePath, 'utf8');
    const transactions = JSON.parse(transactionsText);
    console.log(`Fetched ${transactions.length} Transactions`);
    return transactions;
  } catch (e) {
    throw new Error(`Failed to fetch transactions with reason: ${e.message}`);
  }
}

/**
 * Get all transactions relating to a given sku
 * @param sku A product sku
 */
export async function listTransactionsBySku(sku:String):Promise<Array<Transaction>> {
  const allTransactions = await listTransactions();
  return allTransactions.filter((transaction) => transaction.sku === sku);
}
