+++
title = "Shortlist"
description = "A tiny Rust crate which keeps the largest items given to it."

weight = 160 # 1xx is for not-huge but completed projects

[extra]
links = [
    ["GitHub", "https://github.com/kneasle/shortlist"],
    ["crates.io", "https://crates.io/crates/shortlist"]
]
+++

A 'Shortlist' is a data structure which stores a fixed length buffer of the best items pushed to it.
The intended use case is doing searches over large search spaces: we might generate billions of
candidate solutions, but the user will only need a couple of hundred.  Obviously, we can't just
return any old solutions - we only want to keep the _best_.  A 'shortlist' handles this for us.

<!-- more -->

This crate is a tiny Rust implementation of a shortlist with no (re-)allocations, `unsafe` code or
additional dependencies.  All common operations - `len`, `push`, `peek_min`, etc. - have `O(1)`
amortised time complexity, with `O(log n)` worst-case for any single operation.

A `Shortlist` is a thin wrapper around a min-heap (and inherits the `O(log n)` time complexity).
Despite being a simple wrapper, I haven't found any other implementations of it.  If anyone has
implemented it (or knows what it's actually called), then please let me know :).
