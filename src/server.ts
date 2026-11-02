import http from "http";
import env from "./config/env";
import app from "./modules/app";

const server = http.createServer(app);
const port = env.PORT;

server.listen(port, () => {
  console.log(`Server run on: http://localhost:${port}`);
});
