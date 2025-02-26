---
layout: post
title: Having Fun with Java Bytecode
categories: ['blog']
tags: ['Java', 'bytecode', 'instructions', 'syntactic-sugar']
---

Every programmer has at some point or the other asked this basic question: *how does stuff work under the hood?* Personally speaking, this has especially been the case for me when it came to syntactic sugar in programing language constructs. For instance, I have always wondered what a for-each statement (i.e. enhanced for loop statement) in Java compiles to, and how does it compilation differ from the compilation of a regular for loop.

In fact, I actually stumbled one such [question on StackOverFlow](http://stackoverflow.com/questions/17245450/how-are-array-object-created-when-using-a-bracketed-list) a while back that asked a similar question on how the following two code snippets differ upon compilation by Javac:

```
int[] myIntArray = new int[3]; myIntArray[0] = 10; myIntArray[1] = 20; myIntArray[3] = 30;
```

```
int[] myIntArray = {1,2,3};
```

Now, such syntactic sugar in array initialization, is simpler to inspect than the difference between the syntactic sugar between a regular for-loop and a for-each loop. However, the best way to carry out either inspection is to simply compile the two pieces of code that you want to compare, and take a look at the generated code --- and this is particularly easy in the case of Java, given the easy to read Java bytecode (yes, easy to read) and tools like Javap that come with any JDK installation.

So, take the following three snippets and let's compile and disassemble them:

```int[] array = new int[] {10, 20, 30};```  

```int[] array = {10, 20, 30};```    

```int[] array = new int[3]; array[0] = 10; array[1] = 20; array[3] = 30;```  

I do this by first putting them in a Java source file in separate methods:

{% highlight java %}
    public class ArrayTest {
      public static void main1() {
        int[] array = new int[3]; array[0] = 10; array[1] = 20; array[3] = 30;
      }
     
      public static void main2() {
        int[] array = new int[] {10, 20, 30};
      }
     
      public static void main3() {
        int[] array = {10, 20, 30};
      }
    } 
{% endhighlight %}

I put them in different methods so that the compiled (and eventual disassembled) code for the three snippets can be easily discernible, thus making it easier to compare.

After compiling the source code, you end up with a class file that you can run through Javap, which then yields the following disassembled bytecode view of the class file. And in case you are unfamiliar with reading bytecode, you can find an excellent reference and starting point on Wikipedia: 

- <http://en.wikipedia.org/wiki/Java_bytecode_instruction_listings>
- <http://en.wikipedia.org/wiki/Java_bytecode>

{% highlight java %}
public class ArrayTest extends java.lang.Object{
public ArrayTest();
  Code:
   0:   aload_0
   1:   invokespecial   #1; //Method java/lang/Object."<init>":()V
   4:   return

public static void main1();
  Code:
   0:   iconst_3
   1:   newarray int
   3:   astore_0
   4:   aload_0
   5:   iconst_0
   6:   bipush  10
   8:   iastore
   9:   aload_0
   10:  iconst_1
   11:  bipush  20
   13:  iastore
   14:  aload_0
   15:  iconst_3
   16:  bipush  30
   18:  iastore
   19:  return

public static void main2();
  Code:
   0:   iconst_3
   1:   newarray int
   3:   dup
   4:   iconst_0
   5:   bipush  10
   7:   iastore
   8:   dup
   9:   iconst_1
   10:  bipush  20
   12:  iastore
   13:  dup
   14:  iconst_2
   15:  bipush  30
   17:  iastore
   18:  astore_0
   19:  return

public static void main3();
  Code:
   0:   iconst_3
   1:   newarray int
   3:   dup
   4:   iconst_0
   5:   bipush  10
   7:   iastore
   8:   dup
   9:   iconst_1
   10:  bipush  20
   12:  iastore
   13:  dup
   14:  iconst_2
   15:  bipush  30
   17:  iastore
   18:  astore_0
   19:  return
}
{% endhighlight %}

Now, by simply comparing the three bytecode snippets, i.e. main1, main2 and main3, you can see exactly how those three lines of code get compiled and are different or similar from/to each other.

As it turns out the following two snippets actually mean the same thing to the Java compiler:

```int[] array = new int[] {10, 20, 30};```  

```int[] array = {10, 20, 30};```    

So, the `new int[]` is really an add-on type information that *might* be useful in making the source code more readable, or not :)

However, `int[] array = new int[3]; array[0] = 10; array[1] = 20; array[3] = 30;` is a whole other can of worms.

One way or another, knowing how to use tools like Javap that really allow you to "look under the hood" can really be useful. And knowing how things really work can often serve well in day-to-day software development, and not just help in resolving intellectual curiosities.

Happy hacking!  