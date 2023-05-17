from app import app 
from flask import request,jsonify
from .transliterate import * 
from app import model
from .id_generator import bert_encode
import tensorflow as tf
import numpy as np 
from .model import bert_bilstm_model
from youtube_comment_downloader import *
downloader = YoutubeCommentDownloader()

model = bert_bilstm_model()
model.load_weights("model.h5")

@app.route('/detect', methods=['POST'])
def receive_data():
    url = request.get_json().get('url')

    print(url)
    comments = downloader.get_comments_from_url(url, sort_by=SORT_BY_POPULAR)
    print(comments)
    transliterated_sentences = []
    sentiments=[]
    hate_indices = []
    hate_sentences = []
    engine = Transliteration() 
    for index,comment in enumerate(comments):
        print(comment['text'])
        transliterated_sentence = engine.translit_sentence(comment['text'])
        transliterated_sentences.append(transliterated_sentence)
        encoded_data = bert_encode([transliterated_sentence])
        input_ready_data = (
            tf.data.Dataset
            .from_tensor_slices((encoded_data))
            .batch(32)
        )
        predictions = model.predict(input_ready_data)
        sentiment = ['Hate' if np.array((predictions>0.5).astype(int))[0][0]==1 else 'Not Hate']
        sentiments.append(sentiment)
        if sentiment==['Hate']:
            hate_indices.append(index)
            hate_sentences.append(transliterated_sentence)
   
    result = {'transliterated_sentence': transliterated_sentences,
              'sentiments': sentiments,
              'indices':hate_indices}  
    return result 