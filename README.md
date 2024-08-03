# 🇬🇧 LeTraducteur 🇫🇷 DerÜbersetzer 🇩🇪

## The EN ↔ FR | DE Bridge Translator

This repository contains a Chatbot Translator application that leverages the `t5-large` model from Hugging Face for translating text from English to French. The app is built using Flask for the backend and serves a Vite React Typescript frontend with Tailwind CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [🇬🇧 LeTraducteur 🇫🇷 DerÜbersetzer 🇩🇪](#-letraducteur--derübersetzer-)
  - [The EN ↔ FR | DE Bridge Translator](#the-en--fr--de-bridge-translator)
  - [Table of Contents](#table-of-contents)
  - [Technology Used](#technology-used)
  - [Screenshots](#screenshots)
  - [Folder Structure](#folder-structure)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
  - [Usage](#usage)
    - [Current Features](#current-features)
    - [Accessing the App](#accessing-the-app)
  - [Model Quantization](#model-quantization)
    - [Quantization Process](#quantization-process)
    - [Dependencies](#dependencies)
  - [License](#license)
  - [Questions](#questions)

## Technology Used

The portfolio website is built using the following technologies:

- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![HTML Badge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
- ![CSS Badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![Python](https://img.shields.io/badge/python-%2314354C.svg?style=for-the-badge&logo=python&logoColor=white)
- ![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white)
- ![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFC107?style=for-the-badge&logo=hugging-face&logoColor=black)

## Screenshots

![Home Page Blank](/backend/static/dist/assets/Screenshot1.png)

![Home Page Example](/backend/static/dist/assets/Screenshot2.png)

## Folder Structure

- **LLM/**: The root directory of the project.
  - **backend/**: Contains backend-related files and directories.
    - **static/**: Holds static files served by Flask.
    - **dist/**: The directory containing the compiled frontend.
      - **assets/**: Directory for static assets like images, etc.
      - **index.html**: Main HTML file for the Flask server.
    - **app.py**: The Flask backend application file.
    - **quantization.ipynb**: Jupyter notebook for quantizing the T5 model.
    - **quantized_t5_large.pth**: The quantized T5 model state dictionary.
    - **requirements.txt**: Python dependencies required for the backend.
  - **evaluation/**: Directory for evaluation-related content for testing the app.
  - **frontend/**: Contains the React frontend project.
    - **LeTraducteur/**: The root of the React project.
      - **public/**: Contains public static files.
        - **assets/**: Static assets for the React frontend.
      - **src/**: Source files for the React application.
        - **components/**: Contains individual React components.
          - **Chatbot.tsx**: Component for the chatbot interface.
          - **Footer.tsx**: Component for the footer.
          - **Navbar.tsx**: Component for the navigation bar.
        - **App.css**: CSS for styling the main app component.
        - **App.tsx**: Main React component.
        - **index.css**: Global CSS styles.
        - **main.tsx**: Entry point for the React application.
        - **index.html**: HTML template for the React application.
- **LICENSE**: The license file for the project.
- **README.md**: The README file with project documentation.

## Installation

### Prerequisites

- Python 3.11
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
        cd backend
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

Translation: The app accepts English text input and translates it into French or German using a quantized t5-large model from Hugging Face.
Frontend: A simple interface for interacting with the chatbot, allowing users to input text and view translated results.

### Accessing the App

1. Open your web browser and navigate to [the local app](http://127.0.0.1:5000).
2. Select whether you want to translate to German or French.
3. Interact with the chatbot by typing English text into the input field.
4. The translated text in French or German will be displayed in the chat interface.

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

## Questions

Thank you for visiting my Translator App. I look forward to hearing from you. If you have any questions or need further assistance, please contact me:

- Email: [alanabarrett-frew@hotmail.com](mailto:alanabarrett-frew@hotmail.com)
- Website: [www.alanabarrettfrew.com](https://www.alanabarrettfrew.com)
- Github: [AlanaBF](https://github.com/AlanaBF)