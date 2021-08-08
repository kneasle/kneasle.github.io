+++
title = "A Data Format for Compositions"
# description = "Musings over data formats that could store change ringing compositions"
+++

There are many computer programs that all want to be able to handle compositions, and very few of
these share an interchangeable data format.  Therefore, transferring a composition between any of
these programs requires the whole composition to be rewritten by hand, which is incredibly tedious
and error prone.

Here, I will argue that it would be very beneficial to have a standard data format to store and
share compositions, so that programs (and humans) could use to share information about compositions.
I will also persue some options of how such a format could look.

<!-- more -->

## Why would a standard data format be useful?

Existing programs include:

- **Generators** of compositions: for example [BYROC](http://www.byroc.org.uk/),
  [Elf](http://www.bronze-age.com/elf/), [SMC32](https://github.com/GACJ/smc), Sabre (can't find a
  link), [Eril](http://www.ropley.com/eril-instructions.aspx) as well as much younger programs like
  [Bellmetal](https://github.com/kneasle/bellmetal)
- **Provers** of compositions: for example Siril and all its implementations/derivatives,
  [JSProve](http://jwholdsworth.github.io/JSProve/),
  [PealProver](https://sites.google.com/view/pealprover/home) **Libraries** of compositions: for
  example [Composition Library](https://complib.org/), Don Morrison's
  [ringing.org](https://www.ringing.org/) and even compositions attached to BellBoard performances
- **'Bot' Ringers** for online and offline ringing programs: for example
  [Abel](http://www.abelsim.co.uk/), [Wheatley](https://github.com/kneasle/wheatley) for Ringing
  Room, [Handbell Stadium](https://handbellstadium.org/) and Bob for Ding (can't find a link)

There is also a 5th class of program that I believe doesn't exist yet, which my 3rd year project
will consist of building:

- **Visualisers** of compositions: Programs which _aid_ composers by providing instant truth
  checking, visualisations of music distribution, etc. but don't try to generate compositions
  themselves.

In some cases, we can piggy-back on other programs (e.g. Wheatley and Handbell Stadium use CompLib's
row and call generation), which works OK for these programs as they need network connection to run.
However, this piggy-backing is not really acceptable for programs like composition generators, who's
bread and butter is to be able to generate compositions as fast as possible.  Therefore, calling out
to CompLib's server is not probably not acceptable for both the program and CompLib's server.

My vision is that you should be able to be composing a composition with (for example) BYROC, and
then when you are satisfied with the composition, you can immediately take the save file of that
program and upload it directly to CompLib or import it directly into Abel or Wheatley to see how it
feels to ring.  All without ever having to transcribe a single bob or single.

## Features of an ideal composition data format:

- **Complete**: Everything that is considered change ringing should be expressible in the format.
- **Expressive**: Simple compositions should produce simple and short files.
- **Flexible**: The format should be able to handle things like partial/incomplete compositions,
  mixed stage splicing, etc.
-  **Portable**: It should be easy to use this format to send data between different languages and
  OSes.
- **Extensible**: Programs should be able to add their own metadata to the any part of the data.
- **Readable**: A computer-savvy human should be able to read, debug and modify data in this format.
- **Specified**: Pricking rows and calls from this format should be entirely mechanical and
  unambiguous.

### More details

#### Completeness

'Everything' is defined according to the
[Framework for Change Ringing](https://cccbr.github.io/method_ringing_framework/index.html).

#### Portablity

Ideally this should be built on top of an existing data format to aid portablity (e.g. `JSON` or `XML`).

#### Specification

Having said that no implementation should be canonical, it would be massively advantageous for the
adoption of a such a data format if 'standard' libraries for parsing it are written in most major
languages (preferably open sourced) and published on the standard package repositories for those
languages (e.g. `nuget` for `.NET`, `npm` for `JavaScript`, `pip` for `python`, etc.).  If this were
done, then using this data format would hopefully be more convenient and compatible than making more
'roll-your-own' implementations.

This is a (reasonably complete) list of language families to cover:
  - `C`, callable from `C++`, `Rust`, `Python`, etc.
  - Any `.NET` language, callable from `C#`, `F#`, etc.
  - Any JVM language, callable from `Java`, `Scala`, `Kotlin`, etc.
  - `JavaScript` or any language compilable to WebAssembly for client-side web applications

Also from the top 10 languages are `PHP`, `Go`, and `R` which likely need their own implemenations if
required (though I think `Go` might be able to call `C` code).

## MicroSiril

Currently the only format that could possibly be called standard is microSiril, and usually when I
ask people whether a new standard is needed the common answer seems to be _'but we have
microSiril'_.  However, microSiril satisfies only a few of the above features that I believe an
ideal composition format should have.  This makes sense and is not a fault of microSiril; it is a
**language** rather than a **data format** - designed to be used by humans to represent a complete
composition with the sole purpose of determining the truth of that composition and nothing else.

As a result, microSiril works very well for _provers_ and is a passable output format for
_generators_ (to be fed into a _prover_), but it is not remotely convenient for the other two use
cases (_libraries_ and _bot ringers_).

This is because it is not possible to algorithmically convert microSiril into a human-readable
representation (as is needed for _libraries_), or to generate the locations and names of the calls
(as is needed for _bot ringers_).  microSiril is also unable to represent concepts like partial
compositions, which I believe should be included in such a format.

I therefore believe that microSiril is not the answer to this data format problem, though it does
embody many ideas that are worth taking inspiration from.
