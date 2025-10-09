![Suffolk Archives Banner](./assets/banner.png)


# 🗺️ Suffolk Archives NER Pipeline

This project was developed for my **Information Engineering module** at university. It implements a Named Entity Recognition (NER) pipeline to automatically identify key historical references in digitised map and document collections from **Suffolk Archives**. The goal is to enrich metadata and improve public access to archival content through semantic analysis.

---

## ⚙️ How It's Made

**Tech used:** Python 🐍, spaCy 🤖, Doccano 📝, JSONL 📄

This pipeline is built around spaCy’s NER capabilities. I began by annotating historical map text using Doccano and exported the data in `.jsonl` format. I wrote a conversion script to transform these annotations into spaCy’s binary format (`.spacy`), split the data into training and dev sets, and trained a custom NER model using spaCy’s CLI and configuration system.

The model was trained to recognize seven historically relevant entity types: `MAP`, `DATE`, `PERSON`, `ORG`, `FACILITY`, `EVENT`, `GPE`

It achieved a **97–98% F-score** on real Suffolk map entries. The workflow supports batch processing, automation, and reproducibility.

---

## 🛠️ How to Run It

Follow these steps to set up and run the NER pipeline locally:

### 1️. Install dependencies

```bash
pip install -r requirements.txt
```

Or manually:

```bash
pip install spacy tqdm
```

### 2️. Convert annotated data
Make sure your annotated .jsonl file (e.g. admin.jsonl) is in the `data/` folder.

```bash
python convert.py
```

This will generate:
`train.spacy` and `dev.spacy`

### 3️. Train the model
```bash
python -m spacy train config.cfg --output ./model \
  --paths.train ./train.spacy \
  --paths.dev ./dev.spacy
```

### 4️. Test the Model

Use the trained model to extract entities from new text using the interactive Python terminal or a script. For example:

```python
import spacy
nlp = spacy.load("model/model-best")
doc = nlp("Extract from OS Provisional Map 1947, surveyed near Sudbury in 1911. Includes landmarks such as River Deben. Referenced in Suffolk Archives dated 13 March 1911. Thomas Elwood documented the cholera outbreak affecting the region.")
for ent in doc.ents:
    print(ent.text, ent.label_)
```