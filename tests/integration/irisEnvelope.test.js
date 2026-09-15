const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const Config = require('../../src/config/Config');
const { createApplication } = require('../../src/Main');

test('older Iris envelope reads decrypted chat_logs via query before ping', async t => {
  const requests = [];
  const iris = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    requests.push({ endpoint: req.url, body: JSON.parse(body) });
    res.setHeader('Content-Type', 'application/json');
    res.end(req.url === '/query' ? '{"data":[{"id":9007199254740993125,"message":"루미야 핑"}]}' : '{"ok":true}');
  });
  iris.listen(0, '127.0.0.1');
  await once(iris, 'listening');
  t.after(() => new Promise(resolve => iris.close(resolve)));
  const config = new Config({ PORT: '0', HOST: '127.0.0.1', IRIS_BASE_URL: `http://127.0.0.1:${iris.address().port}` });
  const { bot } = createApplication({ config });
  const address = await bot.start();
  t.after(() => bot.stop());
  for (const key of ['id', '_id']) {
    const response = await fetch(`http://127.0.0.1:${address.port}/message`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: `{"json":{"type":1,"chat_id":9007199254740993123,"user_id":9007199254740993124,"${key}":9007199254740993125,"message":"encrypted-message"}}`,
    });
    assert.equal(response.status, 200);
    assert.deepEqual(requests.at(-2), {
      endpoint: '/query', body: { query: `SELECT * FROM chat_logs WHERE ${key} = ?`, bind: ['9007199254740993125'] },
    });
    assert.deepEqual(requests.at(-1), { endpoint: '/reply', body: { type: 'text', room: '9007199254740993123', data: '퐁!' } });
  }
});
