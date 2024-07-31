from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from transformers import T5Tokenizer, T5ForConditionalGeneration

# Load the tokenizer and model at the start, so they're ready to use when requests come in.
tokenizer = T5Tokenizer.from_pretrained("t5-base")
model = T5ForConditionalGeneration.from_pretrained("t5-base")

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    try:
        # Get the input prompt from the request
        data = request.get_json()
        input_text = data['prompt']
        
        # Encode the input and generate the output
        input_ids = tokenizer(input_text, return_tensors="pt").input_ids
        outputs = model.generate(
            input_ids,
            max_new_tokens=50,  # Increase for longer outputs
            temperature=0.7,    # Adjust for creative control
            top_p=0.9,          # Nucleus sampling
            do_sample=True      # Enable sampling for diverse outputs
        )
        
        # Decode and return the response
        response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
        
        print(f"Prompt: {input_text}")
        print(f"Response: {response}")
        
        return jsonify({"response": response})
    
    except Exception as e:
        # Handle errors
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
