# churchill

Version 0.1

New Folder structure with Angular integration:

public/build : Is still the result of the gulp, after you've worked in public/dev you can run gulp in the
terminal to gulp the files and build a new build folder. 

public/dev   : Development folders, do normal work here

test : Now set up with Karma and Jasmine to run more future tests

server.js is what bin/www used to be.  If you gulp your files, make sure you change line 10 to look to 
public/build instead of public/dev

This is still runnable on your localhost:3000 if you set this project up as a NodeJS application.
Alternatively, there is always the Vagrant server :)
