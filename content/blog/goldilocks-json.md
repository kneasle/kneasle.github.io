+++
title = "Goldilocks and the Three JSON Formatters"
description = "Once upon a time, there lived a computer scientist with beautiful golden hair..."

date = 2021-03-16

topics = ["coding"]
languages = ["rust"]
+++

Once upon a time, there lived a computer scientist with beautiful golden hair.  One day, she was
walking through the woods when she stumbled upon an old house, in which there lived three JSON
formatters.  Burning with curiosity, she walks around the house and upon hearing no sound from
within, decides that the house must be empty.  Finding the back door ajar, she pushes it open and
walks, silently, into the kitchen. On the kitchen table there are three bowls of JSON, still warm
and ready to eat.

The first bowl of JSON is from the _minified_ formatter.  It's all right - it's very compact and
good for computers, but the computer scientist doesn't like it - it's just too _wide_:

```json
{"test/cases/87s-at-back.toml":{"comps":[{"length":32,"string":"sHsH","avg_score":-0.45625},{"length":64,"string":"sHWsMH","avg_score":-0.44062495},{"length":96,"string":"WMsWMHsH","avg_score":-0.33124998},{"length":96,"string":"WsMHWsMH","avg_score":-0.33124998},{"length":96,"string":"sHWMsWMH","avg_score":-0.33124995},{"length":64,"string":"WsMHsH","avg_score":-0.284375}]}} "oh look you actually scrolled to the end! That's very nice of you, so here's a star: ⭐"
```

"This can't do!" she thinks.  "If I check this into git, I won't be able to tell what on earth is
going on!  All the diffs will just be one line!".  She moves on to the next bowl, disappointed.

The second bowl belongs to the _pretty_ formatter.  "This is much better!", she thinks.  Everything
is on its own line, so the git diffs will be much easier to read.  However, it's still not perfect
\- it's just a bit too _tall_:

```json
{
  "test/cases/87s-at-back.toml": {
    "comps": [
      {
        "length": 32,
        "string": "sHsH",
        "avg_score": -0.45625
      },
      {
        "length": 64,
        "string": "sHWsMH",
        "avg_score": -0.44062495
      },
      {
        "length": 96,
        "string": "WMsWMHsH",
        "avg_score": -0.33124998
      },
      {
        "length": 96,
        "string": "WsMHWsMH",
        "avg_score": -0.33124998
      },
      {
        "length": 96,
        "string": "sHWMsWMH",
        "avg_score": -0.33124995
      },
      {
        "length": 64,
        "string": "WsMHsH",
        "avg_score": -0.284375
      }
    ]
  }
}
```

If only there were a way to have a middle ground: a formatter that isn't too wide, and isn't too
tall!

Finally, the computer scientist comes to the third bowl of JSON.  She gasps.  This is the JSON
she'd been hoping for!  It's not too wide, it's not too tall, its just... _perfect_:

```json
{
  "test/cases/87s-at-back.toml": {
    "comps": [
      { "length": 32, "string": "sHsH", "avg_score": -0.45625 },
      { "length": 64, "string": "sHWsMH", "avg_score": -0.44062495 },
      { "length": 96, "string": "WMsWMHsH", "avg_score": -0.33124998 },
      { "length": 96, "string": "WsMHWsMH", "avg_score": -0.33124998 },
      { "length": 96, "string": "sHWMsWMH", "avg_score": -0.33124995 },
      { "length": 64, "string": "WsMHsH", "avg_score": -0.284375 }
    ]
  }
}
```

## Introducing the Goldilocks JSON Formatter

Luckily for everyone, this story has a happy ending!  Not only was Goldilocks not eaten by the
~~bears~~ JSON formatters, but the Goldilocks formatter is available as `goldilocks-json-fmt` [on
crates.io](https://crates.io/crates/goldilocks-json-fmt) for everyone to use!

A quick example, just to make sure you're fully sold on the idea:

```rust
fn main() {
    // Ewww so horrible
    let json = r#"{"test/cases/87s-at-back.toml":{"comps":[{"length":32,"string":
        "sHsH","avg_score":-0.45625},{"length":64,"string":"sHWsMH","avg_score":
        -0.44062495},{"length":96,"string":"WMsWMHsH","avg_score":-0.33124998},
        {"length":96,"string":"WsMHWsMH","avg_score":-0.33124998},{"length":96,
        "string":"sHWMsWMH","avg_score":-0.33124995},{"length":64,"string":
        "WsMHsH","avg_score":-0.284375}]}}"#;

    let perfect_json = goldilocks_json_fmt::format(&json).expect("Invalid JSON");

    assert_eq!(
         &perfect_json,
         // So perfect!
         r#"{
  "test/cases/87s-at-back.toml": {
    "comps": [
      { "length": 32, "string": "sHsH", "avg_score": -0.45625 },
      { "length": 64, "string": "sHWsMH", "avg_score": -0.44062495 },
      { "length": 96, "string": "WMsWMHsH", "avg_score": -0.33124998 },
      { "length": 96, "string": "WsMHWsMH", "avg_score": -0.33124998 },
      { "length": 96, "string": "sHWMsWMH", "avg_score": -0.33124995 },
      { "length": 64, "string": "WsMHsH", "avg_score": -0.284375 },
    ]
  }
}"#,
    );
}
```

Quick links:
- [GitHub repo](https://github.com/kneasle/goldilocks-json-fmt)
- [crates.io](https://crates.io/crates/goldilocks-json-fmt)
- [docs.rs](https://docs.rs/goldilocks-json-fmt/)
