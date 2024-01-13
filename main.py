from flask import Flask, request, jsonify
from pytube import YouTube
from flask_cors import CORS
import requests  # Don't forget to import requests

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

        # Get the audio stream URL
        audio_stream_url = yt.streams.filter(only_audio=True).first().url

        # Get all audio stream URLs
        all_audio_stream_urls = [stream.url for stream in yt.streams.filter(only_audio=True)]
        #only audio
        get_audio_only_url = yt.streams.get_audio_only().url
        # Get captions
        captions = yt.captions['en'] if 'en' in yt.captions else None
        captions_srt = captions.generate_srt_captions() if captions else "No captions available"
        captions_vtt = captions.generate_vtt_captions() if captions else "No captions available"

        # Return the audio stream URL and captions
        return jsonify({
            "status": True, 
            "audio_stream_url": audio_stream_url,
            "all_audio_stream_urls": all_audio_stream_urls,
            "get_audio_only_url": get_audio_only_url,
            "captions_srt": captions_srt,
            "captions_vtt": captions_vtt
        })

    except Exception as e:
        return jsonify({"status": False, "error": str(e)})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8888)
