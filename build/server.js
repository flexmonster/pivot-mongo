"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoController = __importStar(require("./controller/mongo"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use("/mongo", mongoController.default);
const server = app.listen(9204, () => {
    console.log('Example app listening on port 9204!');
});
exports.default = server;
//# sourceMappingURL=server.js.map