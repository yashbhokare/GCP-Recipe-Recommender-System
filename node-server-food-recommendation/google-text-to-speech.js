// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// Import other required libraries
const fs = require('fs');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient({ keyFilename: "food-recommendation-310001-e7c454660ec9.json"});

module.exports = function () {
    this.recepieAudio = async function recepieAudio(text, index) {


        if(index != 0){
            const filePath = './Step'+(index-1)+'.mp3';
            fs.unlinkSync(filePath);
        }

        // The text to synthesize
        // Construct the request
        const request = {
            input: { text: text },
            // Select the language and SSML voice gender (optional)
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            // select the type of audio encoding
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);
        // Write the binary audio content to a local file

        const writeFile = util.promisify(fs.writeFile);
        await writeFile('Step' + index + '.mp3', response.audioContent, 'binary');

        return true;
    }
}
