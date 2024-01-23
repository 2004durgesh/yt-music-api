// netlify/functions/get-audio-url.js
const ytdl = require('ytdl-core');

exports.handler = async function(event, context) {
  try {
    const youtubeId = event.path.split('/').pop();

    // Get video info
    const info = await ytdl.getInfo(youtubeId);

    // Get audio format with the highest quality
    const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });

    // Respond with the audio URL
    return {
      statusCode: 200,
      body: JSON.stringify({ audioUrl: audioFormat.url, info: info })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};