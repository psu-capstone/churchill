#!/usr/bin/env bash
echo "Gulp Files"
gulp
echo "Building bundle.js"
gulp package
echo "Browserify"
gulp browserify
echo "Start localhost"
gulp connect
