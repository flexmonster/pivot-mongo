"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const flexmonster_mongo_connector_1 = require("flexmonster-mongo-connector");
let dbo = null;
let _apiReference = null;
mongodb_1.MongoClient.connect('mongodb://read:only@olap.flexmonster.com:27017', {
    useNewUrlParser: true
}, (err, db) => {
    if (err)
        throw err;
    dbo = db.db("flexmonster");
    _apiReference = new flexmonster_mongo_connector_1.MongoDataAPI();
});
const mongo = express_1.Router();
mongo.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (req.body) {
        switch (req.body.type) {
            case "fields":
                result = yield _apiReference.getSchema(dbo, req.body.index);
                break;
            case "members":
                result = yield _apiReference.getMembers(dbo, req.body.index, req.body.field, req.body.page);
                break;
            case "select":
                result = yield _apiReference.getSelectResult(dbo, req.body.index, req.body.query, req.body.page);
                break;
            default:
                res.json({
                    error: {
                        message: "unknown request type"
                    }
                });
        }
        res.json(result);
    }
    else {
        res.json({
            error: {
                message: "request with undefined body"
            }
        });
    }
}));
mongo.post("/handshake", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ version: _apiReference.API_VERSION });
    }
    catch (err) {
        handleError(err, res);
    }
}));
mongo.post("/fields", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield _apiReference.getSchema(dbo, req.body.index);
        res.json(result);
    }
    catch (err) {
        handleError(err, res);
    }
}));
mongo.post("/members", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield _apiReference.getMembers(dbo, req.body.index, req.body.field, { page: req.body.page, pageToken: req.body.pageToken });
        res.json(result);
    }
    catch (err) {
        handleError(err, res);
    }
}));
mongo.post("/select", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield _apiReference.getSelectResult(dbo, req.body.index, req.body.query, { page: req.body.page, pageToken: req.body.pageToken });
        res.json(result);
    }
    catch (err) {
        handleError(err, res);
    }
}));
mongo.post("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleError(`Request type '${req.body.type}' is not implemented.`, res);
}));
function handleError(err, res, status) {
    if (!res) {
        throw "Second parameter is required";
    }
    console.error(err);
    status = status || 500;
    var message = "Unknown server error.";
    if (typeof err == "string") {
        message = err;
    }
    else if (err.message) {
        message = err.message;
    }
    res.status(status).json({
        message
    });
}
exports.default = mongo;
//# sourceMappingURL=mongo.js.map