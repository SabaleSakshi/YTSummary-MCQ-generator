from youtube_transcript_api import YouTubeTranscriptApi
from langdetect import detect
from urllib.parse import urlparse, parse_qs

def extract_video_id(url):
    query = urlparse(url).query
    params = parse_qs(query)
    return params['v'][0] if 'v' in params else None

def extract_transcript(video_url):
    try:
        video_id = extract_video_id(video_url)
        proxies = {'https': 'https://translate.google.com'}

        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'], proxies=proxies)
        except:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['hi'], proxies=proxies)

        text = " ".join([seg['text'] for seg in transcript])
        lang_code = detect(text)
        return text, lang_code
    except Exception as e:
        return f"Error: {str(e)}", None
