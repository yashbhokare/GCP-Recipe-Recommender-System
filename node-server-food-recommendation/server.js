require('dotenv').config()

const express = require('express');
const app = express();
const connection = require('./database');
require('./google-text-to-speech')();
const cors = require('cors')
const ms = require('mediaserver');
const multer = require('multer');
const upload = multer();
// Adding this to resolve cors issue of angular
app.use(cors());
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded());


// Fetch recepie based on title 
app.route('/api/recipe/:Title')
  .get(function (req, res, next) {
    connection.query(
      "SELECT * FROM `dataset` WHERE name = ? LIMIT 10", req.params.Title,
      function (error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  });

// Fetch first 30 recepies
app.route('/api/recipeList')
  .get(function (req, res, next) {
    connection.query(
      "SELECT * FROM `dataset` LIMIT 30",
      function (error, results2, fields) {
        if (error) throw error;
        res.json(results2);
      }
    );
  });

// To check the code 
app.get('/api/status', (req, res) => res.json('Working!'));

app.get('/api/recipeAudio/:Steps', (req, res) => {
  return recepieAudio(JSON.parse(req.params.Steps)).then(result => {
    return res.json(result);
  });
});

// Port 8080 for Google App Engine
app.set('port', process.env.PORT || 3000);
app.listen(3000);

app.get('/get_audio/:filename', function (req, res) {
  ms.pipe(req, res, './'+req.params.filename);
});

app.post('/api/upload_sound', async function (req, res) {
  console.log("Getting text transcription..");
  let transcription = await testGoogleTextToSpeech(req.body.buffer);
  console.log("Text transcription: " + transcription);
  return res.json(transcription);
});

app.post('/api/send_recipe_step', function (req, res) {
  const step = req.body.step;
  const index =  req.body.index;
  return recepieAudio(step, index).then(result => {
    return res.json(result);
  });
});

async function testGoogleTextToSpeech(audioBuffer) {
  const speech = require('@google-cloud/speech');
  const client = new speech.SpeechClient( { keyFilename: "food-recommendation-310001-e7c454660ec9.json"});
  const audio = {
    content: audioBuffer
  };
  const config = {
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
}


