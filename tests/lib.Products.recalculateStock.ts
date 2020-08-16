import test, { Test } from 'tape';
import * as tansactionList from '../src/lib/Transactions/list';
import sinon from 'sinon';
import { TransactionType } from '../src/Interfaces/Transaction';
import recalculateStock from "../src/lib/Products/recalculateStock";

test('Product - recalculateStock works as expected', async (assert:Test) => {
  assert.plan(6);
  const transactions = [
    {
      sku: 'KED089097/68/09',
      type: TransactionType.order,
      qty: 8
    },
    {
      sku: 'KED089097/68/02',
      type: TransactionType.order,
      qty: 4
    },
    {
      sku: 'XOE089797/10/74',
      type: TransactionType.refund,
      qty: 5
    },
    {
      sku: 'KGD740425/40/48',
      type: TransactionType.order,
      qty: 6
    },
    {
      sku: 'YGH750695/17/53',
      type: TransactionType.order,
      qty: 9
    },
    {
      sku: 'TZH873296/06/42',
      type: TransactionType.order,
      qty: 0
    }
  ];
  const listStub = sinon.stub(tansactionList, "listTransactionsBySku")
    .callsFake(sku => Promise.resolve(transactions.filter(t => t.sku === sku)) );
  const productA = await recalculateStock({
    sku: 'KED089097/68/09',
    stock: 10
  });
  assert.equal(productA.sku, 'KED089097/68/09', "sku has not been changed");
  assert.equal(productA.stock, 2, "The stock correctly takes orders into accouunt");

  const productB = await recalculateStock({
    sku: 'XOE089797/10/74',
    stock: 10
  });

  assert.equal(productB.sku, 'XOE089797/10/74', "sku has not been changed");
  assert.equal(productB.stock, 15, "The stock correctly takes refunds into accouunt");

  transactions[0].sku = 'XOE089797/10/74';
  const productC = await recalculateStock({
    sku: 'XOE089797/10/74',
    stock: 10
  });
  assert.equal(productC.sku, 'XOE089797/10/74', "sku has not been changed");
  assert.equal(productC.stock, 7, "The stock correctly takes multiple refunds and orders into account");
  
  listStub.restore();
  assert.end();
});