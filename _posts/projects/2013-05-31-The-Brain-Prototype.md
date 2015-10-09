---
layout: project
title: The Brain - Prototype
tags: [SpiderLab, ISR2013, Program-Execution, Visualization]
categories: ['project', 'research-project']
one-liner: An online HTML5 application that can be used to visualize the execution of a single run of a sample Java program.
from: May 2013
to: Current
speakerdeck: 21611be0eb9f0130e8c12215e0a0aba7
---

<!-- {{ page.title }}
================ -->

<blockquote class="twitter-tweet">
  <p>My demo @ <a href="https://twitter.com/search/%23ISR">#ISR</a>, <a href="https://twitter.com/search/%23UCI">#UCI</a>... <a href="http://t.co/VA5xLL0D3S" title="http://www.ics.uci.edu/~vpalepu/site/brain.html">ics.uci.edu/~vpalepu/site/…</a> went live this morning ... Go explore a program execution :)</p>
  &mdash; Vijay Krishna (@vkrishnapalepu) 
  <a href="https://twitter.com/vkrishnapalepu/status/340569354448023552">May 31, 2013</a>
</blockquote>

This is a very early prototype to assist developers, supported with visualization, to explore a program execution. This for instance would allow a developer to identify sections of the code that were executed right before a failure occurred because chances are that the fault is likely to be present in those sections (it might not be the try-catch block where the exception occurred, but probably the code that got executed before the try-catch block, that led to the exception). This alleviates the burden of manually figuring out the execution sequence, for instance using a debugger. This prototype looks at a single recorded execution of [NanoXML](http://nanoxml.sourceforge.net/orig/).

Each node in the visualization happens to be a source code line in the Java program, NanoXML. The layout of the source code, or the nodes, is guided by a force directed graph based on how the source code instructions are dependent on each other.

**IMPORTANT** Stay at the page for about 30-60 seconds for the visualization to load completely. The loading process currently suspends itself if you move away to another tab in your browser.

**All Feedback is appreciated!** Send your feedback to vpalepu @ uci . edu

Also, thank you [HTML5](http://www.w3.org/html/logo/) and [D3.js](d3js.org) for killing the learning curve with developing web-applications! This was a 12-hour hack for a HTML5 newbie, which would not have been possible had the underlying technology not been so straight-forward!

{% include speakerdeck.html id=page.speakerdeck %}