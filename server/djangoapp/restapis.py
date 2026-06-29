# Uncomment the imports below before you add the function code
import requests
import os
from dotenv import load_dotenv
# from .restapis import get_request, analyze_review_sentiments, post_review

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")


def get_request(endpoint, **kwargs):
    try:
        response = requests.get(
            backend_url + endpoint,
            params=kwargs
        )
        print(f"GET {response.url}")
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")


# def analyze_review_sentiments(text):
def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url+"analyze/"+text
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")


# def post_review(data_dict):
def post_review(data_dict):
    request_url = backend_url+"/insert_review"
    print(request_url)
    try:
        response = requests.post(request_url,json=data_dict)
        print(response.json())
        return response.json()
    except:
        print("Network exception occurred")
