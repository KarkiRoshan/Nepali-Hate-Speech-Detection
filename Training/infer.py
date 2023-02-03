from transformers import BertModel
model = BertModel.from_pretrained('./NepBERTa',from_tf=True)
vocab_file_dir = './NepBERTa/' 
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import numpy as np


tokenizer = BertTokenizer.from_pretrained(vocab_file_dir,
                                        strip_accents=False,
                                         clean_text=False )

def preprocessing(input_text, tokenizer):
  '''
  Returns <class transformers.tokenization_utils_base.BatchEncoding> with the following fields:
    - input_ids: list of token ids
    - token_type_ids: list of token type ids
    - attention_mask: list of indices (0,1) specifying which tokens should considered by the model (return_attention_mask = True).
  '''
  return tokenizer.encode_plus(
                        input_text,
                        add_special_tokens = True,
                        max_length = 32,
                        truncation=True,
                        pad_to_max_length = True,
                        return_attention_mask = True,
                        return_tensors = 'pt'
                   )


model_weights = torch.load('./nep_berta.pt',map_location=torch.device('cpu'))
# Load the BertForSequenceClassification model
model = BertForSequenceClassification.from_pretrained(
    vocab_file_dir,
    num_labels = 2,
    output_attentions = False,
    output_hidden_states = False,
    from_tf= True
)
model.load_state_dict(model_weights)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def prediction(new_sentence):
        # We need Token IDs and Attention Mask for inference on the new sentence
    test_ids = []
    test_attention_mask = []

    # Apply the tokenizer
    encoding = preprocessing(new_sentence, tokenizer)

    # Extract IDs and Attention Mask
    test_ids.append(encoding['input_ids'])
    test_attention_mask.append(encoding['attention_mask'])
    test_ids = torch.cat(test_ids, dim = 0)
    test_attention_mask = torch.cat(test_attention_mask, dim = 0)

    # Forward pass, calculate logit predictions
    with torch.no_grad():
        output = model(test_ids.to(device), token_type_ids = None, attention_mask = test_attention_mask.to(device))

    prediction = 'Hate' if np.argmax(output.logits.cpu().numpy()).flatten().item() == 1 else 'Not Hate'

    print('Input Sentence: ', new_sentence)
    print('Predicted Class: ', prediction)

if __name__=="__main__":
    prediction('धोति रहेछ जस्तो छ यो वेले')