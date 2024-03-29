+++
title = "Sapling"
description = "An experimental vi-inspired editor where you edit code, not text."

date = 2020-09-17
formattedDate = "Sep 2020 - Oct 2022"

languages = ["rust"]
topics = ["misc"]

[extra]
links = [
    ["Github repo", "https://github.com/kneasle/sapling"]
]
+++

**Sapling** is an experimental general-purpose code editor, based on the design principles behind
Vi.  Where Sapling differs from other Vi-based editors is that instead of having keystrokes
correspond to operations of the text (such as `di)` deleting the contents of brackets), Sapling
instead interprets keystrokes as operations on the underlying
[**syntax tree**](https://en.wikipedia.org/wiki/Abstract_syntax_tree) representing the code.

This means that instead of the cursor pointing to a location in text, the cursor points to a node in
the AST, and any subsequent operations (deletions, insertions, etc.) will be applied to that
specific node.

For more details, see [the README](https://github.com/kneasle/sapling) of the GitHub repository.
