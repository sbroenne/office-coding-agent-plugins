---
name: word
description: Selection-safe editing and verification workflows for the active Word document.
license: MIT
hosts: [word]
---

# Word Working Guide

Use the active document, the user's language, and the live tool descriptions.
This skill provides safe working habits, not a duplicate tool catalog.

## Read, Change, Check

1. Read the current selection first, then the document outline and relevant
   content. "This text" or "here" means the current selection.
2. Choose an insertion/editing scope deliberately: document body, selection,
   indexed table, section, or bookmark.
3. Make the smallest change that fulfills the request.
4. Re-read changed content and surrounding text. Check location, completeness,
   heading hierarchy, formatting, and preservation of unrelated content.
5. Correct problems and verify again; report failures plainly.

## Body and Selection Are Different

`insert_paragraph` appends/prepends to the document body. It does not move
the selection. A later selection-based insertion will still target the
original selection, not the newly appended paragraph.

`insert_content_at_selection` defaults to `location: "Replace"`, which
overwrites selected text. Always provide an explicit location. Use `"Before"`
or `"After"` to add content beside a selection without replacing it;
`"Start"`/`"End"` mean boundaries of the selection, not of the document.
Use `"Replace"` only when replacement of that exact selection is intended.
Reading the selection does not automatically save or restore its position.

## Add a Section Safely

For a section at the end of the document, insert the heading and body
paragraphs using body-scoped insertion, each with `location: "End"` and the
appropriate named style. Do not switch to selection HTML for the body.

```json
{"tool":"insert_paragraph","arguments":{"text":"Summary","location":"End","style":"Heading 1"}}
```

```json
{"tool":"insert_paragraph","arguments":{"text":"The project remains on schedule.","location":"End","style":"Normal"}}
```

For rich content beside a user-selected passage, insert the heading and body
together in one HTML operation with an explicit non-replacing location:

```json
{"tool":"insert_content_at_selection","arguments":{"html":"<h1>Summary</h1><p>The project remains on schedule.</p>","location":"After"}}
```

Read the selection immediately before this operation and verify the new
section and the original passage afterward. Escape user text when building
HTML. Do not assume consecutive selection insertions advance a cursor;
combine a coherent block or re-establish the intended location.

Replacing the entire document body requires an explicit whole-document
request. Never use it as a shortcut for appending a section.

## Focused Skills

- [Document builder](../word-document-builder/SKILL.md): planning and section creation.
- [Formatting](../word-formatting/SKILL.md): style consistency and readability.
- [Tables](../word-tables/SKILL.md): structural changes and verification.
