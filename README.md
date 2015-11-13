# churchill

Version 0

Currently a Login page, runnable on localhost:3000
or the server capdev.meyersj.com:3000

Folder changes:

The brunt of the work will be done in public/dev
public/build is the result after Gulp does its Gulping of the files and minimizes them.
so you'll notice jade files and js files that link each other now look to the build
folder to run the newly efficient gulped files.

And just knowledge sake:  

bin/ : For server purposes, this handles the localhost, might not need it since we can easily run this as a 
  droplet as well.
       
node_modules/ : Nothing spectacular here, just treat it as the NodeJS library

public/build/ : When new additions are made in /dev/ run 'gulp' in the commandline to build the build folder
and get the optimized files

public/dev/ : Do new additions here

routes/ folder:  This is where the Express magic happens.  That is, this is where NodeJS looks when needing to 
  change html pages.

test/ :  Future Unit tests here

views/ : Where the html pages are, of course these are jade files but you can certainly make normal html files here
  as well.
