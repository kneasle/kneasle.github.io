+++
title = "Wheatley"
description = "A bot for Ringing Room that can ring any number of bells to increase the scope of practices."

[extra]
links = [
    ["Github", "https://github.com/kneasle/wheatley"],
    ["PyPI", "pypi.org/project/wheatley/"]
]
+++

## It's Summer of 2020

Wheatley is a product of my long summer holiday in 2020.  I'm sure the year 2020 will be imprinted
in everyone's memories as the year the world was put on pause, so it goes without saying that not
much was happening that summer.

The biggest effect of COVID on from my routine that summer was the loss of my main
hobby - ringing church bells.  Anyone who's been ringing will see the problem - ringing requires
people to stand in close company in poorly ventalated rooms for large periods of time, which is not
exactly compatible with a highly infections airbourne disease.

Not to be put off by something as small as a global pandemic, ringing _does_ continue.  Two
American ringers created a way for us to 'ring' together whilst not leaving our homes.  The result
is ['Ringing Room'](https://ringingroom.com), a website that simulates ringing real bells by allowing
multiple ringers to make the sounds of real life bells and have those sounds syncronised across all
the ringers in a 'room'.  I say 'ring' in quotes here, because ringing on Ringing Room leaves
something to be desired when compared to 'real' ringing (this is not a criticism of Ringing Room -
I, and many many other people, are incredibly grateful to Bryn and Leland for the ability to keep
our hobby going).

On a positive note, online ringing does present some opportunites over real bells and ropes - for
the first time, it is fairly straightforward for a computer program to interact with human ringers in a
(hopefully) constructive way.  Ringing is already pretty unique in that it is mathematically
well-defined, which means that computer-aided ringing programs have existed for a while (the most
popular such program is [Abel](http://www.abelsim.co.uk/)).

However, all existing programs fall short in my opinion in one regard - ringing with them doesn't
feel like ringing with another ringer; they usually make little or no consideration to the human
ringers.  But this seems silly - computers should work around us, not the other way around.

## Enter Wheatley

Therefore, Matthew Johnson and I built Wheatley in order to fill this niche -
Wheatley can **constructively** ring only a few bells in a practice without requiring the human
ringers to behave any differently.
