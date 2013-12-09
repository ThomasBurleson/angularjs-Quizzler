# Promise-Returning Tests for Jasmine

So you really like [Jasmine](https://github.com/pivotal/jasmine). But you also really like [promises](). And you'd like to see 
support in [Jasmine](https://github.com/pivotal/jasmine) for the promise-returning test style; similar to the great work by [Domenic Denicola](https://github.com/domenic) for the [Mocha as Promised](https://github.com/domenic/mocha-as-promised) and others.

This library provides an extension of the Jasmine `Spec::runs()` to support Promises 
and will auto-magically wait for the promise to resolve or reject before continuing with subsequent unit tests.

## The Old Way

Until now you've been making do with manual solutions that explicity use `runs()` and `waitsFor()` 
to force the test runner to pause the tests while waiting for the async response. 

Here is a sample of code constructed in the tradition, *old way*. For purposes of code samples, let's consider API tests where the `authors.validate()` 
is asynchronous and returns a promise instance:

```js
it( "should respond successfully for valid authors", function () {
	var ready  = false,
		result;
		
		runs( function() 
		{
			authors
			    .validate("Domenic Denicola")
			    .then(
			    	function onResponse( data )
			    	{
			    		result = data;
			    		ready  = true;		// continue test runner
			    	},
			    	function onError( fault )
			    	{
			    		ready  = true;		// continue test runner
			    	}
			    );
		});

		// Pause test runner until timeout or yourAsyncCall() responds		
		waitsFor( function() 
		{
			return result;
		});
		
		
		// Run the code that checks the expectations…
		
		runs( function() 
		{
			expect( result.valid ).toBeEqual( 1 );
			expect( result.level ).toBeEqual( "awesome" );
		});	    
});
```

Developers will immediately note that this traditional approach is verbose and error-prone when developers are need to create many tests for their async APIs.

## The New, Better Solution

With Jasmine-As-Promised and APIs that return promises, consider the code tersity and simplicity that can be realized
when your unit tests return Promises:

```js
it( "should be respond for valid authors", function () 
{
	runs( function() 
	{    	
		return authenticator
			.validate("Domenic Denicola" )
			.then( function (result) 
			{
				expect( result.valid ).toBeEqual( 1 );
				expect( result.level ).toBeEqual( "awesome" );
			});
	});
});
```

You could even separate your `expect()` calls if wanted. Instead of nesting your expectations inside
the promise handler, consider another supported approach:

```js
it( "should respond successfully for valid authors", function () 
{
	runs( 
		function() 
		{    	
			return authenticator.validate("Domenic Denicola" );
		},
		function checkExpectations( result ) 
		{
			expect( result.valid ).toBeEqual( 1 );
			expect( result.level ).toBeEqual( "awesome" );
		}
	);
});
```

With this *new* approach developers no longer need to worry about `waitsFor()`, latch methods, etc. With Jasmine as Promised, you have a much two (2) much nicer, easily applied options available! 

## How to Use

Once you install and set up **Jasmine-as-Promised**, you now have a second way of creating asynchronous tests, besides Jasmine's
usual `runs(); waitsFor(); runs();` style. Just return a promise. When the promise is resolved the test expectations are checked and if it is rejected the test
fails, with the rejection reason as the error. Nice, huh?

Jasmine as Promised works with all Jasmine interfaces: BDD, TDD, QUnit, whatever. It hooks in at such a low level, the
interfaces don't even get involved.


## This is NOT Jasmine-Node

[Jasmine-Node](https://github.com/mhevery/jasmine-node) is a project that integrates the Jasmine Spec framework with NodeJS. 

jasmine-node includes an alternate syntax for writing asynchronous tests. Accepting a done callback in the specification will trigger jasmine-node to run the test asynchronously waiting until the done() callback is called.

```js
var request = require('request');

it("should respond with hello world", function(done) {
  request("http://localhost:3000/hello", function(error, response, body){
    expect(body).toEqual("hello world");
    done();
  });
});
```

Notice that this `Jasmine-as-Promised` library does **not** use a done callback function argument in the `it( )` call. But developers can still use Jasmine-As-Promised with   Jasmine-Node; see the usage notes below for use with Node.

## Installation and Usage

### Node

Do an `npm install jasmine-as-promised --save-dev` to get up and running. Then:

```js
require("jasmine-as-promised")();
```

You can of course put this code in a common test fixture file; for an example, see
[the Jasmine as Promised tests]().

### AMD

**Jasmine-as-Promised** supports being used as an [AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) module, registering itself anonymously. So, assuming you have
configured your loader to map the Jasmine and Jasmine as Promised files to the respective module IDs `"jasmine"` and
`"jasmine-as-promised"`, you can use them as follows:

```js
define(function (require, exports, module) {
    var jasmine = require("jasmine");
    var jasmineAsPromised = require("jasmine-as-promised");

    jasmineAsPromised(jasmine);
});
```

### `<script>` tag

If you include **Jasmine-as-Promised** directly with a `<script>` tag, after the one for Jasmine itself, then it will
automatically plug in to Jasmine and be ready for use:

```html

<script src="jasmine"></script>
<script src="jasmine-as-promised.js"></script>

```

### Node, the Advanced Version

The `require("jasmine-as-promised")()` above tries to detect which instance of Jasmine is being used automatically. This
way, **Jasmine-as-Promised** can plug into either the local Jasmine instance installed into your project, or into the global
Jasmine instance if you're running your tests using the globally-installed command-line runner.

In some cases, if you're doing something weird, this can fall down. In these cases, you can pass the Jasmine instance into
into the **Jasmine-as-Promised** function. For example, if you somehow had your Jasmine module as a property of the `foo` module,
instead of it being found in the usual npm directory structures, you would do

```js
require("jasmine-as-promised")(require("foo").MyJasmine);
```

### Bower, the Package Manager

Now you can use `Bower` (the package manager for the web) to get the most recent released version of the library installed in your project-relative `bower_components` directory.

```js
bower install jasmine-as-promised
```

And Bower will also auto-install the `Jasmine` library for you; as part of this library install.

## How Does This Work!?

While this approach using the interceptor or *head hook* approach, it should be note that this is hack... albeit a reasonable one.
Note that **Jasmine-as-Promised** just overrides the `Jasmine.Spec.prototype.runs` method; check the source for more details.
