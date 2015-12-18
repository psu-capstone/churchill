from py2neo import Graph as NeoGraph, Node


class Graph(object):

    def __init__(self, neo4j_uri):
        self.graph = NeoGraph(neo4j_uri)

    def find_node(self, label, node_id):
        args = dict(property_key="node_id", property_value=node_id)
        return self.graph.find_one(label, **args)

    def create_user(self, args):
        node = self.find_node("User", args["username"])
        if not node:
            properties = dict(
                node_id=args["username"],
                name=args["name"],
                city=args["city"]
            )
            node = Node("User", **properties)
            self.graph.create(node)
            return node, True
        return node, False

    def delete_user(self, user):
        node = self.find_node("User", user)
        if node:
            self.graph.delete(node)    
            return True
        return False
