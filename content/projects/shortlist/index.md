+++
title = "Shortlist"
description = "An efficient data structure to track the largest items pushed to it."

weight = 30
draft = true

[extra]
links = [
    ["GitHub", "https://github.com/kneasle/shortlist"],
    ["crates.io", "https://crates.io/crates/shortlist"]
]
+++

**Shortlist** is a simple Rust implementation of a data structure which I call a 'shortlist' (I
can't find a name for it).

<!-- more -->

A `shortlist` storing items of type `T` has an associated constant `n >
0`, and the following operations:
- `fn len(&self) -> usize`: Returns the number of items currently in the `shortlist`.  For any
  shortlist `s`, `0 <= s.len() <= n`.
- `fn push(&mut self, value: T)`: Add a new value to the `shortlist`.  If the `shortlist` already contains `n`
  items, remove the smallest item so that the size never exceeds `n`.
- `fn to_vec(self) -> Vec<T>`: Consumes the `shortlist` and returns a `Vec` of its contents.

The `shortlist` library implements more operations, but these are the important ones.  This library
implements all the above operations in constant time (amortised over all possible input sequences),
and no heap allocations will be performed except when creating the `shortlist`.
