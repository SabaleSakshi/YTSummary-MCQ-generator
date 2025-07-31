import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

def clean_response_text(text):
    # Remove markdown fences and whitespace
    cleaned = text.replace("```json", "").replace("```", "").strip()

    # Remove invisible control characters (like \x00-\x1F) except \n and \t
    cleaned = re.sub(r'[\x00-\x09\x0b-\x0c\x0e-\x1f]', '', cleaned)

    # Try to correct single quotes to double quotes (if JSON is using wrong quotes)
    if not cleaned.strip().startswith("{"):
        cleaned = re.sub(r"(?<!\\)'", '"', cleaned)

    return cleaned

def generate_summary_and_mcqs(transcript, lang_code):
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = f"""
    You are an expert educational content creator with specialization in curriculum design and assessment creation. 
    Based on the following YouTube video transcript, please complete the tasks below with precision:

    Transcript:
    ---
    {transcript[:15000]}
    ---

    Tasks:
    
1. DETAILED POINTWISE SUMMARY:
- Create a comprehensive, well-structured summary of the key concepts
- Format as numbered points (1., 2., 3., etc.)
- Each point should be a complete, self-contained idea
- Maintain logical flow between points
- Include important definitions, principles, and relationships
- Use clear, concise academic language
- Length: 15-20 key points

  2. MCQ GENERATION:
Create 10 high-quality multiple choice questions with these characteristics:

QUESTION DESIGN:
- Focus on conceptual understanding, not factual recall
- Each question must test a distinct concept from the summary
- Randomize the correct answer position (don't pattern a,b,c,d)
- Make all distractors equally plausible
- Avoid trivial or obvious questions
- Include application-based questions where possible

DISTRACTOR RULES:
- 1 correct answer and 3 plausible distractors per question
- Distractors should be common misconceptions or partial truths
- Vary distractor types: opposites, generalizations, specific cases
- Ensure all options are grammatically consistent

   FORMAT REQUIREMENTS:
- Return ONLY pure JSON format without any additional text
- JSON structure:
{{
  "summary": [
    "1. First key point...",
    "2. Second key point...",
    ...
  ],
  "quiz": [
    {{
      "question": "...",
      "options": {{
        "a": "...",
        "b": "...", 
        "c": "...",
        "d": "..."
      }},
      "answer": "x",
      "explanation": "Brief explanation of why this is correct"
    }},
    ...
  ]
}}

  ADDITIONAL INSTRUCTIONS:
1. For the answer key, randomize positions (a-d) naturally
2. Ensure questions progress from basic to complex
3. Include at least 2 "scenario-based" questions
4. Add brief explanations for correct answers
5. Absolutely NO markdown formatting (```json or ```)
6. Validate the JSON before returning
"""


    try:
        response = model.generate_content(prompt)
        raw_text = response.text
        print("Raw Gemini response:", raw_text[:500])  # debug

        cleaned_response = clean_response_text(raw_text)

        # Try to parse the cleaned response to verify it's valid JSON
        json_obj = json.loads(cleaned_response)
        print("Valid JSON structure")

        return json.dumps(json_obj)  # Return proper JSON string to frontend

    except json.JSONDecodeError as json_err:
        print("JSON decoding failed:", json_err)
        return json.dumps({"error": f"Invalid JSON format from Gemini: {str(json_err)}"})

    except Exception as e:
        print("Error occurred:", e)
        return json.dumps({"error": f"Error generating MCQs: {str(e)}"})
