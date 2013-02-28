[Jekyll]: https://github.com/mojombo/jekyll
[1]: http://ics.uci.edu/~vpalepu
[2]: http://vpalepu.bitbucket.org
[repo]: https://bitbucket.org/vpalepu/website

[Home][2]  
[Repo][repo]

Personal Website for Vijay Krishna Palepu
=========================================

This is the source of my personal website using the static website generator [Jekyll][Jekyll]. It was a fun project to work on, especially on a tierd evening.

### Site Structure

The site structure is as follows:  

	.
	|-- _config.yml        #configurations for building the site  
	|-- _layouts           #templates for the different kinds of pages and posts  
	|   |-- default.html   #template for the pages (i.e. non blog-posts)  
	|   `-- post.html      #template for the (blog) posts  
	|-- _posts             #this folder needs to be added and all the posts in markdown or textile will go here.   
	|-- css                #the css for the site  
	|-- images             #the images for the site (needs to be added)  
	|-- index.html         #content of the index page  
	|-- blog.html          #content for the blog post listing  
	|-- news.html          #content for the news items
	`-- projects.html      #content for the project listing  

### Hosted at...

This site is currently hosted at two places: [here][1] and [here][2]. "Why?" you ask: because I am still trying to decide which is the better place to host it at. So meanwhile, i will choose both.

License
=======

The following directories and their contents are Copyright [Vijay Krishna Palepu][1]. You may not reuse anything therein without my permission:

_posts/  
images/  
publications/  
slides/  

Feel free to use the HTML and CSS as you please.

Credits
=======

This site is built using the awesome blog-aware, static site generator [https://github.com/mojombo/jekyll][Jekyll].