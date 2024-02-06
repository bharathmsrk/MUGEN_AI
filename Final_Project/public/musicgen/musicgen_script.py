# This code creates a server using flask to make API calls to uberduck. Not using flask in my final code.

import requests
from flask import Flask, request, render_template, jsonify, make_response, redirect, url_for
from IPython.display import Audio
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# API Key
uberduck_auth = ("xxx", "xxx")

# Define the route to display the form
@app.route('/')
def music_form():
    return render_template('main.html')

# Define the route to handle form submission and generate music
@app.route('/generate_music', methods=['POST'])
def generate_music():
    try:
        print(request.form)
        generation = request.form['generation']
        subject = request.form['subject']
        lyrics = request.form['lyrics']
        background_track_uuid = request.form['background']
        voice = request.form['voice']
        bpm = request.form['speed']

        # lyrics_array = list(list(lyrics.split(",")))
        lyrics_array = [line.split(",") for line in lyrics.split("\n")]
        print(lyrics_array)

        if not subject:
            return "Subject is required", 400

        # Make API requests to generate music based on user input
        if generation == 'auto':
            print("Auto generation selected")
            # Automatic generation
            output = requests.post(
                "https://api.uberduck.ai/tts/freestyle",
                json=dict(subject=subject, bpm=144, backing_track="84a34767-12c0-4dc0-aa64-c292ac7d13c9", voice="zwf"),
                auth=uberduck_auth,
            )
            print(output)
            response_data = output.json()["mix_url"]
            print(response_data)
        else:
            print("Manual generation selected")
            # Manual generation
            lyrics_data = [lyrics.split('\n')] 
            output = requests.post(
                "https://api.uberduck.ai/tts/freestyle",
                # json=dict(lyrics=lyrics_data, bpm=bpm, backing_track=background_track_uuid, voice=voice),
                json=dict(lyrics=lyrics_array, voicemodel_uuid=voice, backing_track=background_track_uuid, bpm=bpm),
                auth=uberduck_auth,
            )

            print("Response Status Code:", output.status_code)
            print("Response Content:", output.text)

            response_data = output.json()
            print(response_data)

        if output.status_code != 200:
            return jsonify({'error': f'Request failed with status code {output.status_code}'}), output.status_code

        try:
            response_data = output.json()
        except ValueError:
            return jsonify({'error': 'Non-JSON response'}), 500

        if 'error' in response_data:
            return jsonify({'error': response_data['error']}), 500

        audio_url = response_data.get("mix_url")
        if audio_url:
            return audio_url
        else:
            return "Failed to generate music."

    except Exception as e:
        return str(e), 500


if __name__ == '__main__':
    app.run()
