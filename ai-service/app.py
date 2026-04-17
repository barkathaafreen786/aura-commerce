# ai-service/app.py
from flask import Flask, request, jsonify
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import traceback

app = Flask(__name__)

# Mock Database of Product Metadata
products_df = pd.DataFrame([
    {'id': 'P1', 'name': 'Obsidian Roast Coffee', 'tags': 'beverage morning energy'},
    {'id': 'P2', 'name': 'Chronos AI Band', 'tags': 'wearable tech health premium'},
    {'id': 'P3', 'name': 'Noir Essence', 'tags': 'fragrance luxury evening glass'},
    {'id': 'P4', 'name': 'Matcha Energy Boost', 'tags': 'beverage morning health'}
])

# 1. Train the ML Model (Content-Based Filtering via Term Frequency)
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(products_df['tags'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def get_ml_recommendations(product_id, top_n=2):
    idx = products_df.index[products_df['id'] == product_id].tolist()
    if not idx:
        return products_df.head(top_n).to_dict('records') # Fallback if cold start
    
    sim_scores = list(enumerate(cosine_sim[idx[0]]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_indices = [i[0] for i in sim_scores[1:top_n+1]]
    
    return products_df.iloc[sim_indices].to_dict('records')

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        recent_product = data.get('last_viewed_product_id', 'P1')
        
        # Run Inference
        recommendations = get_ml_recommendations(recent_product)
        
        return jsonify({
            "status": "success",
            "engine": "Scikit-Learn Content-Based Model",
            "recommendations": recommendations
        })
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Aura ML Service running on port 8080")
    app.run(port=8080)
