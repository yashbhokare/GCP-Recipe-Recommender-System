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


# Read the recipe dataset and perform data cleaning 

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

# define treat input function, returning a list of tokenized ingredients
def treat_words (words):
    list_words = words.split(",")
    output = []
    for w in list_words:
        output.append("_".join(w.strip().split(" ")))
    return output

def get_similarity(lda, query_vector):
    index = similarities.MatrixSimilarity(lda[corpus])
    sims = index[query_vector]
    return sims

# define calculate similarity fuction to get similarity rank between topics
def calculate_similarity(query,ldamodel,dct):
    # treat input words
    words_bow = dct.doc2bow(treat_words(query))
    query_vector = ldamodel[words_bow]
    
    #calculate ranking
    sim_rank = get_similarity(lda = ldamodel, query_vector = query_vector)
    sim_rank = sorted(enumerate(sim_rank), key=lambda item: -item[1])
    
    return sim_rank

# define calculate recommedation function to get the recommended recipes
def calculate_recommendation(sim_rank,groups,n_reco = 10):
    results = [sim_rank[0][0]]
    results_prob = [sim_rank[0][1]]
    result_group = [sim_rank[0][1]]
        
    for recipe,group in zip(sim_rank[1:],groups[1:]):
        if group not in set(result_group):
            results.append(recipe[0])
            result_group.append(group)
            results_prob.append(recipe[1])
        if len(results) == n_reco:
            break
    print(result_group,"\n",results_prob)
    return results

def get_similarity_reco (query,ldamodel,dct,corpus,n_reco = 10):
    #calculate rank
    sim_rank = calculate_similarity(query,ldamodel,dct)
    #find groups according to lda model
    groups = []
    for l in ldamodel[corpus]:
        try:
            groups.append(l[0][0])
        except:
            groups.append(random.randint(1, 100))
            
    result = calculate_recommendation(sim_rank,groups,n_reco)
    c = data.iloc[result]
    d = c.name
    e = ""
    for column,values in d.iteritems():
      e = e + (values + ' ,')  
    print(type(e))
    return e

    
