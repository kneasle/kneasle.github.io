# [kneasle.github.io](https://kneasle.github.io)

This repo contains the source code for my personal website, hosted at
[kneasle.github.io](https://kneasle.github.io).  Everything - content, icons, CSS/web design, etc.
- is made from scratch by me.  The site is built using a one-off site generator and hosted using
GitHub pages.

## Building

To build it, you need to have [TypeScript](https://www.typescriptlang.org/) and
[Deno](https://deno.land) installed, and then run:

```bash
deno task build
```

This will place the rendered site in a directory called `rendered/`.  This can then be either be
served using a basic HTTP server (like `python3 -m http.server`) or the site can be served
automatically with:

```bash
deno task serve
```

This will automatically serve the generated files on `localhost:8000` and also rebuild the site
whenever the source files are changed.
