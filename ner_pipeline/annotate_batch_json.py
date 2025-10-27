import spacy
import json
import os

# load trained spaCy model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "..", "model", "model-best")
nlp = spacy.load(model_path)

input_path = os.path.join(script_dir, "..", "data", "input.json")
output_path = os.path.join(script_dir, "..", "data", "annotated_entries.jsonl")

# load input array
with open(input_path, 'r', encoding='utf-8') as f:
    raw_entries = json.load(f)

# annotate and write to JSONL
with open(output_path, 'w', encoding='utf-8') as out_file:
    for entry in raw_entries:
        text = entry.get("text", "").strip()
        if not text:
            continue
        doc = nlp(text)
        entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
        annotated = {"text": text, "entities": entities}
        out_file.write(json.dumps(annotated) + "\n")

print(f"Annotated {len(raw_entries)} entries to {output_path}")
