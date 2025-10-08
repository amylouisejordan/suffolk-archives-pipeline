import spacy
from spacy.cli.train import train
from pathlib import Path

config_path = Path("config.cfg")
output_dir = Path("output")
train_data_path = Path("training/training_data.spacy")
dev_data_path = Path("training_data.spacy")

output_dir.mkdir(exist_ok=True)

train(config_path, output_dir, overrides={
    "paths.train": str(train_data_path),
    "paths.dev": str(dev_data_path)
})

print(f"Training complete. Model saved to {output_dir}")