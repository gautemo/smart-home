const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');
const secret = require('./secret');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.toggleMusic = functions.https.onRequest((request, response) => {
    if (request.query.secret !== secret.secret) {
        response.send('Your not Gaute!? Get out!');
        return;
    }
    const musicRef = db.collection('status').doc('music');
    musicRef.get().then(doc => {
        const changeTo = !doc.data().playing;
        musicRef.set({ playing: changeTo });
        response.send(`music playing: ${changeTo}`);
    });
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

    if (request.headers.secret !== secret.secret) {
        agent.handleRequest(youDontBelong);
        return;
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('play music', playMusic);
    intentMap.set('stop music', stopMusic);
    agent.handleRequest(intentMap);
});