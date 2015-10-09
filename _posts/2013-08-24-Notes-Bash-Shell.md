---
layout: post
title: Notes on Bash, Shell and other useful stuff
tags: ['bash', 'shell', 'commands']
categories: ['blog']
---


#### Useful Unix commands / Bash Snippets / Resources

- list out the ppa's on your machine: `egrep -v '^#|^ *$' /etc/apt/sources.list /etc/apt/sources.list.d/* > ppa.txt`
- [Install sublime text ubunutu w/ ppa](http://www.webupd8.org/2012/06/sublime-text-20-stable-released-ppa.html)
- view the various versions of java installed on your machine. `update-alternatives --display java`. In fact you can do this for other programs as well, like ruby ... `update-alternatives --display ruby`.
- `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH -sOutputFile=file-compressed.pdf file.pdf`

#### Frequently used **`less`** commands  

{Key}...............{Command}  
`Space bar`.........Next Page  
`b`.................Previous Page  
`j or ↵ Enter`......Next Line  
`k`.................Previous Line  
`g`.................First Line  
`G`.................Last Line  
`<n>G`..............Line `<n>`  
`/<text>`...........Forward Search for `<text>`. Text is interpreted as a regex.  
`?<text>`...........Backward Search like /  
`n`.................Next Search Match  
`N`.................Previous Search Match  
`Escu`..............Turn off Match Highlighting (see -g command line option)  
`-<c>`..............Toggle option `<c>`, e.g., -i toggles option to match case in searches  
`m<c>`..............Set Mark `<c>`  
`'<c>`..............Go to Mark `<c>`  
`= or Ctrl+G`.......File information  
`h`.................Help. This is presented with less, q to quit.  
`q`.................Quit  

[http://stackoverflow.com/questions/8586648/going-to-a-specific-line-number-using-less-in-unix](http://stackoverflow.com/questions/8586648/going-to-a-specific-line-number-using-less-in-unix)  

#### Calling shell commands from Java
{% highlight java %}
Process p = Runtime.getRuntime().exec(new String[]{"bash","-c","echo something"}); // used to fire a bash command and logically a script from java.
{% endhighlight %}

or more ellaboratelly ...

{% highlight java %}
String shell_cmd = "echo something";
try {
	Process p = Runtime.getRuntime().exec(new String[]{"bash","-c", shell_cmd});
	System.out.println(p.waitFor());
} catch (IOException e) {
	e.printStackTrace();
} catch (InterruptedException e) {
	e.printStackTrace();
}
{% endhighlight %}

#### Useful things with Grep:

Find all direct dependencies for a Java project given that the source code is available. Run the following snippet of code in the source root of the target Java project.  
`grep -rh import . | sort | uniq > deps.txt`  
Run it without the `-h` to display the file for a given dependency as well : `grep -r import . | sort | uniq > deps.txt`  

http://stackoverflow.com/questions/109383/how-to-sort-a-mapkey-value-on-the-values-in-java