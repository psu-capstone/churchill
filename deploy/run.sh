#!/bin/bash

SCRIPT=$(readlink -f $0)
SCRIPTPATH=`dirname $SCRIPT`
NODE_MODULES=`readlink -f $SCRIPTPATH/../node_modules`

cd $NODE_MODULES

# start application on port 3000
.bin/gulp connect
