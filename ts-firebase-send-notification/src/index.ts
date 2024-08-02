import express, { Express, Request, Response } from "express";

import dotenv from "dotenv";
import * as firebase from 'firebase-admin';

const serviceAccount = require('../react-spa-fb-notificaion-firebase-adminsdk-831j0-bcc3f65331.json');

const cors = require('cors');
dotenv.config();



const app: Express = express();
app.use(require('body-parser').json()); 
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 3000;

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

// Route for Checking Server Status
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server Is UP");
});

// Route for Sending Push Notifiction to Specific Button Type Click
app.post("/send-notification/:buttonType", (req: Request, res: Response) => {
  const messaging = firebase.messaging();
  const { buttonType } = req.params;
  const {deviceToken} = req.body;
  const message = {
    notification: {
      title:  `Button Clicked`,
      body: `You clicked button ${buttonType}`,
    },
    "data" : {buttonType},
    token: deviceToken, 
  };
  messaging.send(message)
  .then(() => {
    return res.status(200).status(200).json({message: 'Successfully sent message:'})
  })
  .catch((error) => {
    console.error('Error sending message:', error);
    return res.status(400).json({message: error})
  });
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});