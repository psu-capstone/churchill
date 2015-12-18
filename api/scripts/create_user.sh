#/bin/bash

endpoint=127.0.0.1:9000/api/user
data="username=testuser&city=Portland&name=Test"

curl --data $data $endpoint
