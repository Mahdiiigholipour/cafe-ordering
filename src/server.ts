import http from "http";
import app from "./app";
import env from "./config/env";

const server = http.createServer(app);
const port = env.PORT;

server.listen(port, () => {
  console.log(`Server run on: http://localhost:${port}`);
});
