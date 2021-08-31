from flask import Flask, request
import subprocess
import os
import model_result
import pandas as pd
import numpy as np
import gensim
import random
from sklearn.feature_extraction.text import CountVectorizer
from gensim.matutils import Sparse2Corpus
from gensim.models.ldamodel import LdaModel
from gensim import models, similarities
from gensim.corpora import Dictionary
from gensim.models import TfidfModel

app = Flask(__name__)

model =  LdaModel.load('lda.model')
data = pd.read_pickle('raw_df.pkl')

ingredients = data.ingredients

def treat_ingredients(ing_list):
    output = []
    for ingredient in ing_list:
        ingredient_list = ingredient.split(' ')
        output.append("_".join(ingredient_list))
    return output


# get list of ingredients transformed
ingredients_all = ingredients.apply(lambda x: treat_ingredients(x))

#build dict (for Gensim vectorizer)
dictionary = Dictionary([ing for ing in list(ingredients_all)])
    
# build corpus: BOW
corpus = [dictionary.doc2bow(text) for text in list(ingredients_all)]


@app.route("/status")
def test123():
    return "Working"

@app.route("/")
def run_script():
    C = request.args.get("reciepe")
    e = model_result.get_similarity_reco (C, model, dct = dictionary, corpus = corpus,n_reco = 10)
    return e

if __name__ == "__main__":
    app.run(debug=true)
