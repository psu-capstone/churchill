from flask import Blueprint, request, jsonify

from app import app

@app.route('/')
def index():
    return "ROOT API"
