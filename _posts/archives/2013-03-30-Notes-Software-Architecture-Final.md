---
layout: post
title: Notes for my Software Architecture Final
categories: ['blog']
tags: ['notes', 'final', 'software-architecture']
---

The following are the notes for my Software Architecture final at UCI. 
This is a link for the course website http://www.ics.uci.edu/~taylor/classes/221/syllabusWQ13.html.

The highlevel problem statement for the exam is as follows.
> Credible market research surveys indicate that there is an opening for a (insert your chosen domain here) product, or product line. You decide to pursue this opportunity and have been able to successfully line up funding sufficient to fund yourself plus three developers for 18 months. After that time additional funding will be available for marketing and sales. This additional money will also enable you to retain one developer for at least the following 3 years for further product development and support.  (Note: do not choose “lunar lander” or any isomorph as your domain.)
>
> Based upon your experience and your knowledge of software architecture, how would you technically approach this opportunity? Answer this question by responding to the following specific questions. Assume that you decide to adopt a “best practices” approach, as exemplified by techniques and discussion found in the textbook.

Given that, i will now list out all the questions with the answers that i gave for each of these questions. These questions were given to us a few days before the exam. We had to figure out all the answers and write them up during a designated 80 minute examination period. While such a format might sound easy and 'student friendly', i have to say that it is a very useful way to review and think about everything that you learnt in the class during the entire term.  

Also, the answers i finally wrote in the test were paraphrases of the answers i list here. So, here they are.  

#### Ans 1

> Q1. (2 pts) What is your chosen domain? What will the products be? Just give me enough information so that I will be able to understand how your answers to the following questions are grounded in this example domain. (This is only worth two points, so don’t waste time with a long answer here.)

My chosen domain is that of Inventory Management for Hotels. the final product(s) will be a software system that will allow hotel owners/employees to manage the inventory in their hotel. This includes tracking and monitoring the items in the inventory, managing the history of inventory, managing purchasing of the products, and possibly tracking other the assets such as delivery systems that support the inventory of the hotel.

----

#### Ans 2

> Q2. (30 pts) Assume that one of your first decisions will be determining how to make and maintain a model of your product or product line.  
> (a) What are the advantages and disadvantages of using UML for this purpose?  
> (b) What modeling notation would you consider as the best alternative to UML for use in this project? Why?  

##### a. Advantages and Disadvantage of UML:

###### Advantages:
1. The diversity of modelling diagrams in UML allows the modelling of multiple viewpoints of the architecture under one notation set.
2. UML is known to have extensive suport when it comes to modelling object oriented systems. This is useful for my choosen product as it is natural to model a system using an object oriented approach that essentially assits in the management of real world items or objects.
3. UML is a popular modelling notation and thus has a rich eco-system of tools, reference literature and FAQ support. Many of these tools actually support code generation given the models. This can be particularly useful when it comes to maitaining consistency between the models and implmentaions of the product(s).

###### Disadvantages:
1. Limited support for consistency checking across different diagrams. Has to be done manually.
2. Presence of ambiguity in the meaning of various notations across different diagrms. For instance a dotted arrow in a class diagram is semantically different from that in a sequence diagram.
3. As a general purpose modelling language without being extensible, it might be difficult to model certain kinds of architectures. The lack of inherent support for modelling product lines is a good example. This is particularly an issue for my project which is planed to be executes as a product line.
4. Difficult to maintain the right level of abstraction.
	1. The rich notation set allows the modelling of every tiny detail of the system, including the internal logic of certain methods or components. 
	2. This might seem like a positive, but implies that every desgin decision is being modelled as against the principle design decisions, i.e the software architecture. 
	3. this makes the mapping problem particulary hard, i.e. maintaining the consistency between the implementaion and modelling difficult. As everytime a change in one space, say model, has to be reflected in the other space, say implementation. Thus introducing architectural drag and errosion. (Unless you can develop software entirely using models, which i am not sure is entirely possible so far.)


