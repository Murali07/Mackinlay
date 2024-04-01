const express = require("express");
const dotenv = require("dotenv");
const dialogflow = require("dialogflow");
const uuid = require("uuid");

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

const projectId = process.env.PROJECT_ID || "small-talk-2-2-2-2";
const credentialsPath = process.env.CREDENTIALS_PATH || "./small-talk-2-2-2-2-5b3b3b3b3b3b.json";

process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

async function runAssistantBot(){

    // a unique identifier for the given session
    const sessionId = uuid.v4();

    // create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // the text query request
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // the query to send to the dialogflow agent
                text: "Who are you?",
                // the language used by the client
                languageCode: "en-US",
            },
        },
    };

    // send request and log result
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentText;
    const queryText = responses[0].queryResult.queryText;

    if(result){
        return {
            user: queryText,
            bot: result
        }
    } else {
        return Error("No intent matched")
    }

}

app.get("/", async(req, res) => {
    try{
        const result = await runAssistantBot();
        return res.status(200).json({message: "Success", result})
    } catch(error){
        console.log(error)
        return res.status(500).json({message: "Server error", error})
    }
})


app.listen(PORT, async() => {
    console.log(`App is running on PORT ${PORT}`);
})

