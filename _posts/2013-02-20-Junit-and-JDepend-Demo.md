---
layout: post
title: Junit and JDepend Demo
tags: testing analysis java junit
categories: ['blog']
---

[JUnit]: http://junit.org/
[JunitOld]: http://junit.sourceforge.net/
[JunitInstall]: https://github.com/junit-team/junit/wiki/Download-and-Install
[JUnitStart]: https://github.com/junit-team/junit/wiki/Getting-started
[JUnitWiki]: https://github.com/junit-team/junit/wiki
[JunitAssertions]: https://github.com/junit-team/junit/wiki/Assertions
[Junit191]: https://bitbucket.org/vpalepu/191b

[JDepend]: http://www.clarkware.com/software/JDepend.html
[JDepend4Eclipse]: http://andrei.gmxhome.de/jdepend4eclipse/index.html
[JDepend4EclipseInstall]: http://andrei.gmxhome.de/eclipse/
[EclipseInstall]: http://agile.csc.ncsu.edu/SEMaterials/tutorials/install_plugin/index_v35.html
[JDependMetrics]: http://www.clarkware.com/software/JDepend.html#overview
[vpalepu]: http://vpalepu.com


JUnit
-----

### What is JUnit?
> JUnit is a simple framework to write repeatable tests. It is an instance of the xUnit architecture for unit testing frameworks. - [Junit 4.0][Junit]

### Which Version?  
[Junit 4.0][Junit]  
[Junit older versions][JunitOld]  

### Installation
Just download the JAR file and add it to your build path in Eclipse. [More details here...] [JunitInstall]

### Writing Tests with JUnit?  
- [Start here...] [JUnitStart]  
- Follow it up with [Junit Assertions here...] [JunitAssertions]  
- You can find a [simple code example using assertions here...] [Junit191]  

Here is an excerpt of that example:

{% highlight java %}
package edu.uci.inf191;
import static org.junit.Assert.*;
import org.junit.Test;
public class NumbersToStringTest {
        @Test
        public void NumberToEnglishShouldReturnOne() {
                String actual = NumbersToString.numbersToEnglish(1);
                assertEquals("Expected result one.", "one", actual);
        }
{% endhighlight %}
- [Extensive Junit Documentation @ github] [JUnitWiki]  


### Food for though
__Q.__ Do you think the JDK uses JUnit for testing? Remember, Junit came well after the JDK.

* * *

JDepend
-------

### What is JDepend? / What does JDepend do?
IMHO JDepend is a simple tool for measuring certain metrics about how packages in Java depend on each other.  

According to [JDepend's Official Webpage][JDepend]:

> JDepend traverses Java class file directories and generates design quality metrics for each Java package, including:
> 
> - Number of Classes and Interfaces
> - Afferent Couplings (Ca) - measure of Responsibility
> - Efferent Couplings (Ce) - measure of Independence
> - Abstractness (A) - Number of Abstract Classes and Interfaces
> - Instability (I)
> - Distance from the Main Sequence (D)
> - Package Dependency Cycles 

Further [details on the metrics here...] [JDependMetrics]

### Why do I like it?
It is a simple tool that succinctly captures how one Java package depends on another. This might be useful when building large projects or APIs to maintain "appropriate" (runtime) boundaries between different sections of your code base.

#### Why the double quotes around 'appropriate'?
- 'Appropriate' is what you define for your project.
- E.g. in a project following a client server architecture, you might want the client and the server to communicate via a middle-ware or an interface. Keeping the client code from calling the server code. OR, you very well could want the client code to call the server code directly.  
- You might want to avoid both the client and the server calling each others modules or methods. OR, perhaps you want them to communicate like that.  

### Installation and Learning curve

- INSTALLATION: I have tried the installation with Eclipse and it is simple.
	- Here is the [link for the same] [JDepend4Eclipse].
	- This is the [link for installing the plugin in Eclipse] [JDepend4EclipseInstall]
	- This is a good resource to learn how to [install any Eclipse Plugin] [EclipseInstall]  
- LEARNING CURVE: As long as you know what packages are and how one package uses another, the learning curve is non-existent. I have not yet tried using it in an advanced manner, like with JUnit or with Ant. There might be some learning curve there but it should be trivial.