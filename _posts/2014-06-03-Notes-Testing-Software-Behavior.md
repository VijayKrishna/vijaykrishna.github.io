---
layout: post
title: Notes on Testing/Verifying Behavior
categories: ['blog']
tags: ['notes', 'testing', 'software-behavior']
---


**S(i|a)mple Application: NumberTranslator:**
[https://bitbucket.org/vpalepu/191b](https://bitbucket.org/vpalepu/191b)

#### Q. How do you test/verify behaviors?

1. think about or in terms of behaviors.
2. actually verify behaviors.

#### Q. How do you think about behaviors?
(what do i mean by that?)

**old school testing demo:** [https://bitbucket.org/vpalepu/191b](https://bitbucket.org/vpalepu/191b)

### "Introducing BDD" by Dan North.
- Test method names should be sentences
	- An expressive test name is helpful when a test fails

- “Behaviour” is a more useful word than “test”
	- Emphasize behavior over testing
	- Determine the next most important behavior
	- Think: "what should the system should do?"; 
	- Not: "is the system right?" 

- It is all about templates
	- A simple sentence template keeps test methods focused
		- The class should do something
	- Story/Behavior Templates:

		As a [X]
		I want [Y]
		so that [Z]

		Given [some initial context (the givens)],
		When [an event occurs],
		then [ensure some outcomes].

#### Q. So are we really verifying behaviors with BDD?
(what do i mean by that?)

##### State vs Interactions
- Most testing that we do is state based or value based testing. The issue with state based testing is that sometimes you can arrive at the right state with the wrong steps or interactions.
- Process over Results
- The basic idea behind BDD is to *think* in terms of behaviors; you still might be doing the same old state or value based testing. 
	- So, BDD does not *force* test to Behaviors in terms of the actual interactions.

#### Mocking - testing interactions.

- Mocks enable us to test interactions.
- Mocks are not Stubs or Fakes or Dummies.

### Martin Fowler - "Mocks Aren't Stubs"
[http://martinfowler.com/articles/mocksArentStubs.html](http://martinfowler.com/articles/mocksArentStubs.html)

- *Dummy* objects are passed around but never actually used. Usually they are just used to fill parameter lists.
- *Fake* objects actually have working implementations, but usually take some shortcut which makes them not suitable for production (an in memory database is a good example).
- *Stubs* provide canned answers to calls made during the test, usually not responding at all to anything outside what's programmed in for the test. Stubs may also record information about calls, such as an email gateway stub that remembers the messages it 'sent', or maybe only how many messages it 'sent'.
- *Mocks* are what we are talking about here: objects pre-programmed with expectations which form a specification of the calls they are expected to receive.

- "the calls they are expected to receive.". Here calls refers to method calls.
- In the context of interactive applications like GUIs or Games, these method calls often represent interactions.
- Mocks keep track of all the method calls that are made/being made; check them against a specification, and flag errors if the specifications and reality do not match up.

#### Fun Reads:

- "Mock Roles, not Objects", Freeman, Pryce, Mackinnon, Walnes, OOPSLA 2004.
- "Mocks Aren't Stubs", Martin Fowler, [martinfowler.com/articles/mocksArentStubs.html](http://martinfowler.com/articles/mocksArentStubs.html)
- "Introducing BDD", Dan North, [dannorth.net/introducing-bdd](http://dannorth.net/introducing-bdd/)
- "expect-run-verify… Goodbye!", [http://monkeyisland.pl/2008/02/01/deathwish/](http://monkeyisland.pl/2008/02/01/deathwish/)
- Mockito Tutorials: [http://docs.mockito.googlecode.com/hg/latest/org/mockito/Mockito.html](http://docs.mockito.googlecode.com/hg/latest/org/mockito/Mockito.html)

Other Notes:

- Mockito cannot mock final classes ... String, Integer, Scanner
- Last stub always wins
- Mockito uses a "verify what you want" philosophy for mocking, unlike most other mocking frameworks that use the "expect-run-verify" philosophy for mocking. more: "expect-run-verify… Goodbye!", [http://monkeyisland.pl/2008/02/01/deathwish/](http://monkeyisland.pl/2008/02/01/deathwish/).