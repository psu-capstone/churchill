import os
import json
import unittest
import sys


# add parent directory to path to import app
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root)

from app import app, graph

 
class BasicTest(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
    
    def test_index(self):
        rv = self.app.get('/')
        expected = "ROOT API"
        self.assertEqual(rv.data, expected)

    def test_api_index(self):
        # trailing '/' is required when testing because
        # flask is weird and returns 301 otherwise
        rv = self.app.get('/api/') 
        expected = dict(response="API Index")
        response = json.loads(rv.data)
        self.assertEqual(response, expected)


if __name__ == '__main__':
    unittest.main()



