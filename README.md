Desk-Quizzler
=============

Quizzler is an AngularJS `online quiz builder and testing` application; developed as a challenge to developers. 

![snapshot](https://f.cloud.github.com/assets/210413/1700810/ed98eb38-602e-11e3-8e9f-17c8cc6c8adf.jpg)

This repository contains all the source code

---

### Purpose of the `Quizzler` Challenge

Presenting a **work-from-home** challenge to create an online HTML5 application is a non-trivial request that allows a  *review team* myriad opportunities to perform a full-suite assessment of the *developer* candidate. The assessment will consider factors such as:

* motivation, attitude, and competence
* skill levels, best practices, coding style, clarity-of-code
* architecture solutions, component implementation, and DRY-ness
* solution usability and user testing features
* and more…

---

### The Challenge

The developer candidate is asked to implement an AngularJS web application that will allow users to take a quiz, evaluate the *given* answers, and present a review of quiz scoring to the user/tester.  The review should show the correct answers and - when appropriate - also show the tester their incorrect answers. Logout should also be supported after the review in presented.

*  Six (6) questions are initially provided; without answers to the actual questions. 
  * See the Requirements PDF for a sample *Quiz Content*   
*  A simple mockup of a typical layout is provided.  

Once the developer has **finished** (to whatever level they decide is appropriate), the developer should configure a GitHub repository as well as the running app (how Quizzler is deployed it is up to the developer). The review team will review Quizzler based on accuracy, best ­practice, style, and... attitude.

The developer should note that the challenge is expected to approximately 20-40 hours of effort.

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

### Implementation

Using AngularJS (v1.2.3) and RequireJS, `Quizzler` is architected with minimum coupling and crisp bootstraping.
HeadJS is used to asynchronously load the required scripts **before** bootstrapping the NG application.

Quizzler supports 1…n quizes defined in JSON format. The quiz data is dynamically loaded and the dynamic workflow will guide the tester thru 1..n questions. Quiz questions can contain HTML with references to external images, etc.

Robust logging is used through-out the application and even during the bootstrappingn (before injection is available). Extra application features added to the implementation include history navigation, session management, question validation, and more. 

Here is a brief explanation of the directory structures:

*  `client`: directory contains the source code, css, html, and vendor libraries for Quizzler. 
*  `build`: directory contains the Bower settings, initial files for Travis deployment, and pending Grunt files for builds
*  `tools`: directory contains a CoffeeScript webserver that allows developers to easily run and debug `Quizzler`
*  `docs`: directory contains the initial challenge requirements (PDF) and mockups.

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



 
  


