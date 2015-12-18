from flask import Blueprint, request, jsonify
from webargs import fields
from webargs.flaskparser import use_args
from py2neo import Graph, Node, Relationship

from app import app, graph


mod_api = Blueprint('api', __name__, url_prefix='/api')


@mod_api.errorhandler(422)
def handle_bad_request(err):
    data = getattr(err, 'data')
    if data: message = data['exc'].messages
    else: message = "invalid request"
    return jsonify({"error": message }), 422


@mod_api.route('/')
def api_index():
    return jsonify(response="API Index")


user_args = {
    'username':fields.Str(required=True),
    'name':fields.Str(required=True),
    'city':fields.Str(required=True)
}


@mod_api.route('/user', methods=["POST"])
@use_args(user_args)
def create_user(args):
    user = args["username"]
    node, new_user = graph.create_user(args)
    if new_user:
        return jsonify(
            success="User <{0}> created".format(user),
            node_id=user
        )
    else:
        return jsonify(
            error="User <{0}> already exists".format(user),
            node_id=user
        )


entity_args = {
    'id':fields.Str(required=True),
}


@mod_api.route('/user', methods=['GET'])
@use_args(entity_args)
def get_user(args):
    node = graph.find_node("User", args["id"])
    if node:
        return jsonify(
            id=node.properties["node_id"],
            name=node.properties["name"],
            city=node.properties["city"]
        )
    return jsonify(error="No matching user: {0}".format(args["id"]))


@mod_api.route('/value', methods=['GET'])
@use_args(entity_args)
def get_value(args):
    return handle_node_request(args, "Value") 


@mod_api.route('/objective', methods=['GET'])
@use_args(entity_args)
def get_objective(args):
    return handle_node_request(args, "Objective") 


@mod_api.route('/policy', methods=['GET'])
@use_args(entity_args)
def get_policy(args):
    return handle_node_request(args, "Policy") 


@mod_api.route('/issue', methods=['GET'])
@use_args(entity_args)
def get_issue(args):
    return handle_node_request(args, "Issue") 


@mod_api.route('/community', methods=['GET'])
@use_args(entity_args)
def get_community(args):
    return handle_node_request(args, "Community") 


def get_entity_response(entity_id, name, desc):
    return dict(id=entity_id, name=name, desc=desc)


def handle_node_request(args, node_type):
    node = graph.find_node(node_type, args["id"])
    if node:
        return jsonify(
            name=node.properties["name"],
            id=node.properties["node_id"]
        )
    return jsonify(error="No matching node: {0}".format(args["id"]))
