import tensorflow as tf 
from transformers import BertTokenizer

vocab_file_dir = './NepBERTa/' 
tokenizer = BertTokenizer.from_pretrained(vocab_file_dir,
                                        strip_accents=False,
                                         clean_text=False )


def bert_encode(data):
    tokens = tokenizer.batch_encode_plus(data, max_length=140, padding='max_length', truncation=True)
    return tf.constant(tokens['input_ids'])