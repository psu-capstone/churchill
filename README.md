# **Churchill**

## **Version 0.2**

___

**Folder Structure:**

___

**public/build:** <br/> 
Result after running gulp, the newly gulped files will be placed here. You can run gulp with ```./node_modules/.bin/gulp```

**public/dev:** <br/> 
Development folders, do normal work here

**test:** <br/> 
Set up with Karma and Jasmine to run the test suite

**Miscellanous Files:**

___

**server.js** <br/>
If you gulp your files, make sure you change line 10 to look to 
public/build instead of public/dev. 
Feel free to also change what port the localhost is listening to.

**gulpfile.js** <br/>
Probably doesn't need to be modified but if you find something else cool gulp can do to make the code more
efficient feel free to edit and try it out, just make sure all gulped files are routed to public/build

**karma.conf.js** <br/>
The only notable thing you may need to change is the files block in lines 17-24.  If you are using a library that
needs to be included in the test make sure karma knows what to load before the tests are run.

**Notes**

___

**Testing:** <br/>
Located in the test folder is some very basic Karma-Jasmine tests.  Run tests with ```./node_modules/.bin/karma start``` 
in the commandline this will produce a results.html file you can open up to view the results of the test in more detail.

**Deploy:** <br/>
If you're running this from IDEA or Webstorm you can run it locally by setting up your run configuration as a NodeJS project<br/>
This will run the web application locally on localhost:3000. <br/>
Alternatively, check the server repo to set up the application on a vagrant server