##### b. My alternate choice for modelling the system would xADL. This is so because, 
1. xADL provides a simple, clean notation set with no ambiguity between notations, where components and connectors are first class citizens.
Aside: Components and connectors as first class citizens, in my opinon, is particularly important because computers and software, from a very early age have always been viewed as black box(s) (components), with data (inputs and outputs) flowing through them (via connectors).
2. Extensible notation based on the XML standard, that allows me to extend and limit the language in a way that is specific to the needs of my project. Thus, I will be able in a position to develop my own notation set for modelling a product line architecture, even if general purpose support for the same exists but is not entirely suitable to my project. 
3. The simplicity, lack of ambiguity and extensibility in the notation set will allow for quick addoption for the development team. This will be important as it is a time sensitive project.
4. XML-base allows analysis of the model, possibly in an automated manner. Thus, i can develop simple tools based on readily available XML parsers to check for both model accuray and consistency both within each and across all diagrams. For instance, i can check for model consistency across different diagrams representing different viewpoints or different products in my product line architecture.

-----

#### Ans 3

> Q3. (30 pts)
> (a) What will be your approach to implementation, and to the problem of keeping your implementation consistent with your architectural model?  
(b) What risks exist for your chosen approach? How will you manage those risks?  
(c) How does this chosen plan reflect what you learned from the homework assignment in the class?  


##### a. The implementation of this project, will be segregated into two distinct sections:

1. Interfaces or Abstract Classes
2. Implementation Classes

- Interfaces will be tightly coupled to the architectural models. 
- There will be a 1-to-1 mapping between the elements of the models and the interfaces. 
- For instance, in the case of UML there will be a one to one mapping with the interfaces in the class diagram. 
- Similarly, if the xADL approach is used, then the interfaces generated by tools in ArchStudio for a given set of xADL models will be directly used in the code base. 
- Interfaces will serve as contracts for what needs to be implemented. Thus, in the case of xADL these contracts will specify a) the sets of computation are, e.g. model, view, and controller, and b) the kind of interactions taking place between those computation sets, e.g. Asynchronous Events.
- Implementation Classes will essentially implement these interfaces by inheriting from them. Thus, adhering to the contracts set forth by the Interfaces.
- It is also worth noting that the Interfaces will be smaller in number, suggesting a core set of design decisions, as against the Implementation Classes, where each a number of classes will implement might implement a single interface while varying in the internal implementation. For instance, the View Interface, will be implemented by the TextLogs Class, GridUI Class and WidgetUI Class. All three classes will interact with Classes implementing the Model and Controller interfaces, in an Asynchronous event driven manner, which again could be implemented by different internal logics for all three classes.

##### b. Managing the consistency between the implementation and architecture.:
- Tight coupling between the models and the Interfaces will ensure consistency between the models and the interfaces.
- Changes in the models will be reflected in the interfaces by automatically generating them after any change in the model.
- The source code of the interfaces will not be edited directly. The interfaces will be changed via changes in the models if needed. This will be ensured using SCM for the models and the code, along with weekly peer reviews for code and models.
- Thus, there is no need to ensure a 2-way mapping between the interfaces and the models.
- Since the implementation classes only implement the contract set froth by the interfaces they will maintain consistency with the interfaces, and thus with the architecture indirectly.
- Any change in the interfaces will break the code and thus force a change, in the implementation classes.
- A need for change in the interface emerging from the implementation classes will be propagated to the models.
- There will be no implementation class that does not implement at least one of the Interfaces. This too will be controlled using SCM and weekly code and design reviews.
- As for the toolset, i envision the use of Java, xADL, Eclipse and Archstudio.
- this idea is borrowed from the work done by  1.x Way Mapping by Zheng and Taylor.

##### c. Risks of the chosen approach:
- i might not be able to maintain the right level of abstraction during my modeling. Too much abstraction will render an incomplete architecture allowing a few design decisions to leak into the implementation. while this might not sound like a bad thing, the issue is that this might prevent concrete documented knowledge about the architecture, i.e. principle design decision, i.e. what the system does essentially.
- On the other hand, if the architecture and thus the interfaces, model too much of the system, i.e. cater for design decisions that should have been best left to the implementation classes, then interface section of the implementation will be bloated with too many interfaces. Repeated changes via the models to such a bloated interface layer could then be time consuming and thus become motivation for direct changes in the interfaces, resulting in possible architectural drag and erosion.
- this might be a new approach to software development for the developers that i hire that there might be adjustment issues resulting in possible project delays.

