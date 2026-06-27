---
title: "Code block test"
date: "2026-06-28"
excerpt: "This post is for test code block"
tags: ["gleam", "highlighter"]
author: "Hewel"
---

This document outlines conventions, patterns, and anti-patterns for Gleam code.
Conventions and anti-patterns are rules that should be adhered to always, while
patterns are to applied whenever the programmer thinks it would benefit their
code.

## Conventions

Gleam enforces `snake_case` for variables, constants, and functions, and
`PascalCase` for types and variants.

### Avoid unqualified importing of functions and constants

Always used the qualified syntax for functions and constants defined in other
modules.

```gleam
// Good
import gleam/list
import gleam/string

pub fn reverse(input: String) -> String {
  input
  |> string.to_graphemes
  |> list.reverse
  |> string.concat
}

// Bad
import gleam/list.{reverse}
import gleam/string.{to_graphemes, concat}

pub fn reverse(input: String) -> String {
  input
  |> to_graphemes
  |> reverse
  |> concat
}
```
