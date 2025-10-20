# ner_pipeline/annotate.py
import sys
import spacy
import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "..", "model", "model-best")

# Load the custom trained spaCy model
nlp = spacy.load(model_path)

# Read input text from standard input (use converted text)
text = sys.stdin.read()

# Run the pipeline on the input text
doc = nlp(text)

# Extract entities as a list of dictionaries with text and label
entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]

# Output the entities as a JSON string
print(json.dumps(entities))
