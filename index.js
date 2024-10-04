import { createRequire } from "module";
const require = createRequire(import.meta.url);
const YouTube = require("youtube-sr").default;
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
      '/search/suggestions?query={query}',
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
  const searchSuggestions = await YouTube.getSuggestions(req.query.query);
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

  /*
  try this it works every time (https://github.com/imputnet/cobalt/blob/main/docs/api.md)
   */
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
  So, like, Vercel can’t handle audio streams, so we’ll just send the audio link instead. 
  Some songs might throw a 403 error, so watch out for that.
  The streaming code below is borrowed from https://github.com/Thanatoslayer6/ytm-dlapi. 

  To make this work, you'll need to host the server on platforms like AWS (EC2), Azure, Heroku, etc. 
  (If you find any other cool ways, let me know! 😁)
  Just a heads up—Vercel is not a good choice for this route (you’ll probably get a 504 error).
  */
  
  res.setHeader('Content-Type', 'audio/mpeg');

  try {
    // const stream = ytdl(req.params.youtubeId, { quality: 'highestaudio' });
    const info = await ytdl.getInfo(req.params.youtubeId);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

    const proc = ffmpeg(format?.url)
    .setFfmpegPath(ffmpeg_path)  // For local dev, just set the path to ffmpeg.exe here like: setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe')
      .toFormat('mp3');

    proc.on('end', () => {
      console.log('All done! Processing finished successfully');
    });

    proc.on('error', (err) => {
      console.error('Whoops! Error in processing:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Something went wrong with the stream' });
      }
    });

    proc.pipe(res, { end: true });
  } catch (error) {
    console.error('Yikes! Error in fetching YouTube stream:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Oops! Error fetching YouTube stream' });
    }
  }
}));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});
