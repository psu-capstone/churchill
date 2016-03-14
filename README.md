[![Build Status](https://travis-ci.org/psu-capstone/churchill.svg)](https://travis-ci.org/psu-capstone/churchill)
# **Churchill**

## **Version 2.0**

**Folder Structure:**

**lib:**

Unzip c3.zip.
This is a modified c3 library that will show popups in Chrome.  This can be removed once the 
[pull request](https://github.com/masayuki0812/c3/pull/1564) is completed to fix
this issue in Chrome. <br/>
*Update: This pull request has been merged to the c3 repo, watch for c3 version 0.4.11 release to fix this issue* <br/>
If it is needed: after running `npm install` you will have to run `npm link lib/c3` which may require admin rights 
to complete the link.  When that is finished, `var c3 = require('c3')` in `index.js` will now look to `lib/` 
instead of `node_modules/c3`

**public/build:** <br/> 
After running the build.sh script, the deliverable will be located here.

**public/dev:** <br/> 
Development folders, do normal work here. <br/>
It's certainly easier to see your changes if you use `index_dev.html` instead
of running the build script every time.  In this case, just click your desired browser icon in the upper right of
`index_dev.html`.  You will just see the popup error in Chrome again since you're using the c3 CDN again.  You will
also have to comment out `var c3 = require('c3);` in `appController.js`.

___

**Deploy:** <br/>

**deploy/build.sh**
Production build script that executes the relevant production gulp tasks.

**deploy/run.sh**
Script to start production web server

**deploy/build_dev.sh** <br/>
Development build script that tackles all the necessary gulp tasks and leaves you with a localhost:3000 server where you can
directly view the application.

___

**Miscellanous Files:**

**package.json** <br/>
The necessary packages for this project.  After cloning the repo `npm install` will pull the dependencies listed here.

**gulpfile.js** <br/>
Probably doesn't need to be modified but if you find something else cool gulp can do to make the code more
efficient feel free to edit and try it out, just make sure all gulped files are routed to public/build. Note that
this basically replaced the old server.js file that is no longer in the repo.

**travis.yml** <br/>
Continuous integration. [Travis Churchill Page](https://travis-ci.org/psu-capstone/churchill)

___

**Creating an Admin Account:**

___

An admin is stored in the database with the tag `is_admin: true` value.  To add an admin, you will have to hard
code this into the `issue_args` in `self.adduser...`.  By default, creating a user from the application will give a user
`is_admin: false`.