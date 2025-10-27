import json
from collections import Counter
from wordcloud import WordCloud

with open('../data/annotated_entries.jsonl', 'r', encoding='utf-8') as f:
    entries = [json.loads(line) for line in f]

# count entity frequencies and track their labels
entity_freqs = Counter()
entity_labels = {}

for entry in entries:
    for entity in entry.get('entities', []):
        text = entity['text'].strip()
        label = entity['label']
        if text:
            entity_freqs[text] += 1
            entity_labels[text] = label

# colours for each entity type
label_colors = {
    "GPE": "crimson",
    "EVENT": "darkorange",
    "FACILITY": "rosybrown",
    "DATE": "forestgreen",
    "ORG": "royalblue",
    "PERSON": "mediumpurple",
    "MAP": "magenta"
}

# assign colour based on entity type
def color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    label = entity_labels.get(word, None)
    return label_colors.get(label, "gray")

# generate word cloud from frequencies
wordcloud = WordCloud(
    width=1200,
    height=800,
    background_color='white',
    prefer_horizontal=1.0,
    color_func=color_func
).generate_from_frequencies(entity_freqs)

wordcloud.to_file('./exports/entity_wordcloud.png')
