const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const Config = require('../../src/config/Config');
const { createApplication } = require('../../src/Main');

test('shutdown releases the port even when an Iris reply never completes', async t => {
  let entered;
  const replyStarted = new Promise(resolve => { entered = resolve; });
  const config = new Config({ HOST: '127.0.0.1', PORT: '0' });
  const { bot } = createApplication({ config, replyClient: {
    send: async () => { entered(); await new Promise(() => {}); },
  } });
  const address = await bot.start();
  t.after(() => bot.stop({ graceMs: 0 }));
  const body = JSON.stringify({ type: 1, chat_id: '1', user_id: '2', message: '루미야 핑' });
  const request = http.request({ hostname: '127.0.0.1', port: address.port, path: '/message', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  });
  t.after(() => request.destroy());
  const disconnected = new Promise(resolve => request.once('error', resolve));
  request.end(body);
  await replyStarted;
  await Promise.all([bot.stop({ graceMs: 50 }), bot.stop({ graceMs: 50 })]);
  assert.equal((await disconnected).code, 'ECONNRESET');
  config.port = address.port;
  const restarted = await bot.start();
  assert.equal(restarted.port, address.port);
  const response = await fetch(`http://127.0.0.1:${restarted.port}/message`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"type":0}',
  });
  assert.equal(response.status, 200);
});
