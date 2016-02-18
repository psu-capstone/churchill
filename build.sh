#!/usr/bin/env bash
echo "Gulp Files"
./node_modules/.bin/gulp
echo "Building bundle.js"
./node_modules/.bin/gulp package
echo "Browserify"
./node_modules/.bin/gulp browserify
#Take out when pushing to master branch
echo "Start localhost"
./node_modules/.bin/gulp connect