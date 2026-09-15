const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const Config = require('../../src/config/Config');
const { createApplication } = require('../../src/Main');

test('Iris webhook -> ping -> Iris reply, preserving large IDs', async t => {
  const replies = [];
  const iris = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    assert.equal(req.url, '/reply');
    replies.push(JSON.parse(body));
    res.setHeader('Content-Type', 'application/json');
    res.end('{"ok":true}');
  });
  iris.listen(0, '127.0.0.1');
  await once(iris, 'listening');
  t.after(() => new Promise(resolve => iris.close(resolve)));
  const config = new Config({ PORT: '0', HOST: '127.0.0.1', IRIS_BASE_URL: `http://127.0.0.1:${iris.address().port}` });
  const { bot } = createApplication({ config });
  const address = await bot.start();
  t.after(() => bot.stop());
  const url = `http://127.0.0.1:${address.port}/message`;
  const send = body => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  for (const message of ['루미야 핑', '루미야 PING!', '  루미야   핑?  ']) {
    const response = await send(`{"json":{"type":1,"chat_id":9007199254740993123,"user_id":9007199254740993124,"message":${JSON.stringify(message)}}}`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
  }
  assert.deepEqual(replies, Array(3).fill({ type: 'text', room: '9007199254740993123', data: '퐁!' }));
  // Real Iris envelope: msg is decrypted, json.message can be ciphertext.
  const envelope = '{"msg":"루미야 핑","room":"테스트","sender":"사용자","json":{"type":1,"chat_id":9007199254740993123,"user_id":9007199254740993124,"_id":9007199254740993125,"message":"encrypted-message"}}';
  const envelopeResponse = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: envelope });
  assert.equal(envelopeResponse.status, 200);
  assert.deepEqual(replies[3], { type: 'text', room: '9007199254740993123', data: '퐁!' });
  const noContentType = await fetch(url, { method: 'POST', body: Buffer.from(envelope) });
  assert.equal(noContentType.status, 200);
  for (const body of ['{"type":1,"chat_id":1,"user_id":2,"message":"핑"}', '{"type":0,"message":{}}']) {
    assert.equal((await send(body)).status, 200);
  }
  assert.equal(replies.length, 5);
  assert.equal((await send('{')).status, 400);
  assert.equal((await send('{"type":1,"message":"루미야 핑"}')).status, 400);
});

test('Iris failures are visible', async t => {
  const config = new Config({ PORT: '0', HOST: '127.0.0.1' });
  const { bot } = createApplication({ config, replyClient: { send: async () => { throw new Error('Iris unavailable'); } } });
  const address = await bot.start();
  t.after(() => bot.stop());
  const url = `http://127.0.0.1:${address.port}/message`;
  const body = JSON.stringify({ type: 1, chat_id: '1', user_id: '2', message: '루미야 핑' });
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { ok: false, error: 'Internal server error' });
});
