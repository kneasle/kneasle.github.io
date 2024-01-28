+++
title = "This Site"
description = "The website you're looking at right now."

date = 2023-12-21

languages = ["web"]
topics = ["misc"]
+++

**This site** is my personal website.  Everything - content, icons, CSS/web design, etc. - is made
from scratch by me.  The source code can be found
[on GitHub](https://github.com/kneasle/kneasle.github.io).

I had a really specific vision for the site - to combine projects, blog and any JS demos as pop-ups in
a single page with a matrix-style header of scrolling code.  My previous site had been generated
by the static site generator [Zola](https://www.getzola.org/).  While this was convenient for
basic blog-style sites, I always had a tendency to want more customization than existing site
generators were able to provide.  Adding to that, the vision I had for this doesn't fit at all
well with the model provided by static site generators so, inspired by
[matklad's blog](https://matklad.github.io/2023/11/07/dta-oriented-blogging.html), I decided to try
writing a custom one-off static site generator script to automate the tedious parts of site generation
while allowing infinite flexibility.  I would consider that to be a great decision - leveraging
Node's vast collection of libraries allows me to use easy-to-use libraries for all the 'solved' tasks
(HTML templating, compiling Markdown and SASS, etc.), leaving me to focus only on the specifics of
my own site.

## Technology Used

The site content is written in [Markdown](https://en.wikipedia.org/wiki/Markdown),
[TypeScript](https://www.typescriptlang.org/) and [SASS](https://sass-lang.com/).  The HTML is
mostly handwritten, but the repetitive parts of the site are templated using
[Moustache templates](https://mustache.github.io/).

All of these are great tools to simplify web development, but their souce code can't be used directly in a web
browser.  Therefore, some other program is required to 'build' the site to straight HTML/JS/CSS
in the format consumed by browsers.  This type of program is usually known as a "Static Site Generator"
and there are many, many, many general-purpose site generators.  However, as described above, this site is
built by a small TypeScript script hosted using [Deno](https://deno.land).

The resulting HTML/JS/CSS is then hosted on GitHub pages and I use GitHub action to automatically
update the hosted site every time the source code changes.
