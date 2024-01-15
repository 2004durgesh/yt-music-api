// app.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ytdl from 'ytdl-core';
import {
  searchMusics,
  searchAlbums,
  searchPlaylists,
  getSuggestions,
  listMusicsFromAlbum,
  listMusicsFromPlaylist,
  searchArtists,
  getArtist,
} from 'node-youtube-music';
const app = express();

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
      '/api/express/search/musics?query={query}',
      '/api/express/search/albums?query={query}',
      '/api/express/search/playlists?query={query}',
      '/api/express/search/artists?query={query}',
      '/api/express/suggestions/{youtubeId}',
      '/api/express/albums/{albumId}',
      '/api/express/playlists/{playlistId}',
      '/api/express/artists/{artistId}',
      '/api/flask/convert?youtubeId={youtubeId}'
    ]
  });
});
// Example: /search/musics?query=Ram%20ayenge
app.get('/api/express/search/musics', async (req, res) => {
  try {
    const musics = await searchMusics(req.query.query);
    res.json(musics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /search/albums?query=Human%20after%20all
app.get('/api/express/search/albums', async (req, res) => {
  try {
    const albums = await searchAlbums(req.query.query);
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /search/playlists?query=Jazz
app.get('/api/express/search/playlists', async (req, res) => {
  try {
    const playlists = await searchPlaylists(req.query.query);
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /search/artists?query=Daft%20Punk
app.get('/api/express/search/artists', async (req, res) => {
  try {
    const artists = await searchArtists(req.query.query);
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Example: /suggestions/{youtubeId}
app.get('/api/express/suggestions/:youtubeId', async (req, res) => {
  try {
    const suggestions = await getSuggestions(req.params.youtubeId);
    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /albums/{albumId}
app.get('/api/express/albums/:albumId', async (req, res) => {
  try {
    const albumSongs = await listMusicsFromAlbum(req.params.albumId);
    res.json(albumSongs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /playlists/{playlistId}
app.get('/api/express/playlists/:playlistId', async (req, res) => {
  try {
    const playlistSongs = await listMusicsFromPlaylist(req.params.playlistId);
    res.json(playlistSongs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Example: /artists/{artistId}
app.get('/api/express/artists/:artistId', async (req, res) => {
  try {
    const artist = await getArtist(req.params.artistId);
    res.json(artist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/express/convert', async (req, res) => {
  const youtubeId = req.query.youtubeId;

  if (!youtubeId) {
      return res.json({ "status": false, "error": "YouTube ID not specified" });
  }

  try {
      // Get YouTube video info using ytdl-core
      const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${youtubeId}`);
      
      // Find the audio stream URL
      const audioStream = info.formats.find(format => format.mimeType.includes('audio/mp4'));
      const audioUrl = audioStream ? audioStream.url : null;

      if (!audioUrl) {
          return res.json({ "status": false, "error": "Audio stream not found" });
      }

      // Return the audio stream URL
      return res.json({
          "status": true,
          "audio_url": audioUrl
      });
  } catch (error) {
      return res.json({ "status": false, "error": error.message });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});
