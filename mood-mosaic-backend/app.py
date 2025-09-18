from flask import Flask, request, jsonify
from flask_cors import CORS
from lambda_function import lambda_handler

app = Flask(__name__)
CORS(app)  # allow requests from frontend

@app.route("/api/moods", methods=["GET", "POST"])
def moods():
    if request.method == "POST":
        # Ensure the body is parsed as JSON
        event = {
            "httpMethod": "POST",
            "body": request.data.decode("utf-8")  # pass raw JSON string
        }
        response = lambda_handler(event, None)
        return (response['body'], response['statusCode'], {"Content-Type": "application/json"})
    else:  # GET
        event = {"httpMethod": "GET"}
        response = lambda_handler(event, None)
        return (response['body'], response['statusCode'], {"Content-Type": "application/json"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
