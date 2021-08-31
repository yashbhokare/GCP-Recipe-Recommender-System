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
from google.cloud import storage
import logging
import os

seed = 0

# Read the recipe dataset and perform data cleaning 
bucket_name = 'modelcc'
file_name = 'lda.model'
client = storage.Client("My First Project")
bucket = client.get_bucket(bucket_name)
blob = bucket.blob(file_name)
outfile = 'RAW_recipes.csv'
bucket = client.get_bucket(bucket_name)
blob = bucket.blob(file_name)
blob.download_to_filename(outfile)

data = pd.read_csv('RAW_recipes.csv')

data.head()
data.info()

convert_to_list = ['tags','nutrition','steps','ingredients']

for c in convert_to_list:
    data[c] = data[c].apply(lambda x: eval(x))

print(convert_to_list)
data.head()
data.info()

data.to_pickle('raw_df.pkl')

# convert the data into required format
def treat_ingredients(ing_list):
    output = []
    for ingredient in ing_list:
        ingredient_list = ingredient.split(' ')
        output.append("_".join(ingredient_list))
    return output

# model training
def train_lda_model(ingredients,num_topics = 100,passes = 25,random_state = seed):
    
    # get list of ingredients transformed
    ingredients_all = ingredients.apply(lambda x: treat_ingredients(x))
    
    #build dict (for Gensim vectorizer)
    dictionary = Dictionary([ing for ing in list(ingredients_all)])
    
    # build corpus: BOW
    corpus = [dictionary.doc2bow(text) for text in list(ingredients_all)]
    
    #train lda
    ldamodel = LdaModel(corpus,num_topics = num_topics, passes = passes,random_state = random_state, id2word = dictionary)
    return ldamodel,dictionary,corpus

ldamodel,dictionary,corpus = train_lda_model(data.ingredients)

ldamodel.save()