##### d. During the homework assignment,
- I fundamentally came to the conclusion that using modeling notations to model the entire system or code base is not trivial and requires time and effort even for a simple and small game. 
- However, the modeling exercise allowed us to think through the details of the system and thus prepare appropriately for the implementation. 
- This guided me to model a small part of the system in the form of the Interfaces/Abstract classes (contracts) which will represent a set of core design ideas, which finally constrain the actual implementation (classes) and thus essentially propagate a common set of ideas across all parts of the implementation.

---
#### Ans 4. 

> Q4. (22 pts) What will your product-line architectural strategy be? Will you just have one product + plug-ins (for example)? A product line architecture complete with domain model and reference architecture as discussed in Chapter 15? (If so, how will your reconcile that choice with your limited development funds?) A Koala-style approach? For whatever choice you advocate, provide a rationale.


##### My product-line architectural strategy,
will be a traditional product line strategy where complete architectures for multiple products will be captures simultaneously.The architecture will contain various invariant and variant points. The invariant points will serve as the concrete reference architecture, while the multiple products can be modeled simultaneously using different combinations of the variant points.
E.g. an invariant could be UserInterface, and the variants could be TextualLogUI,  SpreadsheetUI or GraphicalUI. This for instance will allow me to sell products with appropriate feature sets at the right prices to Hotels with different needs.
 

##### Why:
- Having a concrete invariant view of the system will allow the development to proceed lesser doubt and ambiguity, as against having a partial reference architecture. I reason that greater the clarity about the system being implemented faster will be the rate of implementation at least relatively. And time will be a factor given the mere 18 months of development with just 3 developers.
- Having variant points will allow us to have a clear vision of the future, and allow the planning of the implementation. Typically factors like feature complexity, market forces, etc. will play a role in deciding which architectures are implemented before other. For instance, the development of a TextLogUI could preceded a GraphicalUI if we start with small scale hotels who are not willing to pay for a GraphicalUI.
- At the same time, have a single product will not allow me to cater to the varying needs to different hotels. A small scale hotel might want to pay just for a simple SpreadSheetUI, while a fancy 5-star hotel might want to invest in a GraphicalUI.
- NOTE: Designing the architectures does not imply implementation. It is very likely that all possible products are not implemented due to a number of reasons.

----

#### Ans 5

> Q5. (16 pts) What do you believe to be the top three techniques, processes, notations, or tools to assist you in maintaining conceptual integrity? For each of the three explain how it assists in the task.


##### Top 3 techniques for Conceptual Integrity.

As i was unable to find a single definition of conceptual integrity on the internet, i would first like to define it as follows:

Conceptual integrity is a property of a system, where different parts or components of a systems reflect a single set of design ideas that are consistent and coherent with each other, instead of being independent or uncoordinated.

Brooks argues that Conceptual integrity is achieved by separating the architecture (key design ideas) from the implementation.

This leads me to submit that conceptual integrity is achieved when the correct or principle set of design ideas are identified, they are modeled consistently and the implementation abides by these ideas across the entire system.

Thus, i will suggest these following three points for identifying, modeling and implementing a single set of ideas across an entire system.

1. Model-Implementation mapping. This will help in identifying the correct set of design ideas. I will not expect to get this key set of design ideas in the first attempt. However, as the implementation progresses, we will be forced to update and refine our models. Such changes to the model will continue until we have identified the right set of key ideas.
2. Weekly code reviews. This will ensure that the implementation strictly implements the contracts set forth by the interfaces / abstract classes which in turn are tightly coupled to the models. Posing such constraints will ensure that the implementation is consistent across the entires system.
3. Automated consistency analysis of the models. Finally, using the XML base of the xADL models, i will build tool, if they are not already available, for checking the consistency of the models across different variant points in my product lines.