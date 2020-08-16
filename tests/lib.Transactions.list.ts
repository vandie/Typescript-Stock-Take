import sinon from 'sinon';
import test, { Test } from 'tape';
import * as testFile from '../src/lib/Transactions/list';
import { assert } from 'console';
import Transaction, {TransactionType} from '../src/Interfaces/Transaction';

test('Transaction - fetch list works as expected', async (assert:Test) => {
  assert.plan(2);
  const readFileStub = sinon.stub(testFile, 'asyncReadFile');

  // We want the callback to return an error the first time round so we can check
  // that the error handling works
  readFileStub.onFirstCall().callsFake(async () => {
    throw new Error('Test Error');
  });

  // The second time we want to actually return some usable text
  readFileStub.onSecondCall().returns(
    Promise.resolve('[{"sku":"KED089097/68/09","type":"order","qty":8},{"sku":"DOK019240/66/49","type":"order","qty":4},{"sku":"XOE089797/10/74","type":"refund","qty":5},{"sku":"KGD740425/40/48","type":"order","qty":6},{"sku":"YGH750695/17/53","type":"order","qty":9},{"sku":"TZH873296/06/42","type":"order","qty":0}]'),
  );

  // we don't want to use destructuring as it can on occasion mess up sinon
  // so lets pull our function to test out here after we've mocked things
  const listTransactions = testFile.default;

  // We want to check that in the event of an errror,
  // the error is wrapped correctly
  try {
    await listTransactions();
    assert.fail(
      'listTransactions returns a human readable error message',
    );
  } catch (e) {
    assert.equals(
      e.message,
      'Failed to fetch transactions with reason: Test Error',
      'listTransactions returns a human readable error message',
    );
  }

  // Now lets actually list the transactions and check we get our parse mocked value
  const transactionList = await listTransactions();
  const expectedTransactionList = [
    {
      sku: 'KED089097/68/09',
      type: TransactionType.order,
      qty: 8
    },
    {
      sku: 'DOK019240/66/49',
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

  assert.deepEquals(
    transactionList,
    expectedTransactionList,
    'The Transaction list is as expected',
  );

  readFileStub.restore();
  assert.end();
});

test("listTransactionsBySku works as expected", async (assert: Test) => {
  assert.plan(2);
  const readFileStub = sinon.stub(testFile, 'asyncReadFile')
    .returns(
      Promise.resolve('[{"sku":"KED089097/68/09","type":"order","qty":8},{"sku":"DOK019240/66/49","type":"order","qty":4},{"sku":"XOE089797/10/74","type":"refund","qty":5},{"sku":"KGD740425/40/48","type":"order","qty":6},{"sku":"YGH750695/17/53","type":"order","qty":9},{"sku":"TZH873296/06/42","type":"order","qty":0}]'),
    );

  const listTransactionsBySku = testFile.listTransactionsBySku;

  assert.deepEqual(
    await listTransactionsBySku('XOE089797/10/74'),
    [{
      sku: 'XOE089797/10/74',
      type: 'refund',
      qty: 5
    }],
    "listTransactionsBySku filters correctly (test 1)"
  );

  assert.deepEqual(
    await listTransactionsBySku('KGD740425/40/48'),
    [{
      sku: 'KGD740425/40/48',
      type: 'order',
      qty: 6
    }],
    "listTransactionsBySku filters correctly (test 2)"
  );

  readFileStub.restore();
});
