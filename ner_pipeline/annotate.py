# ner_pipeline/annotate.py
import sys
import spacy
import json
import os

# Load model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "..", "model", "model-best")
nlp = spacy.load(model_path)

# Read full text from stdin
text = sys.stdin.read()
doc = nlp(text)

entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
print(json.dumps(entities))
