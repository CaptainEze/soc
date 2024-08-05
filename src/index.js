const express = require('express');
const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');

const apiConfig = require('../config/api.config');
const dbConn = require('./models/db/mongodb');

const authRoute = require('./routes/auth');

const utils = require('./utils');


const app = express();
app.disable('x-powered-by');


dbConn();
app.use((req,res,next)=>{
    if(utils.matchContentType(req,['application/x-www-form-urlencoded','application/json','multipart/form-data']))
        next();
    else
        res.status(400).send('Unnaccepted Content Type Header');
});
app.use(express.json());

// catch errors pertaining to invalid body content when content type is set to json
app.use((err,req,res,next)=>{
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON payload received' });
    }
    let contentType = utils.getContentType(req);
    if (contentType.includes('application/x-www-form-urlencoded')) {
        if (typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Invalid URL-encoded payload received' });
        }
    }
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(formidableMiddleware());


app.listen(apiConfig.appPort,(err)=>{
    if(err) console.log(err);
    console.log(`I am listening at port ${apiConfig.appPort}`);

});

app.use(`/api/${apiConfig.apiVersion}/auth`, authRoute);