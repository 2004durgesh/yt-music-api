# YouTube Music API 🎶

🎵 This project is a robust YouTube Music API built with Express.js 🚀 and a carefully selected set of Node.js packages 📦 tailored for the YouTube Music ecosystem. As the main server, the API provides a wide range of features 🌟, making it easy to interact seamlessly with YouTube Music's extensive resources 🎶—all in one place.

## Getting Started 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js

### Installing

1. Clone the repository: `git clone https://github.com/2004durgesh/yt-music-api.git`

2. Install Node.js dependencies: `cd yt-music-api && npm install`

3. Start the Express.js server: `node index.js`

Now you can make requests to `http://localhost:3000` for the Express.js server.

## API Endpoints 🛣️
> **Note:** In the YouTube URL `https://www.youtube.com/watch?v=vFQ1EcdTdrI&list=PLRBp0Fe2GpgnRZpKULnyDQv9e_q41M6St`, the YouTube ID is the value after `v=`, which is `vFQ1EcdTdrI` in this case. The playlist ID is the value after `list=`, which is `PLRBp0Fe2GpgnRZpKULnyDQv9e_q41M6St` in this case. These IDs are used in various endpoints of the API.

| Endpoint                | Description                            |
|-------------------------|----------------------------------------|
| `/home`                 | Home endpoint                          |
| `/search/musics?query={query}`      | Search for music based on a query    |
| `/search/albums?query={query}`      | Search for albums based on a query   |
| `/search/playlists?query={query}`   | Search for playlists based on a query|
| `/search/artists?query={query}`     | Search for artists based on a query  |
| `/music/{youtubeId}`                  | Get details of a music by ID         |
| `/playlists/{playlistId}`           | Get details of a playlist/album by ID      |
| `/artists/{artistId}`               | Get details of an artist by ID       |
| `/lyrics/{youtubeId}`               | Get lyrics based on a YouTube ID     |
| `/convert/{youtubeId}`              | Get the mp3 music streamed           |
| `/stream/{youtubeId}`               | Get the audio streamed               |


### Requirements for local development (only for streaming)
- [ffmpeg](https://ffmpeg.org/download.html) - FFmpeg is a free and open-source project consisting of a vast software suite of libraries and programs for handling video, audio, and other multimedia files and streams.


If you find this project helpful or interesting, consider giving it a ⭐️ on GitHub. Your support is greatly appreciated!

Explore the possibilities, delve into the intricacies, and elevate your YouTube Music integration with our meticulously crafted Express.js-powered YouTube Music API. 🌟
