from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch
import platform
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

# Ensure the token is being loaded
token = os.getenv("HF_AUTH_TOKEN")
if not token:
    raise ValueError("Hugging Face token is not set in the environment.")

# Initialize Flask app
app = Flask(__name__, static_folder='static/dist', static_url_path='')
CORS(app)

# Set the quantization backend based on the platform
current_platform = platform.system()
if current_platform == 'Darwin':  # macOS
    torch.backends.quantized.engine = 'qnnpack'
elif current_platform == 'Windows':  # Windows
    torch.backends.quantized.engine = 'fbgemm'
else:
    print("Unsupported platform for quantization engine")

# Define model and tokenizer paths
model_name = "AlanaBF/abf_quantized_t5_large"  # Model on Hugging Face Hub
tokenizer_name = "t5-large"  # Use the original tokenizer path

# Load the tokenizer
print("Loading the tokenizer...")
try:
    tokenizer = T5Tokenizer.from_pretrained(tokenizer_name, token=token)
except Exception as e:
    print(f"Error loading tokenizer: {e}")
    raise

# Load the quantized model directly from Hugging Face
print("Loading the quantized model...")
try:
    model = T5ForConditionalGeneration.from_pretrained(model_name, token=token)
except Exception as e:
    print(f"Error loading model: {e}")
    raise

# Serve React App
@app.route('/', methods=['GET'])
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    try:
        # Get the input prompt and language from the request
        data = request.get_json()
        input_text = data['prompt']
        target_language = data.get('language', 'de')  # Default to German if no language provided

        # Create the translation prompt, ensuring the language is correctly specified
        if target_language == 'de':
            translation_prompt = f"translate English to German: {input_text}"
        elif target_language == 'fr':
            translation_prompt = f"translate English to French: {input_text}"
        else:
            return jsonify({"error": "Unsupported language"}), 400

        print(f"Received prompt: {translation_prompt}")  # Debugging statement

        # Encode the input and generate the output
        input_ids = tokenizer(translation_prompt, return_tensors="pt").input_ids
        print(f"Input IDs: {input_ids}")  # Debugging statement

        outputs = model.generate(
            input_ids,
            max_new_tokens=250,
            num_beams=5,
            early_stopping=True
        )

        # Log raw outputs
        print(f"Raw outputs: {outputs}")  # Debugging statement

        # Decode and return the response
        response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
        print(f"Generated response: {response}")  # Debugging statement

        return jsonify({"response": response})

    except Exception as e:
        # Handle errors
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
# Serve static files (like JS, CSS, etc.)
@app.route('/<path:path>', methods=['GET'])
def serve_static_files(path):
    # This serves static files, including index.html for any unmatched routes
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=False)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))  # Default to 8080 if PORT is not set
    app.run(host="0.0.0.0", port=port)
