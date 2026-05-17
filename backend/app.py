from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
from transformers import MarianMTModel, MarianTokenizer
from openai import OpenAI, RateLimitError, AuthenticationError, APIError
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_folder='static/dist', static_url_path='')
CORS(app)

# --- Translation Models ---
models = {}
tokenizers = {}

MODEL_NAMES = {
    'de': 'Helsinki-NLP/opus-mt-en-de',
    'fr': 'Helsinki-NLP/opus-mt-en-fr',
    'es': 'Helsinki-NLP/opus-mt-en-es',
    'it': 'Helsinki-NLP/opus-mt-en-it',
}

print("Loading translation models...")
for lang, model_name in MODEL_NAMES.items():
    print(f"  Loading {model_name}...")
    tokenizers[lang] = MarianTokenizer.from_pretrained(model_name)
    models[lang] = MarianMTModel.from_pretrained(model_name)
print("Models loaded successfully.")

# --- OpenAI Client ---
openai_api_key = os.environ.get("OPENAI_API_KEY")
openai_client = OpenAI(api_key=openai_api_key) if openai_api_key else None

# --- Conversation Scenarios ---
LANGUAGE_NAMES = {"fr": "French", "de": "German", "es": "Spanish", "it": "Italian"}

SCENARIOS = {
    "restaurant": {
        "fr": "You are a French waiter at a Parisian bistro called 'Le Petit Chat'. You are friendly and patient.",
        "de": "You are a German waiter at a traditional Bavarian restaurant called 'Zum Goldenen Hirsch'. You are friendly and patient.",
        "es": "You are a Spanish waiter at a tapas bar called 'El Rincón' in Madrid. You are friendly and patient.",
        "it": "You are an Italian waiter at a trattoria called 'La Bella Vita' in Rome. You are friendly and patient.",
    },
    "directions": {
        "fr": "You are a helpful Parisian local standing near the Eiffel Tower. Someone is asking you for directions.",
        "de": "You are a helpful local in central Berlin near Alexanderplatz. Someone is asking you for directions.",
        "es": "You are a helpful local in central Madrid near the Puerta del Sol. Someone is asking you for directions.",
        "it": "You are a helpful local in Rome near the Colosseum. Someone is asking you for directions.",
    },
    "job_interview": {
        "fr": "You are a hiring manager at a French tech company conducting a job interview in French.",
        "de": "You are a hiring manager at a German engineering company conducting a job interview in German.",
        "es": "You are a hiring manager at a Spanish tech startup conducting a job interview in Spanish.",
        "it": "You are a hiring manager at an Italian design firm conducting a job interview in Italian.",
    },
    "shopping": {
        "fr": "You are a friendly shopkeeper at a clothing boutique in Lyon.",
        "de": "You are a friendly shopkeeper at a clothing store in Munich.",
        "es": "You are a friendly shopkeeper at a clothing boutique in Barcelona.",
        "it": "You are a friendly shopkeeper at a fashion boutique in Milan.",
    },
    "hotel": {
        "fr": "You are a receptionist at a boutique hotel in Nice, France.",
        "de": "You are a receptionist at a hotel in Vienna, Austria.",
        "es": "You are a receptionist at a beachfront hotel in Barcelona, Spain.",
        "it": "You are a receptionist at a boutique hotel in Florence, Italy.",
    },
}


DIFFICULTY_INSTRUCTIONS = {
    "beginner": """DIFFICULTY: BEGINNER
- Use simple, common vocabulary only. Avoid idioms or complex grammar.
- Keep responses SHORT (1-2 sentences max).
- Speak as if to a tourist who knows only basic phrases.
- Proactively offer helpful phrases the learner might need next.""",
    "intermediate": """DIFFICULTY: INTERMEDIATE
- Use normal conversational language (2-3 sentences).
- Include some complex grammar structures naturally.
- Don't simplify too much — challenge the learner slightly.""",
    "advanced": """DIFFICULTY: ADVANCED
- Use natural native-level language with idioms, slang, and complex structures.
- Speak as you would to a fluent speaker (3-4 sentences).
- Use culturally specific references and nuanced expressions.
- Minimal hand-holding — expect the learner to keep up.""",
}

TTS_VOICES = {"fr": "nova", "de": "onyx", "es": "nova", "it": "alloy"}


def extract_section(content: str, section: str) -> str | None:
    """Extract text between [SECTION] and [/SECTION] tags. Returns None if not found."""
    start_tag = f"[{section}]"
    end_tag = f"[/{section}]"
    if start_tag in content and end_tag in content:
        return content.split(start_tag)[1].split(end_tag)[0].strip()
    return None


