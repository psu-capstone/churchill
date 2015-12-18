#!/bin/bash
set -e

# path of script
# cludged universal perl command, don't worry about it
SCRIPT=`perl -e 'use Cwd "abs_path";print abs_path(shift)' $0`
# script directory
DIR=`dirname $SCRIPT`

cd $DIR
rm -rf env
virtualenv env
env/bin/pip install -r requirements.txt
