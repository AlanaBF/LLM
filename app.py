from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the quantized model and tokenizer
model_dir = "t5-large"  # Use the original model directory for tokenizer
quantized_model_path = "quantized_t5_large.pth"  # Path to the quantized model state dictionary

print("Loading the tokenizer...")
tokenizer = T5Tokenizer.from_pretrained(model_dir)

print("Loading the model...")
model = T5ForConditionalGeneration.from_pretrained(model_dir)

print("Loading the quantized model state dictionary...")
try:
    quantized_state_dict = torch.load(quantized_model_path, weights_only=True)
    model.load_state_dict(quantized_state_dict)
    print("Quantized model state dictionary loaded successfully.")
except Exception as e:
    print(f"Error loading quantized model state dictionary: {e}")

# Set the quantization backend
torch.backends.quantized.engine = 'qnnpack'

# Apply dynamic quantization to the model
print("Applying dynamic quantization...")
try:
    model = torch.quantization.quantize_dynamic(
        model, {torch.nn.Linear}, dtype=torch.qint8
    )
    print("Quantized model loaded successfully.")
except Exception as e:
    print(f"Error during quantization: {e}")

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    try:
        # Get the input prompt from the request
        data = request.get_json()
        input_text = data['prompt']
        print(f"Received prompt: {input_text}")  # Debugging statement
        
        # Encode the input and generate the output
        input_ids = tokenizer(input_text, return_tensors="pt").input_ids
        print(f"Input IDs: {input_ids}")  # Debugging statement
        
        outputs = model.generate(
                input_ids,
                max_new_tokens=50,
                num_beams=5,
                temperature=0.7,    # You can experiment with different values
                top_p=0.9,          # Adjust as needed
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

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)