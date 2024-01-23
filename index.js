import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodeFetch from 'node-fetch';
import { searchMusics, searchAlbums, searchPlaylists, getSuggestions, listMusicsFromAlbum, listMusicsFromPlaylist, searchArtists, getArtist } from 'node-youtube-music';
import ytdl from 'ytdl-core';
const YTMusic = require("ytmusic-api").default;
const app = express();
const ytmusic = new YTMusic();
// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the yt-music API!',
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
    ]
  });
});


// Example: /home
app.get('/home', async (req, res) => {
  try {
    await ytmusic.initialize();
    const homeContent = await ytmusic.getHome();
    res.json(homeContent);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example:/search/suggestions?query={query}
app.get('/search/suggestions', async (req, res) => {
  try {
    await ytmusic.initialize();
    const searchSuggestions = await ytmusic.getSearchSuggestions(req.query.query);
    res.json(searchSuggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /search/musics?query=Ram ayenge
app.get('/search/musics', async (req, res) => {
  try {
    const musics = await searchMusics(req.query.query);
    res.json(musics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /search/albums?query=Human after all
app.get('/search/albums', async (req, res) => {
  try {
    const albums = await searchAlbums(req.query.query);
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /search/playlists?query=Jazz
app.get('/search/playlists', async (req, res) => {
  try {
    const playlists = await searchPlaylists(req.query.query);
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /search/artists?query=Daft Punk
app.get('/search/artists', async (req, res) => {
  try {
    const artists = await searchArtists(req.query.query);
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Example: /suggestions/{youtubeId}
app.get('/suggestions/:youtubeId', async (req, res) => {
  try {
    const suggestions = await getSuggestions(req.params.youtubeId);
    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /albums/{albumId}
app.get('/albums/:albumId', async (req, res) => {
  try {
    const albumSongs = await listMusicsFromAlbum(req.params.albumId);
    res.json(albumSongs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /playlists/{playlistId}
app.get('/playlists/:playlistId', async (req, res) => {
  try {
    const playlistSongs = await listMusicsFromPlaylist(req.params.playlistId);
    res.json(playlistSongs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Example: /artists/{artistId}
app.get('/artists/:artistId', async (req, res) => {
  // try {
  //   const artist = await getArtist(req.params.artistId);
  //   res.json(artist);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'Internal Server Error' });
  // } /*keep the code for emergency purposes */
  try {
    await ytmusic.initialize();

    const artist = await ytmusic.getArtist(req.params.artistId);
    res.json(artist);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /lyrics/:{youtubeId}
app.get('/lyrics/:youtubeId', async (req, res) => {
  try {
    await ytmusic.initialize();
    const lyrics = await ytmusic.getLyrics(req.params.youtubeId);
    res.json(lyrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Example: /get-audio-url/:youtubeId
app.get('/get-audio-url/:youtubeId', async (req, res) => {
  try {
    const youtubeId = req.params.youtubeId;

    // Get video info
    const info = await ytdl.getInfo(youtubeId);

    // Get audio format with the highest quality
    const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });

    // Respond with the audio URL
    res.json({ audioUrl: audioFormat.url,info:info });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /convert/:youtubeId
app.get('/convert/:youtubeId', async (req, res) => {

  const url = `https://19e4b655-c90c-43d4-beae-294d6c47b2f4-00-3fxygcjrexg4y.pike.replit.dev/convert?youtubeId=${req.params.youtubeId}`;
  const response = await nodeFetch(url);
  const json = await response.json();
  res.json(json);

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});
