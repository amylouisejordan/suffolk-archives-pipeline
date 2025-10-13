![Suffolk Archives Banner](./assets/banner.png)

# 🗺️ Suffolk Archives NER Pipeline

![Status](https://img.shields.io/badge/Status-In_Progress-yellow)
![F-score](https://img.shields.io/badge/F--score-97%25-success)
![Module](https://img.shields.io/badge/Module-Information_Engineering-purple)

This project was developed for my **Information Engineering module** at university. It implements a Named Entity Recognition (NER) pipeline to automatically identify historically significant references in digitised map and document collections from **Suffolk Archives**. The goal is to enrich metadata and improve public access to archival content through semantic analysis and geospatial mapping.

The system includes a user interface with space to upload historical excerpts, view annotated entities, and explore geocoded facilities on an interactive map.
---

## ⚙️ How It's Made

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![spaCy](https://img.shields.io/badge/spaCy-NLP-green?logo=spacy)
![Doccano](https://img.shields.io/badge/Doccano-Annotation-orange?logo=data:image/svg+xml;base64,...)
![JSONL](https://img.shields.io/badge/Data-JSONL-lightgrey)
![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)
![Leaflet](https://img.shields.io/badge/Leaflet-Map-green?logo=leaflet)

The backend pipeline is built around **spaCy’s NER capabilities**. Historical map excerpts were annotated using **Doccano**, exported in `.jsonl` format, and converted into spaCy’s binary format (`.spacy`). The data was split into training and development sets, and a custom model was trained using spaCy’s configuration system.

The model recognizes seven historically relevant entity types:

 `MAP`, `DATE`, `PERSON`, `ORG`, `FACILITY`, `EVENT`, `GPE`


It achieved a **97–98% F-score** on real Suffolk map entries. The workflow supports batch processing, automation, and reproducibility — making it suitable for large-scale archival enrichment.

The frontend complements this pipeline by offering:
- A styled `TextInput` component for entering historical text
- Real-time annotation via Axios and the trained model
- A `FacilityMap` component that geocodes and displays recognized facilities using Leaflet
- Accessible UI with modular React architecture and archival-themed design

---

## 🛠️ How to Run It

Follow these steps to set up and run the NER pipeline locally:

### 1️. Install dependencies

```bash
pip install -r requirements.txt
```

### 2️. Convert annotated data

Make sure your annotated .jsonl file (e.g. labelled.jsonl) is in the `data/` folder.

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

### OPTIONAL. Test the Model

Use the trained model to extract entities from new text using the interactive Python terminal or a script. For example:

```python
import spacy
nlp = spacy.load("model/model-best")
doc = nlp("Extract from OS Provisional Map 1947, surveyed near Sudbury in 1911. Includes landmarks such as River Deben. Referenced in Suffolk Archives dated 13 March 1911. Thomas Elwood documented the cholera outbreak affecting the region.")
for ent in doc.ents:
    print(ent.text, ent.label_)
```

## 🖼️ Frontend Setup
The React interface is located in the `ui/` folder. It includes components for text input, entity display, and facility mapping.

To run the frontend locally:
```bash
cd ui
npm install
npm start
```

> Ensure the backend is running on localhost:5050 to enable annotation and geocoding.