import os
import json
import unittest
import sys
import uuid

import py2neo

# add parent directory to path to import app
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root)

from app import app, graph


class UserTests(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        # create random username
        self.user = "testuser-{0}".format(uuid.uuid4())
        self.endpoint = "/api/user"
        self.data = dict(username=self.user, name="Test", city="Portland")

    def test_create_new(self):
        # make sure user does not exist
        graph.delete_user(self.user)

        # submit POST request to create new user
        rv = self.app.post(self.endpoint, data=self.data)
        
        # confirm JSON response matches what we expect
        response = json.loads(rv.data)
        expected = dict(
            node_id=self.user,
            success="User <{0}> created".format(self.user)
        )
        self.assertEqual(response, expected)
        
        # query graph directly and verify node exists
        node = graph.find_node("User", self.user)
        self.assertEqual(node.properties["node_id"], self.user)
   
        # clean up
        graph.delete_user(self.user)

    def test_create_existing(self):
        # make sure user exists
        graph.create_user(self.data)
        
        # submit POST request to create a user that already exists
        rv = self.app.post(self.endpoint, data=self.data)

        # confirm JSON response matches what we expect
        response = json.loads(rv.data)
        expected = dict(
            node_id=self.user,
            error="User <{0}> already exists".format(self.user)
        )
        self.assertEqual(response, expected)

        # clean up
        graph.delete_user(self.user)

       
    def test_get_user(self):
        # make sure user exists
        graph.create_user(self.data)

        # submit GET request to retrieve user data
        rv = self.app.get("/api/user", data=dict(id=self.user))
        
        # confirm JSON response matches what we expect
        response = json.loads(rv.data)
        expected = dict(
            id=self.user,
            name=self.data["name"],
            city=self.data["city"]
        )
        self.assertEqual(response, expected)
           
        # clean up
        graph.delete_user(self.user)



if __name__ == '__main__':
    unittest.main()



