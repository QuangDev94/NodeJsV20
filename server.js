// Start server
const app = require("./src/app");

const PORT = 3050;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`);
});

// event when Ctrl C (Before wxits app)
process.on("SIGINT", () => {
  server.close(() => console.log(`Exit Server Express`));
});
 