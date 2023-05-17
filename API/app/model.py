import tensorflow as tf
import tensorflow as tf
from transformers import  TFBertModel
from keras.layers import LSTM


def bert_bilstm_model():

    
    bert_encoder = TFBertModel.from_pretrained('./NepBERTa')
    input_word_ids = tf.keras.Input(shape=(140,), dtype=tf.int32, name="input_ids")
    last_hidden_states = bert_encoder(input_word_ids)[0]    
    x = tf.keras.layers.Bidirectional(LSTM(64, dropout=0.4, recurrent_dropout=0.4))(last_hidden_states)
    x1 = tf.keras.layers.Dense(32,activation='relu')
    output = tf.keras.layers.Dense(1, activation='sigmoid')(x)
    model = tf.keras.Model(inputs=input_word_ids, outputs=output)
    
    return model


