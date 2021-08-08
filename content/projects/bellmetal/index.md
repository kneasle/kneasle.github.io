+++
title = "Bellmetal"
description = "[archived] A Rust library for efficiently proving and generating change ringing touches"

weight = 200 # 2xx is for archived projects, to keep them at the bottom of the list

[extra]
links = [
    ["GitHub repo", "https://github.com/Kneasle/bellmetal"]
]
+++

**Bellmetal** was a Rust library that I wrote to aid me with composing change-ringing compositions.
Its main selling point was to try to be performant, flexible and simple to use - a noble goal that
turned out generate a huge amount of unwanted complexity, and ultimately resulted in me shelving
this project.  However, I do plan to use the ideas and lessons learned from Bellmetal in other
composing projects.

<!-- more -->

However, Bellmetal was not a failure, and was vital in the creation of [this
composition](https://complib.org/composition/65034), which I'm quite sure is the first time that a
peal composition _in its entirety_ has had rotational symmetry.  The flexibility of Bellmetal was
vital here, since full rotational symmetry is AFAIK a completely new idea and therefore isn't easily
supported by any existing tools.  However, in Bellmetal, I could simply add the rotational symmetry
as a proof constraint (similar to how multi-part proving worked) and get immediate feedback over
whether the methods and their reversals were true in the context of the composition.  Without this,
the process of composing would have been incredibly tedious and error prone and I likely would have
given up early on in the composing process.