def build_system_prompt(language: str, scenario: str, difficulty: str = "intermediate") -> str:
    lang_name = LANGUAGE_NAMES[language]
    scenario_context = SCENARIOS[scenario][language]
    difficulty_text = DIFFICULTY_INSTRUCTIONS.get(difficulty, DIFFICULTY_INSTRUCTIONS["intermediate"])

    return f"""You are a language learning assistant for {lang_name} conversation practice.

ROLE: {scenario_context}

{difficulty_text}

RULES:
1. Always respond IN {lang_name.upper()} as your character. Stay in the scenario.
2. If the user makes grammar, spelling, or vocabulary mistakes in their {lang_name}, identify them.
3. Format your response EXACTLY as follows:

[REPLY]
Your in-character response in {lang_name} here.
[/REPLY]
[TRANSLATION]
English translation of your reply above.
[/TRANSLATION]
[CORRECTION]
If there are mistakes, explain them here IN ENGLISH. Use format: "You wrote X - it should be Y because Z". If no mistakes, write "none".
[/CORRECTION]
[FEEDBACK]
Brief feedback IN ENGLISH on how natural and appropriate the user's response was. Rate it with stars: ⭐ (needs work) / ⭐⭐ (good attempt) / ⭐⭐⭐ (excellent/native-like). Comment on fluency, word choice, and whether a native speaker would say it that way. If this is the opening message (no user input yet), write "none".
[/FEEDBACK]

4. Be encouraging. This is a learning environment.
5. If the user writes in English, gently remind them (in {lang_name}) to try writing in {lang_name}, but still respond to their intent."""


# --- Routes ---

@app.route('/', methods=['GET'])
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    try:
        data = request.get_json()
        input_text = data['prompt']
        target_language = data.get('language', 'de')

        if target_language not in models:
            return jsonify({"error": "Unsupported language"}), 400

        tokenizer = tokenizers[target_language]
        model = models[target_language]

        inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True)
        outputs = model.generate(
            **inputs,
            max_new_tokens=250,
            num_beams=5,
            early_stopping=True
        )

        response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
        return jsonify({"response": response})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/conversation', methods=['POST'])
def handle_conversation():
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        language = data.get('language', 'fr')
        scenario = data.get('scenario', 'restaurant')
        difficulty = data.get('difficulty', 'intermediate')

        if not openai_client:
            return jsonify({"error": "OPENAI_API_KEY not configured. Add it to your .env file."}), 500
        if language not in LANGUAGE_NAMES:
            return jsonify({"error": "Unsupported language"}), 400
        if scenario not in SCENARIOS:
            return jsonify({"error": "Unknown scenario"}), 400

        system_prompt = build_system_prompt(language, scenario, difficulty)

        openai_messages = [{"role": "system", "content": system_prompt}]

        if not messages:
            openai_messages.append({
                "role": "user",
                "content": "Please greet me and start the conversation in character. Keep it short and welcoming."
            })
        else:
            openai_messages.extend(messages)

        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=openai_messages,
            max_tokens=500,
            temperature=0.7,
        )

        content = response.choices[0].message.content

        reply = extract_section(content, "REPLY") or content
        translation = extract_section(content, "TRANSLATION") or ""
        correction = extract_section(content, "CORRECTION") or ""
        feedback = extract_section(content, "FEEDBACK") or ""

        if correction.lower() == "none":
            correction = ""
        if feedback.lower() == "none":
            feedback = ""

        return jsonify({"reply": reply, "correction": correction, "translation": translation, "feedback": feedback})

    except RateLimitError as e:
        print(f"OpenAI quota/rate limit: {str(e)}")
        return jsonify({"error": "quota_exceeded", "message": "The AI conversation feature is temporarily unavailable — the API usage limit has been reached. Translation still works! Please try again later."}), 429
    except AuthenticationError:
        return jsonify({"error": "auth_error", "message": "OpenAI API key is invalid or expired."}), 401
    except APIError as e:
        print(f"OpenAI API error: {str(e)}")
        return jsonify({"error": "api_error", "message": "The AI service is temporarily unavailable. Please try again in a moment."}), 502
    except Exception as e:
        print(f"Conversation error: {str(e)}")
        return jsonify({"error": "server_error", "message": "Something went wrong. Please try again."}), 500


@app.route('/speak', methods=['POST'])
def handle_speak():
    try:
        if not openai_client:
            return jsonify({"error": "OPENAI_API_KEY not configured"}), 500

        data = request.get_json()
        text = data.get('text', '')
        language = data.get('language', 'fr')

        if not text:
            return jsonify({"error": "No text provided"}), 400

        voice = TTS_VOICES.get(language, "nova")

        response = openai_client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text,
        )

        return Response(response.content, mimetype="audio/mpeg")

    except RateLimitError:
        return jsonify({"error": "quota_exceeded", "message": "TTS unavailable — API usage limit reached."}), 429
    except (AuthenticationError, APIError) as e:
        print(f"TTS API error: {str(e)}")
        return jsonify({"error": "api_error", "message": "Speech service temporarily unavailable."}), 502
    except Exception as e:
        print(f"TTS error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/<path:path>', methods=['GET'])
def serve_static_files(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 7860)))
