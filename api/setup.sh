#!/bin/bash
set -e

# path of script
# use readlink if Ubuntu
# greadlink on Mac
SCRIPT=$(greadlink -f $0)
# script directory
DIR=`dirname $SCRIPT`

cd $DIR
rm -rf env
virtualenv env
env/bin/pip install -r requirements.txt
