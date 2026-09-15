require("../src/Main").main().catch(error => { console.error(error); process.exitCode = 1; });
