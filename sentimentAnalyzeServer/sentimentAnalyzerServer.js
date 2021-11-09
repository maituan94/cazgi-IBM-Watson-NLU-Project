const getNLUInstance = require('./NLU')
const constant = require('./constant')
const express = require('express');
const app = new express();

/*This tells the server to use the client 
folder for all static resources*/
var urlRouter = express.Router();
var textRouter = express.Router();
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());
app.use('/url', urlRouter)
app.use('/text', textRouter)

const getAnalyzeParams = (urlOrText, text, featureKeyWord, limit = 1) => {
    if (!urlOrText || !text || !featureKeyWord || !constant.FEATURE_KEYWORD.includes(featureKeyWord) || !constant.URL_OR_TEXT.includes(urlOrText)) return null;

    return analyzeParams = {
        [urlOrText]: text,
        features: {
            keywords: {
                [featureKeyWord]: true,
                limit
            }
        }
    }
}
// response to server base on the analyze params
function returnToClient(analyzeParams, res, keyResults) {
    if (!analyzeParams) {
        console.log("Params is missing");
        return res.status(403).send({
            status: "failed",
            message: "Params is missing"
        });
    }
    const naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            // console.log(analysisResults)
            return res.status(200).send({
                results:analysisResults.result.keywords[0][keyResults]
            });
        })
        .catch(err => {
            res.status(500).send({
                status: "failed",
                message: "Internal Server Error"
            })
        });
}

//The default endpoint for the webserver
app.get("/", (req, res) => {
    res.send('index.html');
});

//The endpoint for the webserver ending with /url/emotion
urlRouter.get('/emotion', (req, res) => {
    let urlToAnalyze = req.query.url
    const analyzeParams = getAnalyzeParams('url', urlToAnalyze, "emotion", 1);
    return returnToClient(analyzeParams, res, "emotion");
});

//The endpoint for the webserver ending with /url/sentiment
urlRouter.get('/sentiment', (req, res) => {
    let urlToAnalyze = req.query.url
    const analyzeParams = getAnalyzeParams('url', urlToAnalyze, "sentiment", 1);
    return returnToClient(analyzeParams, res, "sentiment");
});

//The endpoint for the webserver ending with /text/emotion
textRouter.get('/emotion', (req, res) => {
    
    let textToAnalyze = req.query.text
    const analyzeParams = getAnalyzeParams('text', textToAnalyze, "emotion", 1);
    return returnToClient(analyzeParams, res, "emotion");
});

textRouter.get('/sentiment', (req, res) => {
    let textToAnalyze = req.query.text
    const analyzeParams = getAnalyzeParams('text', textToAnalyze, "sentiment", 1);
    return returnToClient(analyzeParams, res, "sentiment");
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

