---
layout: post
title: Plotting Box-plots in Groups for Vectors of Varying Lengths
categories: ['blog']
tags: ['matlab', 'box-plot', 'colorfill', 'groups']
---

Back Story
----------

So this last week i was approached by my lab-mate if i knew how to work with Matlab. I said "Yes.", very reluctantly. He wanted to plot multiple box-plots on the same canvas. However, the box-plots were required to be grouped based on a specified configuration. It seems it was the second part, involving the grouping, he could not achieve with [Matplotlib](http://matplotlib.org/).

He found the following library in Matlab which seemed to achieve the same: [http://alex.bikfalvi.com/research/advanced_matlab_boxplot/](http://alex.bikfalvi.com/research/advanced_matlab_boxplot/). And hence the need for the knowledge of Matlab, not to mention a licensed copy.

It seemed pretty straight forward and so i agreed to take on this seemingly benign task. I mean, it was just plotting a bunch of box plots. However, it was an important task, as these plots would be inserted in his paper that he was submitting to a conference that was fast approaching. So this concoction of complacency and high value of the task, quickly proved that i should not have agreed to0 quickly. That being said, it was a good refresher in Matlab and it served as a good diversion from work.

Plotting multiple box-plots on the same canvas
----------------------------------------------

The Matlab library [above](http://alex.bikfalvi.com/research/advanced_matlab_boxplot/) did not exactly work out. This was because, while this library did provide the ability to plot multiple box-plots on the same canvas, and specifically allowed for groupings, it did not account for the data vectors that the box plots themselves were based on to be of different size, more precisely of different lengths.

And so after trying a number of different things, I resorted to the standard [box-plot library in Matlab](http://www.mathworks.com/help/stats/boxplot.html). A box-plot in Matlab, as one would expect, takes in a matrix as its data source. If the matrix is a vector then there would be one box. If the matrix were 2 dimensional, there would be a box for each column and that is how you would get multiple box-plots on a single canvas.

However, a matrix would never store multiple columns of varying sizes. And this was a central requirement for my lab-mate and his plots. So i looked into groupings. Box-plot Groups allow for different values of one big vector of data values to be mapped to different boxes on the same canvas. Consider the following vector and its group:

{% highlight r %}
x = [1,2,3,4,5];
group = [1,1,2,2,2];
boxplot(x,group);
{% endhighlight %}

The above small code snippet suggests that values 1 and 2 correspond to a box-plot 1, while value 3, 4 and 5 correspond to box-plot 2. And the code snippet `boxplot(x,group);` would produce the following box-plot.

Click here if you are unable to view the image properly in your browser: [boxplot]({{ site.url }}/images/boxplot.svg)  
<img src="{{ site.url }}/images/boxplot.svg"/>


Spatial Grouping of Box-plots along the X-axis
----------------------------------------------

That was simple enough. The two box plots are based on two very different group of data sources of two different lengths. But now, I had to group these box plots together based on the horizontal X-axis positions. 

In order to do that I looked into the `positions` option. You can explicitly define the X-axis positions of each of the box plots as follows.

{% highlight r %}
x = [1,2,3,4,5,1,2,3,4,6];
group = [1,1,2,2,2,3,3,3,4,4];
positions = [1 1.25 2 2.25];
boxplot(x,group, 'positions', positions);
{% endhighlight %}

The code above produces the following plot with the two sets of box-plots grouped together along the X-axis.

Click here if you are unable to view the image properly in your browser: [boxplot]({{ site.url }}/images/boxplot2.svg)  
<img src="{{ site.url }}/images/boxplot2.svg"/>

This is the plot when you fire the command without the `positions` option, i.e.  `boxplot(x,group);`. Clearly, the groupings along the horizontal X-axis have disappeared.

Click here if you are unable to view the image properly in your browser: [boxplot]({{ site.url }}/images/boxplot2b.svg)  
<img src="{{ site.url }}/images/boxplot2b.svg"/>

Color Fill
----------

To follow this up, we wanted to color the boxes, and as it turns out the box-plot library in Matlab does not provide an option for color filling the boxes of the box plots. To do that, i turned to [stackoverflow with this question](http://stackoverflow.com/questions/15125314/colorfill-the-boxes-in-a-boxplot-in-matlab), which gave us the following piece of code. And thus, the wonderful piece of colored box-plots in the figure to follow. Oh, and in case you do not understand the following piece of code, the [answer](http://stackoverflow.com/questions/15125314/colorfill-the-boxes-in-a-boxplot-in-matlab/15126949#15126949) to the stackoverflow question gives a detailed explanation of the same! 

{% highlight r %}
x = [1,2,3,4,5,1,2,3,4,6];
group = [1,1,2,2,2,3,3,3,4,4];
positions = [1 1.25 2 2.25];
boxplot(x,group, 'positions', positions);
h = findobj(gca,'Tag','Box');
 for j=1:length(h)
    patch(get(h(j),'XData'),get(h(j),'YData'),'y','FaceAlpha',.5);
 end
{% endhighlight %}

Click here if you are unable to view the image properly in your browser: [boxplot]({{ site.url }}/images/boxplot3.svg)  
<img src="{{ site.url }}/images/boxplot3.svg"/>

### Colors for each Groups

To make things more interesting, I used a vector of colors to have different colors for different groups using this piece of code `color = ['y', 'y', 'c', 'c'];` and the use of `color(j)` in the for loop. Resulting in an even more interesting figure.

{% highlight r %}
x = [1,2,3,4,5,1,2,3,4,6];
group = [1,1,2,2,2,3,3,3,4,4];
positions = [1 1.25 2 2.25];
boxplot(x,group, 'positions', positions);
color = ['y', 'y', 'c', 'c'];
h = findobj(gca,'Tag','Box');
 for j=1:length(h)
    patch(get(h(j),'XData'),get(h(j),'YData'),color(j),'FaceAlpha',.5);
 end
{% endhighlight %}

Click here if you are unable to view the image properly in your browser: [boxplot]({{ site.url }}/images/boxplot3b.svg)  
<img src="{{ site.url }}/images/boxplot3b.svg"/>

Conclusion
----------

And to top it all, I used the [`plot2svg` library](http://www.mathworks.com/matlabcentral/fileexchange/7401-scalable-vector-graphics-svg-export-of-figures) to create SVGs out of the plots to preserve the details. And viola!, we now had perfect SVGs that captured   
- multiple box-plots in one canvas,  
- based on vectors of different lengths for each box-plot,  
- grouped spatially, along the horizontal X-axis and  
- colored each group with their own different specific colors.