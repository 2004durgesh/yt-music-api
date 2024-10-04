# YouTube Music API 🎶

🎵 So, this project is like a YouTube Music API built using Express.js 🚀 and a bunch of random Node.js packages 📦 for YouTube Music stuff. It’s the main server that gives you a ton of features 🌟 to play around with YouTube Music’s goodies 🎶—all in one place, you know?

## Getting Started 🚀

These instructions will help you get a copy of the project up and running on your local machine for messing around and testing stuff.

### Prerequisites

- You need Node.js installed on your machine.

### Installing

1. Clone the repo: `git clone https://github.com/2004durgesh/yt-music-api.git`

2. Install the Node.js stuff: `cd yt-music-api && npm install`

3. Start the server: `node index.js`

Now you can hit up `http://localhost:3000` for the Express.js server.

## API Endpoints 🛣️
>[!NOTE]  
>**Quick Note:** In the YouTube URL `https://www.youtube.com/watch?v=vFQ1EcdTdrI&list=PLRBp0Fe2GpgnRZpKULnyDQv9e_q41M6St`, the YouTube ID is the part after `v=`, which is `vFQ1EcdTdrI`. The playlist ID is after `list=`, which is `PLRBp0Fe2GpgnRZpKULnyDQv9e_q41M6St`. You’ll use these IDs for different API endpoints.

| Endpoint                             | What It Does                           |
|--------------------------------------|----------------------------------------|
| `/home`                              | Home sweet home endpoint               |
| `/search/musics?query={query}`      | Look for music based on your query    |
| `/search/albums?query={query}`      | Look for albums based on your query    |
| `/search/playlists?query={query}`   | Look for playlists based on your query |
| `/search/artists?query={query}`     | Look for artists based on your query   |
| `/music/{youtubeId}`                 | Get the lowdown on a music track by ID |
| `/playlists/{playlistId}`           | Get the scoop on a playlist/album by ID |
| `/artists/{artistId}`                | Find out about an artist by ID        |
| `/lyrics/{youtubeId}`                | Get lyrics based on a YouTube ID     |
| `/convert/{youtubeId}`               | Get the mp3 of the music streamed     |
| `/stream/{youtubeId}`                | Stream the audio                       |

### Local Development Requirements (for streaming only)
- [ffmpeg](https://ffmpeg.org/download.html) - It’s a free tool for dealing with video, audio, and other multimedia files.

If you think this project is cool or helpful, give it a ⭐️. It totally makes my day!