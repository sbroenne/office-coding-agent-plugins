---
name: word-formatting
description: Consistent Word styles, readable text, and selection-safe visual refinement.
version: 1.1.0
license: MIT
hosts: [word]
---

# Word Formatting

Use the live tool descriptions for available formatting fields. Read the
selection and document structure before applying changes; follow the
[core selection safeguards](../word/SKILL.md).

## Formatting Judgment

- Prefer named paragraph styles for headings and structural text. Match the
  existing document hierarchy instead of making ordinary body text look like
  a heading through font changes alone.
- Use inline formatting for emphasis, not as a substitute for structure.
- Keep body font, size, spacing, and color consistent with surrounding text.
- Apply paragraph spacing rather than inserting empty paragraphs to create gaps.
- Preserve user-authored emphasis unless changing it is part of the request.
- Keep contrast high and avoid using color as the only indicator of meaning.

## Workflow

1. Inspect selected text, its formatting, and nearby paragraphs.
2. Decide whether the change belongs to selected text, whole paragraphs, or
   specific search matches.
3. Apply the narrowest supported formatting operation.
4. Read back the affected content/formatting and check hierarchy and consistency.

Search-based formatting can affect every match. Use it only when all matches
should change, and inspect the results. Do not assume a body insertion selected
the new paragraph for a subsequent formatting operation.
