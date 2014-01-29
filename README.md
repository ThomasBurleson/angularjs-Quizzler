![quizzler_workflow](https://f.cloud.github.com/assets/210413/1701194/d97319f4-6046-11e3-8442-05b549afaa1a.jpg)

*  Click here to use the [Live Demo](http://thomasburleson.github.io/angularjs-Quizzler/#/loginl)
*  Click here to review the [Live Jasmine TestRunner](http://thomasburleson.github.io/angularjs-Quizzler/test/testRunner.html) output.

---

### Purpose of a Challenge

The purpose of the challenge is to present a **work-from-home** challenge to developers interviewing for positions on AngularJS projects. Their **challenge** is to create an online HTML5 application... And I preface the request with a comment that this is a non-trivial request imposed on the candidate.

But such a challenge has HUGE benefits in that it (1) allows a *review team* myriad opportunities to perform a full-suite assessment of the *developer* candidate and (2) it also removes much of the `time` factor from the challenge. Candidates can use their own tools, own resources, and invest significantly more time into the project than would otherwise be available in a single screensharing session such as **Google Hangout**. 

Ideally, you have candidates to whom you can present this challenge... candidates that have not seen/studied the solution presented here. ;-)

---

### The `Quizzler` Challenge

The developer candidate is asked to implement an AngularJS web application that will allow users to take a quiz, evaluate the *given* answers, and present a review of quiz scoring to the user/tester.  The review should show the correct answers and - when appropriate - also show the tester their incorrect answers. Logout should also be supported after the review in presented.

*  Six (6) questions are initially provided; without answers to the actual questions. 

Once the developer has **finished** (to whatever level they decide is appropriate), the developer should configure a GitHub repository as well as an online verion of the live app. How the demo is deployed is up to the developer. 

Upon completion [or partial completion] of the challenge, the review team's assessment will consider factors such as:

* motivation, attitude, and competence
* skill levels, best practices, coding style, clarity-of-code
* architecture solutions, component implementation, and DRY-ness
* solution usability and user testing features
* and more…

The developer should note that the challenge is expected to require approximately 20-40 hours of effort.

*  See the [Requirements PDF](https://github.com/thomasburleson/angularjs-Quizzler/blob/master/docs/Proveyourself.pdf?raw=true)
*  See the [Design Requirements](https://f.cloud.github.com/assets/210413/1786317/ea38fd30-68f2-11e3-9efc-9ee48607a87f.jpg)

### Technical Requirements

The developer should use:

* GitHub
* AngularJS
* Jasmine
* Bonus points for use of HAML and CoffeeScript

Additionally the developer should:

* Avoid jQuery (rely on AngularJS’ JQLite where possible)
* Organize project in a way that makes sense.
* Provide sufficient test coverage for all Javascript.

---

### Application Implementation

>
<strong>Before</strong> you explore the source code for Quizzler, I highly recommend that you first read the <a href="http://solutionoptimist.com/2013/09/30/requirejs-angularjs-dependency-injection/">Dependency Injection using RequireJS and AngularJS</a> tutorial; since all of the source uses both RequireJS injection and AngularJS injection.

Quizzler is an AngularJS `online quiz builder and testing` application; developed as a deliverable to a challenge presented to developers who are interviewing at `www.<xxx>.com`.

Visitors can either walkthru the [Live Demo](http://thomasburleson.github.io/angularjs-Quizzler/#/login) or simply look at snapshots of running application:

*  [Quizzler Login](https://f.cloud.github.com/assets/210413/1701314/e73aee92-604e-11e3-8624-db4537de9a90.jpg)
*  [Quiz](https://f.cloud.github.com/assets/210413/1701315/f1409a72-604e-11e3-9331-989b5f81416c.jpg)
*  [Scoring ](https://f.cloud.github.com/assets/210413/1701316/f9660ac0-604e-11e3-9f88-86b080463345.jpg)


Using AngularJS (v1.2.x) and RequireJS, `Quizzler` is architected with minimum coupling and crisp bootstrapping.
HeadJS is used to asynchronously load the required scripts **before** bootstrapping the NG application.

*  Quizzler supports 1…n quizes defined in JSON format. 
*  The quiz data is dynamically loaded and the dynamic workflow will guide the tester thru 1..n questions. 
*  Quiz questions can contain HTML with references to external images, etc.

>
![screen shot 2013-12-08 at 11 15 22 am](https://f.cloud.github.com/assets/210413/1701199/33d97d70-6047-11e3-8768-aa7ad52996de.jpg)

Extra application features added to the implementation include 

*  Use of RequireJS with AngularJS
*  Authentication module, 
*  session management, 
*  history navigation, 
*  question validation, 
*  enhanced logging,
*  and more. 

Robust logging is used through-out the application and even logging during the bootstrapping process: before `$log` injection is available; see my blog article [Using Decorators to Enhance AngularJS $log](http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/) for details.
>
![quizzler_logging](https://f.cloud.github.com/assets/210413/1701319/e169e7ba-604f-11e3-9f61-8fb45fad300e.jpg)


---

### Installation

Here is a brief explanation of the directory structures:

*  `client`: directory contains the source code, css, html, and vendor libraries for Quizzler. 
*  `build`: directory contains the Bower settings, initial files for Travis deployment, and pending Grunt files for builds
*  `tools`: directory contains a CoffeeScript webserver that allows developers to easily run and debug `Quizzler`
*  `docs`: directory contains the initial challenge requirements (PDF) and mockups.

To install the project, download entire repository to local project directory and open a Terminal window at *local* project directory. Then use **Bower** to install the vendor tools/libraries and **Grunt** to install the build tools:

```
cd ./build
bower install
npm update
```


Use Terminal to start the CoffeeScript, built-in **Quizzler Web Server** web server; provided in the `tools` directory:

```
cd ./client
coffee ../tools/webserver/run.coffee
```

Launch webServer. Developers can use the `./client` directory as the webroot... So open browser and navigate to `http://localhost:8000/index.html`.


A deployment process is now available to deploy your application in development mode or production mode. 

`Development` mode deploys copy all the class files to the webroot and uses RequireJS to lazy load required class files. Use the following Terminal commands:

```
cd ./build
grunt dev
```
 
 Production deploys use Grunt RequireJS to concatenate, minimize, and deploy a production version of `Quizzler` .  All application code is compressed into `webroot/assets/js/quizzler.js`.
 
```
cd ./build
grunt prod
```
 
  
---

### Pending Features

Considering the short deliverable time for this solution, the current implementation has several aspects that should/must be improved:

* Implementation of multiple quizes with quiz selector
* Persistence of Quiz results
* Reduction and clarity-improvement of CSS using LessCSS
* Improved UX for Login
  * input fields color code when errors occur
  * input fields clear state indicators when typing
  * focus indicators improved
  * implementation of register
  * auto-restore last-signin email
  * look-ahead for email field
* Improved UX for Quiz 
  * Hover indicators for questions
  * Field for user-submitted questions/comments
  * Timer for entire quiz
  * Breadcrumbs for quiz
  * Animation of questions as user selects *continue* or *submit*
* Splash Preloading screen with progress indicator
* Header bar with email
* Footer bar with copyright information

Additionally developer workflow processes could be significantly improved with the following:

* Use of grunt for builds/deploys
* Use of Git pre-commit hooks to run tests
* Use of JSHint checks
* Deployment to Jenkins/Travis for CI and testing
* Use of CoffeeScript instead of hand-written Javascript
* Minification of application code

---

### Working In-Progress

NOTE: Launching of Jasmine unit tests and execution of Karma should be considered in-complete and are currently **in-progress**!

