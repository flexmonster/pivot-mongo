// lib/app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import * as mongoController from "./controller/mongo";

// Create a new express application instance
const app: express.Application = express();

app.use(cors());
app.use(compression());

app.use(bodyParser.json());

app.use("/mongo", mongoController.default);

const server = app.listen(9204, () => {
  console.log('The server is listening at http://localhost:9204');
});

export default server;
