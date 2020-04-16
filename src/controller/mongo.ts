import {Request, Response, Router } from "express";
import {MongoClient} from "mongodb";
import {MongoDataAPI} from 'flexmonster-mongo-connector';
import {Db} from 'mongodb';

let dbo: Db = null;
let _apiReference: MongoDataAPI = null;
MongoClient.connect('mongodb://read:only@olap.flexmonster.com:27017', { 
    useNewUrlParser: true
}, (err, db) => {
	if (err) throw err;
	dbo = db.db("flexmonster");
	_apiReference = new MongoDataAPI();
});

/**
 * POST /
 * Controller.
 */
const mongo = Router();

mongo.post("/", async (req: Request, res: Response) => {
    let result = null;
    if (req.body) {
        switch (req.body.type) {
			case "fields":
				result = await _apiReference.getSchema(dbo, req.body.index);
				break;
			case "members":
                result = await _apiReference.getMembers(dbo, req.body.index, req.body.field, req.body.page);
				break;
			case "select":
				
				result = await _apiReference.getSelectResult(dbo, req.body.index, req.body.query, req.body.page);
				break;
			default:
				res.json({
					error: {
						message: "unknown request type"
					}
				});
		}
		res.json(result);
    } else {
        res.json({
			error: {
				message: "request with undefined body"
			}
		});
    }
});

mongo.post("/handshake", async (req: Request, res: Response) => {
	try {
        res.json({ version: _apiReference.API_VERSION });
    } catch (err) {
        handleError(err, res);
    }
});

mongo.post("/fields", async (req: Request, res: Response) => {
	try {
        const result = await _apiReference.getSchema(dbo, req.body.index);
        res.json(result);
    } catch (err) {
        handleError(err, res);
    }
});

mongo.post("/members", async (req: Request, res: Response) => {
    try {
        const result = await _apiReference.getMembers(dbo, req.body.index, req.body.field, {page: req.body.page, pageToken: req.body.pageToken});
        res.json(result);
    } catch (err) {
        handleError(err, res);
    }
});

mongo.post("/select", async (req: Request, res: Response) => {
    try {
		const result = await _apiReference.getSelectResult(dbo, req.body.index, req.body.query, {page: req.body.page, pageToken: req.body.pageToken});
        res.json(result);
    } catch (err) {
        handleError(err, res);
    }
});

// throw an error on other endpoints
mongo.post("*", async (req: Request, res: Response) => {
    handleError(`Request type '${req.body.type}' is not implemented.`, res);
});



function handleError(err: any, res: Response, status?: any) {
    if (!res) {
        throw "Second parameter is required";
    }
    console.error(err);
    status = status || 500;
    var message = "Unknown server error.";
    if (typeof err == "string") {
        message = err;
    } else if (err.message) {
        message = err.message;
    }
    res.status(status).json({
        message
    });
}

export default mongo;
