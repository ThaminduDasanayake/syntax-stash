from hyperopt import hp

# Define the search space for a hybrid multi-objective AutoML framework
# Focuses on classical NLP components rather than tokenizers/embeddings
search_space = {
    'vectorizer': hp.choice('vectorizer', [
        {
            'type': 'tfidf',
            'ngram_range': hp.choice('tfidf_ngram', [(1, 1), (1, 2), (1, 3)]),
            'max_features': hp.quniform('tfidf_max_features', 1000, 10000, 500)
        },
        {
            'type': 'count',
            'ngram_range': hp.choice('count_ngram', [(1, 1), (1, 2)]),
            'max_features': hp.quniform('count_max_features', 1000, 10000, 500)
        }
    ]),
    'scaler': hp.choice('scaler', ['standard', 'minmax', 'none']),
    'dim_reduction': hp.choice('dim_reduction', [
        {'type': 'pca', 'n_components': hp.quniform('pca_n', 50, 300, 10)},
        {'type': 'svd', 'n_components': hp.quniform('svd_n', 50, 300, 10)},
        {'type': 'none'}
    ]),
    'classifier': hp.choice('classifier', [
        {'type': 'random_forest', 'n_estimators': hp.quniform('rf_n', 50, 200, 10)},
        {'type': 'svm', 'C': hp.loguniform('svm_c', -3, 3)}
    ])
}