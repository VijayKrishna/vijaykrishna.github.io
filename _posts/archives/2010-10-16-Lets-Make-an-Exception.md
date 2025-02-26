---
layout: post
title: Lets Make an Exception
tags: exception-handling
categories: ['blog']
---

Just out of college, a computer engineer, a thinker. Wanted to write some real code. Did write it. Took my 1st snippet of code on to a live production environment. It ran well. Phew!!! No issues there. And then i got my first ever app to write. You know, the one with the user interface. That is when i had my tryst with the end user, the customer, the purpose and the fool.

It was running smoothly! Flawless was the word. Then all the weird cases start to crop up. Things you would have never imagined, would stare you in the eye and say, "I dare you to get past me." That is when you realize that the 1st step to writing good production code is being exceptionally good at Exceptional Handling. There is no point in calling yourself a good coder if you can not even think of the assumptions and errors the end user will make while running your application all by himself and then blame it all on you for not handling things so very trivial. I would like to trade places with him and then watch the fun. But, the customer is always right, primarily because he is paying me good money to write the code. So, i might as well take the blame, or not, by writing good code.

So here are a few pointers i got over this last one week's experience at work on exceptions and their handling:

### Beware of the Null:  
Now many people have this issue. And one has to be careful of this monstrous void which comes back to plague us time and time again. Understand the distinction between null and zero. Think of null as an empty bowl. (The bowl being the variable) It contains nothing. Can a chef make soup if he was given just the empty container? I don't think so. He will ask you to pour at least water in it, so that he can begin his cooking, right? Similarly, even a function or method in a program will want you to fill the variable argument with something more than null, even if it is a zero.

Make up your own custom values which mean null to you, but not to the program. For numerics a 0 or -1 serve very well to that end. The same is taken care of by zero length strings("") and characters('') when it comes to textual data. Remember they are not null. They do have some value.

In summary, a NULL is the absence of a value. They might be useful at some places, however, most functions cannot use them. So take care of those variable values before passing them as arguments to functions. If you feel that the user might just forget to enter the value for any field, then make it mandatory for him to fill it. If you cannot do that and you think that there is a chance, even a small one, that one of the inputs is going to be null, convert it to a Zero or an Empty String with a simple ternary operator:

{% highlight csharp %}
int userAge = getUserAge() == null? 0 : getUserAge(); //getUserAge() returns an int
string userAddress = getUserAddress() == null ? "" : getUserAddress(); //getUserAddress() returns a string 
{% endhighlight %}

Trust me half your bugs will be sorted out this way. Mind you even an Empty string or a Zero might create issues. It all depends on the logic of your code. So the best thing to do is to take care of these cases while thinking of the logic of the program itself.

### Understand the theory of the DateTime Continuum:
This is another area of programing which most fall prey to. Understand this and you will have a better command on the pockets of your customer. The reason is simple, time is money. It becomes really important for you to understand the nuances of international time conversions, especially if your customer is on the other side of the planet. In a difference of a single second the date changes, and your users are left wondering as to how the weekend disappeared, the season changed and the financial year ended. Nonetheless, like most complicated problems this too has a simple solution: Coordinated Universal Time or popularly known as the UTC, Universal Time Coordinated. Keep this as the reference. It will solve most of your problems. You cannot keep everyone happy. Do not try to. Show and deal with time in UTC and you will realize that life is much more simpler. There are many functions and utilities in the modern programming languages that take care of these issues. DateTime.UTCNow() is one such popular example from C#.

That was one dimension of the continum. :D. There is another aspect which needs care. The Date Format. The whole conflict between MMddyyyy and ddMMyyyy is a real mess. With client side technologies like Silverlight (atleast this is one place where i faced such an issue) which renders a lot of code on the users' machine, it is important to clearly specify the DateTime format in your code. Imagine January 12th on your machine will become 1st December for end user or vice versa. It leaves the user wondering if you created a time machine which can easily port you through the ages, talk about expectations!

### Respect the Decimal:
This is the ultimate nemesis for any programmer. STOP ROUNDING OFF FRACTIONS!!! Look, it is really that simple. You can be in your safe zone by working with integers. But, if you really care about the meals you eat at night, show some patience towards float and double. They are there for a reason. I used to curse the engineers of the Math Co-processor(8087) back in my third year days when i had to make complicated floating point programs in assembly language classes. But today, when i see how particular people are about saving the last cent of their hard earned money, and rightly so, i respect the efforts that went into the 8087.

Do not use int when you are dealing with money, weight, scientific calculations or anything dealing with fractions. 
Do not round off fractional values until you have to show it on the UI, this keeps the precision alive all the way till the end. 
Do not type cast to int unless you really really must. 
Let the user decide the kind of precision he wants, till then keep it very precise.
Learn a little of percentages and ratios, it will make life simpler when you make complicated programs including money and profits.

### Try Catching them at the e.o.d.:
You are not brilliant. Accept that fact. You cannot preempt and handle every single bug that your code will face. There is no shame in that. That is the reason why exceptional handling is such an integral part of programming languages these days. It is a good practice to have an issue tracker in place. Spawn those try..catch blocks everywhere in your code. And log all those exceptions in CSVs or text files. Review and handle them everyday. This is the ultimate line of defense against exceptions.

In conclusion, all i have to say is this: preempt as much as possible when you think of the logic of an application. Try and tackle those foreseeable bugs in your logic. Handle the rest while you code. Do not stop thinking of them while you write your code. Tweak the logic at places if required, while maintaining the essence. And log all the exceptions you encounter while running the code. Be fearless about those bugs. Face them! They are nothing but trivial pests waiting to be squashed.