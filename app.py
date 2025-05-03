from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)

# Load the model and vectorizer
model = joblib.load('cyberbullying_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

# Prediction labels (Updated to only Offensive and Non-offensive)
prediction_map = {
    0: 'Non-offensive',
    1: 'Offensive'
}

@app.route('/')
def index():
    return render_template('index.html')  # Ensure index.html is in /templates

@app.route('/chat')
def chat():
    return render_template('chat.html')  # Ensure chat.html is in /templates

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Get JSON data
    text = data.get('message', '')  # Extract message text

    # Preprocess the text
    text_cleaned = clean_text(text)
    
    # Vectorize the text using the loaded vectorizer
    text_tfidf = vectorizer.transform([text_cleaned])
    
    # Make the prediction
    prediction = model.predict(text_tfidf)

    # Log the raw prediction value and cleaned message
    print(f"Message: {text}")
    print(f"Cleaned message: {text_cleaned}")
    print(f"Raw Prediction: {prediction[0]}")  # Print the raw prediction
    
    # Map prediction to human-readable label (Offensive or Non-offensive)
    prediction_label = prediction_map.get(prediction[0], "Non-offensive")  # Default to 'Non-offensive'
    
    # Return the prediction as JSON
    return jsonify({'prediction': prediction_label, 'message': text, 'cleaned_message': text_cleaned})

def clean_text(text):
    text = re.sub(r'\W', ' ', text)  # Remove special characters
    text = text.lower()  # Convert to lowercase
    print(f"Cleaned Text: {text}")  # Debug print
    return text

if __name__ == '__main__':
    import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Required by Render
    app.run(debug=True, host='0.0.0.0', port=port)

