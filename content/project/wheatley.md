+++
title = "Wheatley"
description = "A human-like AI bell-ringer for online bell-ringing."

date = 2020-06-11
formattedDate = "Jun 2020 - Aug 2021"

languages = ["python"]
topics = ["bell-ringing"]
+++

Wheatley is an AI bell-ringer for [Ringing Room](https://ringingroom.com), a popular online platform
for [Change Ringing](https://en.wikipedia.org/wiki/Change_ringing) (a very English and largely
secular way of ringing church bells).  Wheatley heavily uses techniques from statistics and machine
learning to emulate the behaviour of human ringers, and Wheatley really stands out against similar
programs for its ability to seamlessly fit in with human ringers.  It is often very difficult to
tell the difference between Wheatley and a human ringer - often, the only give-away is
Wheatley's inhuman level of accuracy.

This makes Wheatley an invaluable tool in online ringing practices: very few human ringers can ring
more than two bells simultaneously but Wheatley can ring as many bells as required, to any tune (any
'method') that the human ringers want to ring.  Therefore, if Wheatley is present in a Ringing Room
'tower', then you do not have to worry about how many ringers turn up: you can ring as many bells as
you want, because Wheatley can fill in the extra spaces and will do so with perfect accuracy while
also being considerate of other ringers.  Wheatley's catchprase is that it behaves like:

> "A ninja helper with no ego"

## The Technology behind Wheatley

Wheatley was written by myself and my friend Matthew Johnson in Python.  The source code
can be found [on GitHub](https://github.com/kneasle/wheatley) and is published to
[Python's Package Index](https://pypi.org/project/wheatley/).

Wheatley uses Python's websocket library to interact with the Ringing Room servers, and numpy to
handle the numerical calculations required to detect and respond to the rhythm of human ringers.  We
decided to add type annotations to the entire codebase, which helps catch mistakes and allows code
editors to provide more accurate completions.  In CI, we automatically check the types for incoming
pull requests using [mypy](https://mypy.readthedocs.io/en/stable/).

By far the biggest challenge of Wheatley is determining - in real time - when its bells should be rung.  This
requires detecting (and adjusting to) the continually-changing 'rhythm' of the human ringers, and sending
websocket signals at the appropriate times to fill in the gaps.  Wheatley's current approach uses
techniques from statistics and machine learning, but applies them in a quite unique way: instead of
a model learning from pre-collected data _before deployment_, Wheatley's rhythm model learns **in
real time**, using the striking of human-rung bells as datapoints.  Ringing should always happen at
an evenly-spaced rhythm, so Wheatley uses a linear regression model to predict when its bells
should ring.  I'm sure there are more accurate and complex strategies, but linear regression turns out to
be impressively effective while still being simple to understand, implement and maintain.



<!--

One of my main hobbies is an English style of ringing church bells, known as 'Change Ringing'.
There is an age old problem in ringing: every bell in a bell tower requires one person to ring it
and (almost all) ringers can only ring one bell at a time.  If your tower has eight bells, but seven
ringers turn up, there is no way to ring all eight of the bells.  However much you want to, there
is no way to practice anything which requires all eight bells to be ringing.

## Spring 2020 and Ringing Room

Change ringing has an unfortunate property, in that it exclusively takes place in small
and often poorly-ventilated church towers.  This setup is not exactly compatible with
with world-wide outbreaks of airbourne viruses, so during 2020 it became suddenly impossible to
practice bell ringing.  However, two American ringers came to our rescue and created Ringing Room,
an online platform for bellringing.  This presents a shared virtual 'ringing room', with virtual
bell-ropes arranged similarly to their real-world counterparts:

(**TODO: Picture of Ringing Room versus normal ringing**)

However, the new platform of Ringing Room provides an opportunity: for the first time in history,
ringing can be performed entirely digitally.  A bell 'ringing' is simply a WebSocket event sent from a
browser, so a carefully written computer program can send an equivalent WebSocket event at the
right time and _interact seamlessly with human ringers_.

## The Creation of Wheatley

----

**Wheatley** is a computer ringer for the popular online change-ringing website
[Ringing Room](https://ringingroom.com) which aims to be a _'ninja helper with no ego'_.  Ringing
with Wheatley should feel just like ringing with another human ringer (with the exception that
Wheatley can ring any number of bells to anything without making mistakes).

Wheatley uses a number of novel techniques to work towards this goal.  The main one of these is that
Wheatley detects and adjusts to the rhythm of the human ringers in real time.  This adjustment is
most apparent when pulling off, since Wheatley will seamlessly pull off at the same speed as the
other ringers.  Wheatley will also wait patiently if other people pause to think, which is
particularly useful during practice nights.

----

## It's Summer of 2020

Wheatley is a product of my long summer holiday in 2020.  I'm sure the year 2020 will be imprinted
in everyone's memories as the year the world was put on pause, so it goes without saying that not
much was happening that summer.

The biggest effect of COVID on from my routine that summer was the loss of my main hobby - ringing
church bells.  Anyone who's been ringing will see the problem - ringing requires people to stand in
close company in poorly ventalated rooms for large periods of time, which is not exactly compatible
with a highly infections airbourne disease.

Not to be put off by something as small as a global pandemic, ringing _does_ continue.  Two American
ringers created a way for us to 'ring' together whilst not leaving our homes.  The result is
['Ringing Room'](https://ringingroom.com), a website that simulates ringing real bells by allowing
multiple ringers to make the sounds of real life bells and have those sounds syncronised across all
the ringers in a 'room'.  I say 'ring' in quotes here, because ringing on Ringing Room leaves
something to be desired when compared to 'real' ringing (this is not a criticism of Ringing Room -
I, and many many other people, are incredibly grateful to Bryn and Leland for the ability to keep
our hobby going).

On a positive note, online ringing does present some opportunites over real bells and ropes - for
the first time, it is fairly straightforward for a computer program to interact with human ringers
in a (hopefully) constructive way.  Ringing is already pretty unique in that it is mathematically
well-defined, which means that computer-aided ringing programs have existed for a while (the most
popular such program is [Abel](http://www.abelsim.co.uk/)).

However, all existing programs fall short in my opinion in one regard - ringing with them doesn't
feel like ringing with another ringer; they usually make little or no consideration to the human
ringers.  But this seems silly - computers should work around us, not the other way around.

## Enter Wheatley

Therefore, Matthew Johnson and I built Wheatley in order to fill this niche - Wheatley can
**constructively** ring only a few bells in a practice without requiring the human ringers to behave
any differently.

-->
