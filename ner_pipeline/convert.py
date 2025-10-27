import json
import random
import spacy
from spacy.tokens import DocBin

# converts annotated data into spaCy's binary training format
def convert_to_spacy_format(data, output_path):
    nlp_blank = spacy.blank("en") # create a blank English pipeline
    doc_bin = DocBin() # initialise a DocBin to store documents

    for entry in data:
        text = entry["text"]
        labels = entry.get("label", []) # list of (start, end, label) tuples
        doc = nlp_blank.make_doc(text)
        ents = []

        # create entity spans from character offsets
        for start, end, label in labels:
            span = doc.char_span(start, end, label=label, alignment_mode="contract")
            if span:
                ents.append(span)

        doc.ents = ents
        doc_bin.add(doc)

    # save binary DocBin to disk
    doc_bin.to_disk(output_path)
    print(f"Saved {len(data)} examples to {output_path}")

# randomly split data into training and development sets (80/20)
def split_data(data, train_ratio=0.8):
    random.shuffle(data)
    split = int(len(data) * train_ratio)
    return data[:split], data[split:]

if __name__ == "__main__":
    # load labelled examples from JSONL file
    with open("data/labelled.jsonl", "r", encoding="utf-8") as f:
        data = [json.loads(line) for line in f if line.strip()]

    train_data, dev_data = split_data(data)

    convert_to_spacy_format(train_data, "train.spacy")
    convert_to_spacy_format(dev_data, "dev.spacy")
