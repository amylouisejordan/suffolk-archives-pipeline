import sys
import spacy
import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "..", "model", "model-best")

# load custom trained spaCy model
nlp = spacy.load(model_path)

# read input text from standard input
text = sys.stdin.read()

# run pipeline on input text
doc = nlp(text)

# extract entities as list of dictionaries with text and label
entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]

print(json.dumps(entities))
