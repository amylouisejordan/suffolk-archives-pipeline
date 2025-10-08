import json

def annotate_texts(data, nlp, extractor) :
    annotated = []
    for entry in data:
        text = entry.get("text", "")
        entities = extractor(text, nlp)
        annotated.append({
            "original": text,
            "entities": entities
        })
    return annotated

def save_output(annotated, path="output/annotated_output.json"):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(annotated, f, indent=2, ensure_ascii=False)