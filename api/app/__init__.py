import os, sys

from flask import Flask


app = Flask(__name__)
app.config.from_object('config')
app.debug = True

# import shared graph module
parent = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent)
from shared import Graph

# check if neo4j uri has been set as environment variable
# otherwise use uri from config file
neo_uri = os.getenv("NEO4J_URI", "")
if not neo_uri: neo_uri = app.config["NEO4J_URI"]
graph = Graph(neo_uri)

from app.mod_api.views import mod_api as api_module

app.register_blueprint(api_module)

from app import views
