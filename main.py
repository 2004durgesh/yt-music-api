from flask import Flask, request, jsonify
from pytube import YouTube
from flask_cors import CORS
import youtube_dl

app = Flask(__name__)
CORS(app, origins='*')

@app.route('/api/flask/convert', methods=['GET'])
def convert():
    youtubeId = request.args.get('youtubeId')

    if not youtubeId:
        return jsonify({"status": False, "error": "YouTube ID not specified"})

    try:
        # Get YouTube video info using pytube
        video_url = f'https://www.youtube.com/watch?v={youtubeId}'
        yt = YouTube(video_url)

        options = {
            'format': 'bestaudio/best',
            'extractaudio': True,  # only keep the audio
            'audioformat': 'mp3',  # convert to mp3
            'outtmpl': '%(id)s',  # save file as video ID
            'noplaylist': True,  # only download single song, not playlist
        }

        with youtube_dl.YoutubeDL(options) as ydl:
            info_dict = ydl.extract_info(video_url, download=False)
            audio_url_youtubedl = info_dict['formats'][0]['url']

            #only audio
            audio_url_pytube = yt.streams.get_audio_only().url
            # Get captions
            captions = yt.captions['en'] if 'en' in yt.captions else None
            captions_srt = captions.generate_srt_captions() if captions else "No captions available"
            captions_vtt = captions.generate_vtt_captions() if captions else "No captions available"

            # Return the audio stream URL and captions
            return jsonify({
                "status": True, 
                "audio_url_youtubedl": audio_url_youtubedl,
                "audio_url_pytube": audio_url_pytube,
                "captions_srt": captions_srt,
                "captions_vtt": captions_vtt
            })

    except Exception as e:
        return jsonify({"status": False, "error": str(e)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8888)
