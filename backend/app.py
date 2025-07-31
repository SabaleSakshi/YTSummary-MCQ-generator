from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transcript_utils import extract_transcript
from mcq_generator import generate_summary_and_mcqs
import os

# Important: use correct relative path to frontend
frontend_folder = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build')  # Vite
# If using Create React App, replace 'dist' with 'build'

app = Flask(__name__, static_folder=frontend_folder, static_url_path="/")
CORS(app)

@app.route("/api/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        if not data or "url" not in data:
            return jsonify({"error": "No URL provided"}), 400

        video_url = data["url"]

        transcript, lang = extract_transcript(video_url)
        if "Error" in transcript:
            return jsonify({"error": transcript}), 500

        result = generate_summary_and_mcqs(transcript, lang)
        return jsonify({"language": lang, "output": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve frontend files
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)
