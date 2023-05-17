

from flask import Flask
from flask_cors import CORS

from transformers import BertTokenizer
app = Flask(__name__)
CORS(app)


from app import views 