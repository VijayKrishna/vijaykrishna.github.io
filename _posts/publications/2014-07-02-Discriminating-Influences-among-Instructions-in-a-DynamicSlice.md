---
layout: publication
title: ["Discriminating Influences among Instructions in a Dynamic Slice"]
categories: ['publication']
authors: ["Palepu, Vijay Krishna", "Jones, James"]
conference: ["2014 29th IEEE/ACM International Conference on Automated Software Engineering (ASE)"]
pages: ["to appear"]
dates: ["15-19 September 2014"]
links: [["paper", "publications/ase14_palepu_jones.pdf"], ["slides", "slides/ase14.pdf"]]
image: ["dyn_rel_example.png"]
nick: ["Discriminating Dynamic Influences"]
abstract: ["Dynamic slicing is an analysis that operates on program execution models (e.g., dynamic dependence graphs) to sup- port the interpreation of program-execution traces. Given an execution event of interest (i.e., the slicing criterion), it solves for all instruction-execution events that either affect or are affected by that slicing criterion, and thereby reduces the search space to find influences within execution traces. Unfortunately, the resulting dynamic slices are still often prohibitively large for many uses. Despite this reduction search space, the dynamic slices are often still prohibitively large for many uses, and moreover, are provided without guidance of which and to what degree those influences are exerted. In this work, we present a novel approach to quan- tify the relevance of each instruction-execution event within a dynamic slice by its degree of relative influence on the slicing criterion. As such, we augment the dynamic slice with dynamic-relevance measures for each event in the slice, which can be used to guide and prioritize inspection of the events in the slice."]
---