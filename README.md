## Raison d'être

When reading complex documents there’s a cognitive overhead to parsSome documents deserve restructuring but this work is cognitively demanding because one must keep in short term memory the original structure and meaning along with candidates for the new structure.

What’s needed is a tool which minimises unnecessary cognitive work involved in surfacing a document’s semantic structure.

### 1-line explainations
- An app for visualising semantic structure to make documents easier to understand
- Externalise your mental model of a document
- Quickly parse complex documents
- Make documents easier to parse

## Help

The main issues I’m facing (and needd help with) right now are:
	- [how to explain the core concept](https://github.com/dannyhope/Grok/issues/3 "")
	- [figuring out what to build first](https://github.com/dannyhope/Grok/issues/4 "")

I’d appreciate your thoughts on the stuff in the **woefully incomplete** design doc: [Grok.graffle](https://github.com/dannyhope/Grok/raw/master/Grok.graffle "") (requires [OmniGraffle](http://www.omnigroup.com/download/latest/omniGraffle ""))

[Please tweet feedback/thoughts to @yandle](http://twitter.com/yandle "Me on Twitter")

## How it could work

### The transclusionish way

- Users indicate a source document
- We take a copy of this, the copy is immutable (changes are stored as diffs)
- We present 2 columns – the source document appears in the left column, the right column is where you do the restructuring stuff
- Parts of the source can be transcluded into column 2
- Parts that have been transcluded and are dimmed in the source
- Content can be added to both the source and the restructured document
- Transclusions can be edited (in this case diffs must be accessible)
- Transclusions can be joined together to form:
	- lists
	- tables
	- lists and tables can be nested inside each-other
- Selections can be minimised (with shortcuts for quickly affecting descendants/siblings)
- Changes are tracked so you can get back to any previous state (with a timeline slider or something)

### Objectish way

- [▶ Create table, split cell, delete string](http://youtu.be/ybJWXC9q0as "")
- [▶ Split, tabulate, contract](http://youtu.be/5rkMFeTGPUA "")
 
## Specific interactions

- Pressing return bisects the object 
<pre>
	Container element  | What’s created/where
	-------------------|--------------------------
	P                  | 2nd P
	LI                 | li (inserted in the list) 
	TD                 | 2 Ps inside the TD
</pre>
- Multiple objects can be selected (⌘-click or whatever)
- Multi selections can be turned into lists or rows
- Hover over an element in the right-hand column to show it’s origin (in the source column)
- Drag an object into an other object to make it a child of that object

## Thanks

Tom Ashworth for the name

[Please tweet feedback/thoughts to @yandle](http://twitter.com/yandle "Me on Twitter")
