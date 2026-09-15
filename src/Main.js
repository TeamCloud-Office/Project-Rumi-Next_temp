const { envFile } = require("./config/paths");
const createApplication = require("./bootstrap/createApplication");
async function main() {
  require("dotenv").config({ path: envFile });
  const application = createApplication();
  const address = await application.bot.start();
  console.log(`Rumi webhook listening on ${address.address}:${address.port}/message`);
  console.log(`Iris API: ${new URL(application.container.config.irisBaseUrl).origin}`);
  const shutdown = async () => {
    process.removeListener("SIGINT", shutdown);
    process.removeListener("SIGTERM", shutdown);
    const timer = setTimeout(() => {
      console.error("Shutdown timed out");
      process.exit(1);
    }, 6000);
    timer.unref();
    try { await application.bot.stop(); }
    catch (error) { console.error("Shutdown failed:", error); process.exitCode = 1; }
    finally {
      clearTimeout(timer);
      process.exit(process.exitCode || 0);
    }
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  return application;
}
if (require.main === module) main().catch(error => { console.error("Startup failed:", error); process.exitCode = 1; });
module.exports = { main, createApplication };
