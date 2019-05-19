# smart-home
This is my smart home project, which will include a Google Assistant App, music speaker, Phillips Hue lights and a home screen. Feel free to steal all the code you need.

## Firebase
[Firebase console](https://console.firebase.google.com/project/smarthome-7704d/overview)

Smart home state is stored in firestore.

### Firebase functions
`firebase/functions/index.js` contains functions that dialogflow calls and http triggers for flic buttons.

`firebase/functions/ruter.js` uses [Entur sdk](https://github.com/entur/sdk). Busstop ids are gotten from developer tools on [Entur tavla](https://tavla.en-tur.no/)

## Google Home app
[Dialogflow](https://console.dialogflow.com/api-client/#/agent/bf2359ce-aa17-46ce-b55e-d8d5777c5f0d/intents)

## Weather
[weather/index.html](weather/index.html) displays a weather widget from [DarkSky](https://darksky.net/widgets/default). Used in webview in Android app.
