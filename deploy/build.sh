#!/bin/bash

SCRIPT=$(readlink -f $0)
SCRIPTPATH=`dirname $SCRIPT`
NODE_MODULES=`readlink -f $SCRIPTPATH/../node_modules`

cd $NODE_MODULES

# Gulp Files
.bin/gulp
# Building bundle.js
.bin/gulp package
# Browserify
.bin/gulp browserify
