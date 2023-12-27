+++
title = "WikiLinks"

date = 2023-12-21
draft = true
+++

# WikiLinks

## Introduction

When I was a kid - more of a kid than I am now, anyway - there were countless urban myths and theories about 
Wikipedia, many of which were completely untestable and likely entirely wrong.
However, one statement in particular that grabbed my attention _is_ verifiable...

### Following Some Links

Suppose you take any article from English Wikipedia, and click on the first link in the body of the page
that isn't inside brackets.

`<Insert example here (from [article #1] to [article #2])>`

This will take you to a new article, so you click on the first link in that page body.
This takes you to yet another page, so you click the first link again.

And again.

And again.

This process is building up a **chain** of articles, each one of which 'links to' the next.
Here's the full chain of articles that follow from `[article #1]` (correct as of the 1st of July 2020):

`article #1` \
⟶ `article #2` \
⟶ `article #3` \
⟶ `article #4` \
⟶ `Philosophy` \
⟶ `Metaphysics` \
⟶ `Philosophy` \
⟶ `Metaphysics` \
⟶ ...

Something interesting has happened here - `Philosophy` links to `Metaphysics` and `Metaphysics` links back
to `Philosophy`.
So this chain will carry on to infinity, alternating forever between `Philosophy` and `Metaphysics`.
For simplicity we should end the chain here, and say that the entire chain 'leads to' either `Philosophy`
or `Metaphysics`.
I will call this phenomenon a **cycle** over `Philosophy` and `Metaphysics`, and these cycles are the key
to analysing these chains of articles.

### Following Some More Links

```
Insert another example that also leads to Philosophy
```

This brings up an interesting point, which is bringing us closer to the theory that we will be analysing.
We have found two different chains, both of which eventually lead to `Philosophy`.
Here are some more chains which also lead to `Philosophy`:

```
Insert more examples here.
```

I invite you to experiment with this yourself - hop onto Wikipedia, go to a
[random page](https://en.wikipedia.org/wiki/Special:Random), and see where you end up!
It's very fun and honestly quite addictive -
not to mention how easy it is to get distracted reading the articles!

## The Myth

We've now seen `<some number>` chains, containing `<some number>` articles, _all_ of whom eventually lead 
to `Philosophy`.
The urban myth claims that this is true not just those shown above, but of _all_ articles in English Wikipedia.

Wait.

What?

_Every_ page?

Surely not!

### A Counter-Example

OK - I'll come clean with you.
The myth is not _entirely_ true - but in 2011 when it became a meme 
[on Reddit](https://www.reddit.com/r/pics/comments/gpdhb/try_thiswikipedia_mindfk/) and
[on xkcd](https://xkcd.com/903/) (see the hover text)
it was **much** truer than I expected - roughly
[95%](https://en.wikipedia.org/wiki/User:Ilmari_Karonen/First_link)
of pages eventually led to `Philosophy`.

The most obvious proof is that any page with _no_ valid links cannot ever lead to `Philosophy`,
for example `<Some Article with no links>`:
```
Image of a page with no links.
```

Also there are other cycles that _don't_ include `Philosophy` (for example 
`Chair` ⟶ `Furniture` ⟶ `Chair`), and therefore neither of _these_ articles can lead to Philosophy either.

## Some ground rules

But all is not lost!
We've answered the original question but discovered another much juicier question:
**_What percentage of English Wikipedia articles lead to Philosophy?_**

However, there are about 6 million articles in English Wikipedia,
so this is absolutely not a problem that can be solved by hand.
But before we get near a computer, we need to lay down some ground rules about what counts as the first
link in a page.
I'm using the rules specified by the
[Wikipedia article on this topic](https://en.wikipedia.org/wiki/Wikipedia:Getting_to_Philosophy),
since all the historical data on the subject is based on these rules.

So, for every page we click on the first link in the body that follows the following the conditions:
- It is not (inside parentheses)
- It is not in _italics_
- It links to a page that is in English Wikipedia and isn't the current page
- The page it links to actually exists (links to non-existent pages are red - see following picture):
```
<PICTURE OF RED LINK>
```

## Clicky stuffs
- [The page which this is all about](https://en.wikipedia.org/wiki/Philosophy)
- [The xkcd comic who's hover text seems to have started this whole thing](https://xkcd.com/903/)
- [The reddit post that seems to have started this whole thing](https://www.reddit.com/r/pics/comments/gpdhb/try_thiswikipedia_mindfk/)
- [Wikipedia article describing the rules](https://en.wikipedia.org/wiki/Wikipedia:Getting_to_Philosophy)
- [The source of the 95% statistic](https://en.wikipedia.org/wiki/User:Ilmari_Karonen/First_link)
- [A not-so-helpful news article on this topic](https://psmag.com/news/all-wikipedia-roads-lead-to-philosophy-but-some-of-them-go-through-southeast-europe-first)
