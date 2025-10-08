from ner_pipeline.extractor import load_nlp, extract_entities
from ner_pipeline.annotator import annotate_texts, save_output
from ner_pipeline.utils import load_json

def main():
    data = load_json("data/input.json")
    nlp = load_nlp()
    annotated = annotate_texts(data, nlp, extract_entities)
    save_output(annotated)
    
if __name__ == "__main__":
    main()