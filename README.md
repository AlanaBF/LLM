# LeTraducteur (the translator)

This repository contains a Chatbot Translator application that leverages the `t5-large` model from Hugging Face for translating text from English to French. The app is built using Flask for the backend and serves a simple HTML/CSS frontend. Future iterations plan to upgrade the frontend using Vite with React and maintain a Python backend.

## Folder Structure

├── static

│ ├── css

│ │ └── style.css # CSS styles for the frontend

│ └── images # Contains all static images used in the app

├── templates

│ └── index.html # The main HTML file served by Flask

├── app.py # Flask backend serving the translation service

├── Dockerfile # Docker configuration (not currently used)

├── quantization.ipynb # Notebook for quantizing the t5-large model

├── quantized_t5_large.pth # Quantized model state dictionary

├── README.md # This README file

├── requirements.txt # Python dependencies


## Installation

### Prerequisites

- Python 3.8+
- `pip` package manager

### Setup

1. **Clone the repository**

        ```sh
        git clone https://github.com/AlanaBF/LLM
        cd LLM
        ```

2. **Create and activate a virtual environment**

        ```sh
        python3 -m venv venv
        source venv/bin/activate  # On Windows use `venv\Scripts\activate`
        ```

3. **Install dependencies**

        ```sh
        pip install -r requirements.txt
        ```

4. **Generate the Quantized Model**

        Note: The quantized model file (quantized_t5_large.pth) is not included in the repository due to its size. You will need to generate it by running the provided Jupyter notebook.

        #### Steps to Generate the Model:

        ##### Open the Jupyter Notebook:

        Navigate to the root of the cloned repository and open the quantization.ipynb notebook using Jupyter:

        ```sh
        jupyter notebook quantization.ipynb
        ```

        ##### Run the Notebook:

        Execute the cells in the notebook. This will:
        - Load the t5-large model.
        - Apply dynamic quantization to the model.
        - Save the quantized model as quantized_t5_large.pth in the appropriate directory.
        Verify the Model:
        - Ensure that the quantized_t5_large.pth file is created successfully.

5. **Set Up and Run the Flask App**

        With the quantized model in place, you can now run the Flask application.

        ```sh
        python app.py
        ```

        The app should now be running on http://127.0.0.1:5000.

## Usage

### Current Features

Translation: The app accepts English text input and translates it into French using a quantized t5-large model from Hugging Face.
Frontend: A simple interface for interacting with the chatbot, allowing users to input text and view translated results.

### Accessing the App

Open your web browser and go to http://127.0.0.1:5000.
Interact with the chatbot by typing English text into the input field. Prompt: "Translate to French:'Insert text here'"
The translated text in French will be displayed in the chat interface.

### Future Development

In the next iteration of this project, the following improvements will be made:

#### Frontend

Vite + React: The current HTML/CSS frontend will be replaced with a modern React-based frontend built with Vite for improved development experience and performance.

#### Backend

Python Flask API: The Flask backend will be restructured to serve the React frontend and handle API requests for translation.

#### Docker Support

Dockerize the App: The Dockerfile will be updated to support containerization of both the frontend and backend, making the app easier to deploy across different environments.

## Model Quantization

The quantization.ipynb notebook demonstrates how the t5-large model was quantized to reduce its size and improve inference speed. The quantized model is saved as quantized_t5_large.pth and loaded in app.py.

### Quantization Process

Load the t5-large model from Hugging Face.
Apply dynamic quantization to reduce the model's size and improve performance.
Save the quantized model to quantized_t5_large.pth.

### Dependencies

All dependencies are listed in requirements.txt. Key dependencies include:

Flask: Web framework used for serving the app.
transformers: Hugging Face library for the T5 model.
torch: PyTorch library, used for loading and running the model.

## License
This project is licensed under the MIT License - see the LICENSE file for details.