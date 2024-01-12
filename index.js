// app.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
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

// Example: /search/musics?query=Ram%20ayenge
app.get('/search/musics', async (req, res) => {
  try {
    const musics = await searchMusics(req.query.query);
    res.json(musics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: /search/albums?query=Human%20after%20all
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

// Example: /search/artists?query=Daft%20Punk
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
  try {
    const artist = await getArtist(req.params.artistId);
    res.json(artist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});
