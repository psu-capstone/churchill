# churchill

Version 0.1

New Folder structure with Angular integration:

<b>public/build</b> : Is still the result of the gulp, after you've worked in public/dev you can run gulp in the
terminal to gulp the files and build a new build folder. 

<b>public/dev</b>   : Development folders, do normal work here

<b>test</b> : Now set up with Karma and Jasmine to run more future tests

<b>server.js</b> : is what bin/www used to be.  If you gulp your files, make sure you change line 10 to look to 
public/build instead of public/dev

This is still runnable on your localhost:3000 if you set this project up as a NodeJS application.
Alternatively, there is always the Vagrant server :)

<b>To run tests</b>:
Located in the test folder is some very basic Karma-Jasmine tests.  Run tests with ```karma start``` in the commandline
(or ```./node_modules/.bin/karma start``` if you don't have karma locally)
this will produce a ```results.html``` file you can open up to view the results of the test in more detail.
