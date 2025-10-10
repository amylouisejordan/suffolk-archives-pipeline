import json
import random
import spacy
from spacy.tokens import DocBin

def convert_to_spacy_format(data, output_path):
    nlp_blank = spacy.blank("en")
    doc_bin = DocBin()

    for entry in data:
        text = entry["text"]
        labels = entry.get("label", [])
        doc = nlp_blank.make_doc(text)
        ents = []
        for start, end, label in labels:
            span = doc.char_span(start, end, label=label, alignment_mode="contract")
            if span:
                ents.append(span)
        doc.ents = ents
        doc_bin.add(doc)

    doc_bin.to_disk(output_path)
    print(f"Saved {len(data)} examples to {output_path}")

def split_data(data, train_ratio=0.8):
    random.shuffle(data)
    split = int(len(data) * train_ratio)
    return data[:split], data[split:]

if __name__ == "__main__":
    with open("data/labelled.jsonl", "r", encoding="utf-8") as f:
        data = [json.loads(line) for line in f if line.strip()]

    train_data, dev_data = split_data(data)

    convert_to_spacy_format(train_data, "train.spacy")
    convert_to_spacy_format(dev_data, "dev.spacy")
