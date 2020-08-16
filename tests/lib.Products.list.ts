import sinon from 'sinon';
import test, { Test } from 'tape';
import * as testFile from '../src/lib/Products/list';

test('Product - fetch list works as expected', async (assert:Test) => {
  assert.plan(2);
  const readFileStub = sinon.stub(testFile, 'asyncReadFile');

  // We want the callback to return an error the first time round so we can check
  // that the error handling works
  readFileStub.onFirstCall().callsFake(async () => {
    throw new Error('Test Error');
  });

  // The second time we want to actually return some usable text
  readFileStub.onSecondCall().returns(
    Promise.resolve('[{"sku":"LTV719449/39/39","stock":8525},{"sku":"CLQ274846/07/46","stock":8414}]'),
  );

  // we don't want to use destructuring as it can on occasion mess up sinon
  // so lets pull our function to test out here after we've mocked things
  const listProducts = testFile.default;

  // We want to check that in the event of an errror,
  // the error is wrapped correctly
  try {
    await listProducts();
    assert.fail(
      'listProducts returns a human readable error message',
    );
  } catch (e) {
    assert.equals(
      e.message,
      'Failed to fetch products with reason: Test Error',
      'listProducts returns a human readable error message',
    );
  }

  // Now lets actually list the products and check we get our parse mocked value
  const productList = await listProducts();
  const expectedProductList = [
    {
      sku: 'LTV719449/39/39',
      stock: 8525,
    },
    {
      sku: 'CLQ274846/07/46',
      stock: 8414,
    },
  ];

  assert.deepEquals(
    productList,
    expectedProductList,
    'The Product list is as expected',
  );

  readFileStub.restore();
  assert.end();
});
