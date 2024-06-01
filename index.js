import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { searchMusics, searchAlbums, searchPlaylists, getSuggestions, listMusicsFromAlbum, listMusicsFromPlaylist, searchArtists, getArtist } from 'node-youtube-music';
const { getPlaylist } = require("youtube-sr").default;
const YTMusic = require("ytmusic-api").default;
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_path = require('ffmpeg-static');
const ytdl = require('ytdl-core');

const app = express();
const ytmusic = new YTMusic();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Centralized error handling middleware
const errorHandler = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Helper function for common route logic
const asyncRoute = (handler) => async (req, res) => {
  try {
    await ytmusic.initialize();
    await handler(req, res);
  } catch (error) {
    errorHandler(res, error);
  }
};

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
      '/suggestions/{youtubeId}',
      '/albums/{albumId}',
      '/playlists/{playlistId}',
      '/artists/{artistId}',
      '/lyrics/{youtubeId}',
      '/convert/{youtubeId}',
    ],
  });
});

// Grouping routes with similar logic
app.get('/home', asyncRoute(async (req, res) => {
  const homeContent = await ytmusic.getHome();
  res.json(homeContent);
}));

app.get('/search/suggestions', asyncRoute(async (req, res) => {
  const searchSuggestions = await ytmusic.getSearchSuggestions(req.query.query);
  res.json(searchSuggestions);
}));

app.get('/search/musics', asyncRoute(async (req, res) => {
  const musics = await searchMusics(req.query.query);
  res.json(musics);
}));

app.get('/search/albums', asyncRoute(async (req, res) => {
  const albums = await searchAlbums(req.query.query);
  res.json(albums);
}));

app.get('/search/playlists', asyncRoute(async (req, res) => {
  const playlists = await searchPlaylists(req.query.query);
  res.json(playlists);
}));

app.get('/search/artists', asyncRoute(async (req, res) => {
  const artists = await searchArtists(req.query.query);
  res.json(artists);
}));

app.get('/suggestions/:youtubeId', asyncRoute(async (req, res) => {
  const suggestions = await getSuggestions(req.params.youtubeId);
  res.json(suggestions);
}));

app.get('/albums/:albumId', asyncRoute(async (req, res) => {
  const albumSongs = await listMusicsFromAlbum(req.params.albumId);
  res.json(albumSongs);
}));

app.get('/playlists/:playlistId', asyncRoute(async (req, res) => {
  // const playlistSongs = await listMusicsFromPlaylist(req.params.playlistId); /*keep the code for emergency purposes */
  const playlistSongs = await getPlaylist(`https://www.youtube.com/playlist?list=${req.params.playlistId}`);
  res.json(playlistSongs);
}));

// try {
//   const artist = await getArtist(req.params.artistId);
//   res.json(artist);
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ error: 'Internal Server Error' });
// } /*keep the code for emergency purposes */
app.get('/artists/:artistId', asyncRoute(async (req, res) => {
  const artist = await ytmusic.getArtist(req.params.artistId);
  res.json(artist);
}));

app.get('/lyrics/:youtubeId', asyncRoute(async (req, res) => {
  const lyrics = await ytmusic.getLyrics(req.params.youtubeId);
  res.json(lyrics);
}));

app.get("/convert/:youtubeId", asyncRoute(async (req, res) => {
  res.setHeader('Content-type', 'audio/mpeg');
  let stream = ytdl(req.params.youtubeId, {
    quality: 'highestaudio',
  });
  
  let proc = ffmpeg({ source: stream })
    .setFfmpegPath(ffmpeg_path)
    .toFormat('mp3');

  proc.on('error', (err) => {
    console.error('An error occurred: ' + err.message);
    res.status(500).send('An error occurred while processing the audio');
  });

  proc.pipe(res, { end: true });
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});
