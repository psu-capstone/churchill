echo "Gulp Files"
../node_modules/.bin/gulp
echo "Building bundle.js"
../node_modules/.bin/gulp package
echo "Browserify"
../node_modules/.bin/gulp browserify
echo "Start localhost"
../node_modules/.bin/gulp connect
