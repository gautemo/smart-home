const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');
const secret = require('./secret');
const busses = require('./ruter');
const sykkel = require('./bysykkel');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.toggleMusic = functions.https.onRequest(async (request, response) => {
    if (denyRequest(request, response)) {
        return;
    }
    const musicRef = db.collection('status').doc('music');
    const doc = await musicRef.get();
    const changeTo = !doc.data().playing;
    await musicRef.set({ playing: changeTo });
    response.send(`music playing: ${changeTo}`);
});

exports.getBusses = functions.https.onRequest(async (request, response) => {
    if (denyRequest(request, response)) {
        return;
    }
    const result = await busses.minutes();
    response.send(result);
});

exports.getSykkel = functions.https.onRequest(async (request, response) => {
    if (denyRequest(request, response)) {
        return;
    }
    const result = await sykkel.nrAvailible;
    response.send(result);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

    function youDontBelong(agent) {
        const conv = agent.conv();
        conv.close('You shall not pass!');
        agent.add(conv);
    }

    function playMusic(agent) {
        db.collection('status').doc('music').set({ playing: true });
        const conv = agent.conv();
        conv.close('Lets play some tunes!');
        agent.add(conv);
    }

    function stopMusic(agent) {
        db.collection('status').doc('music').set({ playing: false });
        const conv = agent.conv();
        conv.close('Silence!');
        agent.add(conv);
    }

    async function getBusStatus(agent) {
        const conv = agent.conv();
        const msg = await busses.text();
        conv.close(msg);
        agent.add(conv);
    }

    async function getBicycleStatus(agent) {
        const conv = agent.conv();
        const msg = await sykkel.text();
        conv.close(msg);
        agent.add(conv);
    }

    if (request.headers.secret !== secret.secret) {
        agent.handleRequest(youDontBelong);
        return;
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('play music', playMusic);
    intentMap.set('stop music', stopMusic);
    intentMap.set('bus', getBusStatus);
    intentMap.set('sykkel', getBicycleStatus);
    agent.handleRequest(intentMap);
});

const denyRequest = (req, resp) => {
    if (req.query.secret !== secret.secret) {
        resp.send('Your not Gaute!? Get out!');
        return true;
    }
    return false;
};