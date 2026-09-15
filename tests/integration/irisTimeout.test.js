const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const IrisClient = require('../../src/integrations/iris/IrisClient');

test('Iris timeouts identify query/reply and also cover response body stalls', async t => {
  const iris = http.createServer((req, res) => {
    req.resume();
    if (req.url === '/reply') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.flushHeaders();
      res.write('{');
    }
    // /query never sends headers, /reply sends an incomplete body.
  });
  iris.listen(0, '127.0.0.1');
  await once(iris, 'listening');
  t.after(() => { iris.closeAllConnections(); return new Promise(resolve => iris.close(resolve)); });
  const origin = `http://127.0.0.1:${iris.address().port}`;
  const client = new IrisClient({ irisBaseUrl: origin, irisTimeoutMs: 200 });
  for (const endpoint of ['/query', '/reply']) {
    await assert.rejects(client.post(endpoint, { data: 'private chat text' }), error => {
      assert.equal(error.code, 'IRIS_TIMEOUT');
      assert.ok(error.message.includes(endpoint));
      assert.ok(error.message.includes(origin));
      assert.ok(error.message.includes('200ms'));
      assert.ok(!error.message.includes('private chat text'));
      return true;
    });
  }
});
