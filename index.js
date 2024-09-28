import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ytmusic from 'ytmusic_api_unofficial'
import { parse, stringify } from 'flatted';
import { Innertube } from 'youtubei.js';
import { Client,MusicClient } from "youtubei";
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_path = require('ffmpeg-static');
import ytdl from '@distube/ytdl-core'
import { asyncRoute, removeCircularReferences } from "./utils.js";

const app = express();
const youtube = await Innertube.create(/* options */);
const client = new Client();
const music = new MusicClient();
// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '😊Welcome to the youtube-music 🎵🎶 API!🎉🎊',
    routes: [
      '/home',
      '/search/musics?query={query}',
      '/search/albums?query={query}',
      '/search/playlists?query={query}',
      '/search/artists?query={query}',
      '/music/{youtubeId}',
      '/playlists/{playlistId}',
      '/artists/{artistId}',
      '/lyrics/{youtubeId}',
      '/convert/{youtubeId}',
      '/stream/{youtubeId}',
    ],
  });
});

// Grouping routes with similar logic
app.get('/home', asyncRoute(async (req, res) => {
  const homeContent = await ytmusic.charts('FR');
  res.json(homeContent);
}));

app.get('/search/suggestions', asyncRoute(async (req, res) => {
  const searchSuggestions = await ytmusic.getSearchSuggestions(req.query.query);
  res.json(searchSuggestions);
}));

app.get('/search/musics', asyncRoute(async (req, res) => {
  //Available types: false, album, song, video, playlist, artist, podcast, profile, station, episode
  const musics = await ytmusic.search(req.query.query, "SONG", true);
  res.json(parse(stringify(musics, removeCircularReferences())));
}));

app.get('/search/albums', asyncRoute(async (req, res) => {
  const albums = await ytmusic.search(req.query.query,'album', true);
  res.json(albums);
}));

app.get('/search/playlists', asyncRoute(async (req, res) => {
  const playlists = await ytmusic.search(req.query.query, "playlist", true);
  res.json(playlists);
}));

app.get('/search/artists', asyncRoute(async (req, res) => {
  const artists = await ytmusic.search(req.query.query, "artist", true);
  res.json(artists);
}));

app.get('/music/:youtubeId', asyncRoute(async (req, res) => {
  const music = await ytmusic.get(req.params.youtubeId);
  res.json(music);
}));

app.get('/playlists/:playlistId', asyncRoute(async (req, res) => { //u can also pass the album id
  // const playlistSongs = await getPlaylist(`https://www.youtube.com/playlist?list=${req.params.playlistId}`);
  const playlistSongs = await client.getPlaylist(req.params.playlistId);
  res.json(parse(stringify(playlistSongs, removeCircularReferences())));
}));


app.get('/artists/:artistId', asyncRoute(async (req, res) => {
  // const artist = await client.getChannel(req.params.artistId);
  const artist = await client.findOne(req.params.artistId, {type: "channel"}); 
  res.json(parse(stringify(artist, removeCircularReferences())));

}));

app.get('/lyrics/:youtubeId', asyncRoute(async (req, res) => {
  const lyrics = await music.getLyrics(req.params.youtubeId);
  res.json(lyrics);
}));

app.get('/convert/:youtubeId', asyncRoute(async (req, res) => {
  // const audioUrl=await ytmusic.download(req.params.youtubeId);
  // res.json({ audioLink: audioUrl });
  const info = await youtube.getBasicInfo(req.params.youtubeId);
  const url = info.streaming_data?.formats[0].decipher(youtube.session.player);
  res.json({ url: url });
  
}))

app.get('/music/:youtubeId', asyncRoute(async (req, res) => {
  const music = await client.getVideo(req.params.youtubeId);
  res.json(music);
}));

app.get("/stream/:youtubeId", asyncRoute(async (req, res) => {
  /*
  vercel cant handle audio stream so we will send the audio link instead,
  the audio-link of some songs may not work due to 403 error
  the streaming code below is from https://github.com/Thanatoslayer6/ytm-dlapi

  to use this router the server need to be hosted on platform like aws(ec2), azure, heroku, etc (if u find other method pls let me know too😁)
  vercel is not recommended for this router ( will give 504 error)
  */
  res.setHeader('Content-Type', 'audio/mpeg');

  try {
    // const stream = ytdl(req.params.youtubeId, { quality: 'highestaudio' });
    const info = await ytdl.getInfo(req.params.youtubeId);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

    const proc = ffmpeg(format?.url)
      .setFfmpegPath(ffmpeg_path)
      .toFormat('mp3');

    proc.on('end', () => {
      console.log('Processing finished successfully');
    });

    proc.on('error', (err) => {
      console.error('Error in processing:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error in processing stream' });
      }
    });

    proc.pipe(res, { end: true });
  } catch (error) {
    console.error('Error in fetching YouTube stream:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error fetching YouTube stream' });
    }
  }
}));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});
