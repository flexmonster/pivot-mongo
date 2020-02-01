// lib/app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as mongoController from "./controller/mongo";

// Create a new express application instance
const app: express.Application = express();

app.use(cors());
// app.use(bodyParser.urlencoded({
// 	extended: false
// }));
app.use(bodyParser.json());

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
app.use(express.static('./'));
app.use("/mongo", mongoController.default);

const server = app.listen(3100, () => {
  console.log('Example app listening on port 3100!');
});

export default server;