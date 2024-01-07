from flask import Flask, request, jsonify
from pytube import YouTube
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins='*')

@app.route('/api/flask/convert', methods=['GET'])
def convert():
    youtube_id = request.args.get('youtube_id')

    if not youtube_id:
        return jsonify({"status": False, "error": "YouTube ID not specified"})

    try:
        # Get YouTube video info using pytube
        video_url = f'https://www.youtube.com/watch?v={youtube_id}'
        yt = YouTube(video_url)

        # Get the audio stream URL
        audio_stream_url = yt.streams.filter(only_audio=True).first().url

        # Return the audio stream URL
        return jsonify({"status": True, "audio_stream_url": audio_stream_url})

    except Exception as e:
        return jsonify({"status": False, "error": str(e)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8888)
