---
title: ["Improving Efficiency of Dynamic Analysis with Dynamic Dependence Summaries"]
categories: ['publication']
authors: ["Palepu, Vijay Krishna", "Xu, Guoqing", "Jones, James"]
conference: ["2013 28th IEEE International Conference
on Automated Software Engineering (ASE)"]
pages: ["pp.59-69"]
dates: ["11-15 November 2013"]
links: [["paper", "publications/ase13_palepu_xu_jones.pdf"], ["slides", "slides/ase13.pdf"]]
permalink: /index.html
nick: ["Dynamic Dependence Summaries"]
image: ["dynamic-summary.png"]
abstract: ["Modern applications make heavy use of third-party libraries and components, which poses new challenges for efficient dynamic analysis. To perform such analyses, transitive dependent components at all layers of the call stack must be monitored and analyzed, and as such may be prohibitively expensive for systems with large libraries and components. As an approach to address such expenses, we record, summarize, and reuse dynamic dataflows between inputs and outputs of components, based on dynamic control and data traces. These summarized dataflows are computed at a fine-grained instruction level; the result of which, we call “dynamic dependence summaries.” Although static summaries have been proposed, to the best of our knowledge, this work presents the first technique for dynamic dependence summaries. The benefits to efficiency of such summarization may be afforded with losses of accuracy. As such, we evaluate the degree of accuracy loss and the degree of efficiency gain when using dynamic dependence summaries of library methods. On five large programs from the DaCapo benchmark (for which no existing whole-program dynamic dependence analyses have been shown to scale) and 21 versions of NANOXML, the summarized dependence analysis provided 90% accuracy and a speed-up of 100% (i.e., ×2), on average, when compared to traditional
exhaustive dynamic dependence analysis."]
---