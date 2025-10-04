require('dotenv').config();
const express = require("express");

const { WebClient } = require("@slack/web-api");
let app = express();
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());

const slack = new WebClient(process.env.SLACK_BOT_TOKEN)


// post message
app.post("/api/send", async(req,res)=>{
    try{
        let {channel, text}= req.body;
        const result = await slack.chat.postMessage({channel, text});
        res.json(result)
    }catch(err){
            res.status(500).json({ error: err.message });

    }
})

const postAt = Math.floor(Date.now()/1000) + 60; // after 1min 

// schedule message
app.post("/api/schedule", async (req, res) => {
    try {
        const { channel, text, post_at } = req.body;
        // post_at should be Unix timestamp in seconds
        const result = await slack.chat.scheduleMessage({ channel, text, post_at });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch messages
app.get('/api/messages', async (req, res) => {
  try {
    const { channel, limit } = req.query;
    const result = await slack.conversations.history({
      channel,
      limit: limit || 10,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit message
app.post('/api/edit', async (req, res) => {
  try {
    const { channel, ts, text } = req.body;
    const result = await slack.chat.update({ channel, ts, text });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete message
app.post('/api/delete', async (req, res) => {
  try {
    const { channel, ts } = req.body;
    const result = await slack.chat.delete({ channel, ts });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(8000, ()=>{
    console.log("port is running");
})