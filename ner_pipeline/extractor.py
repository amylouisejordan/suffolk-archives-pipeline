import spacy

def load_nlp():
    nlp = spacy.load("en_core_web_sm")
    ruler = nlp.add_pipe("entity_ruler", before="ner")
    ruler.from_disk("patterns/custom_patterns.jsonl")
    return nlp

def extract_entities(text, nlp):
    doc = nlp(text)
    return [(ent.text, ent.label_) for ent in doc.ents]