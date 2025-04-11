import sys
import json
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Load the summarization model
model_name = "facebook/bart-large-cnn"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# Log messages for debugging
print("Model loaded successfully", file=sys.stderr)
print("Starting Python script...", file=sys.stderr)

# Parse input paragraphs from command-line arguments
try:
    input_data = sys.argv[1]  # Input is passed as a JSON string
    paragraphs = json.loads(input_data)  # Convert JSON string to list
except Exception as e:
    print(f"Error parsing input: {e}", file=sys.stderr)
    sys.exit(1)

def summarize(paragraphs):
    # Split paragraphs into manageable chunks
    chunk_size = 5
    chunks = [" ".join(paragraphs[i:i + chunk_size]) for i in range(0, len(paragraphs), chunk_size)]
    summaries = []
    for chunk in chunks:
        inputs = tokenizer.encode("summarize: " + chunk, return_tensors="pt", max_length=1024, truncation=True)
        summary_ids = model.generate(
            inputs, max_length=75, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True
        )
        summaries.append(tokenizer.decode(summary_ids[0], skip_special_tokens=True))
    
    # Combine summaries and create a final summary
    combined_text = " ".join(summaries)
    final_inputs = tokenizer.encode("summarize: " + combined_text, return_tensors="pt", max_length=1024, truncation=True)
    final_summary_ids = model.generate(
        final_inputs, max_length=100, min_length=50, length_penalty=2.0, num_beams=4, early_stopping=True
    )
    return tokenizer.decode(final_summary_ids[0], skip_special_tokens=True)

# Generate and return the summary
try:
    summary = summarize(paragraphs)
    print(json.dumps({"summary": summary}))  # Output the summary as JSON
except Exception as e:
    print(f"Error during summarization: {e}", file=sys.stderr)
    sys.exit(1)
