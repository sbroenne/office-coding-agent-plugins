---
name: powerpoint
description: Selection-safe slide workflows, layout judgment, and verification.
version: 3.0.0
license: MIT
hosts: [powerpoint]
---

# PowerPoint Working Guide

Use the active presentation and live tool descriptions for supported fields
and actions. The built-in Office tools are not an MCP server. This skill adds
working habits and design judgment, not a second tool manual.

## Operating Loop

1. Read selected slides first. "This slide" means the current selection.
2. Read the presentation overview, target content, shapes, and slide image.
   An empty text preview does not mean a slide is empty.
3. Prefer targeted edits to preserve existing shapes, notes, and design.
4. Create or edit one slide, inspect its image, fix issues, and inspect again
   before moving on. Check full view and bottom corners for clipped text.
5. Re-read changed content and summarize in the user's language.

Re-read indices after deletion, reordering, or grouping. Do not claim visual
verification when image capture is unavailable.

## Know the Boundaries

- The slide-creation tool's legacy `code` argument takes a **JSON string**,
  not executable JavaScript. Use the current tool description for its schema.
- Replacement recreates the whole slide. Read and preserve needed content
  and speaker notes before replacing, then restore notes.
- No layout variables are injected. Compute positions before submission and
  put concrete numeric inch values in JSON.
- The overview does not return page dimensions. Confirm the actual size in
  PowerPoint's Slide Size dialog or use dimensions already confirmed by the
  user. Do not infer exact size from a thumbnail or shape.
- The creation tool reads dimensions internally but falls back to
  13.33 x 7.5 inches on unsupported hosts. That is not evidence of actual size;
  explain the limitation for custom-size decks on such hosts.
- There is no selected-shape inspection or page-size changing tool. Identify
  shapes from the slide's shape list and the request; page size changes are
  manual in PowerPoint.
- Native SmartArt creation is unavailable. Simple diagrams can use supported
  shapes and text; be clear that they are not native SmartArt.
- Unsupported effects are not made available by the underlying rendering
  library. Do not promise gradients, shadows, opacity, rich text runs, or
  chart types outside the exposed JSON contract.

## Layout Judgment

Keep content at least 0.5 inches from confirmed page edges, with 0.2-0.3 inch
gaps between columns. Full-page backgrounds may reach the edges. Prefer a
shorter message or another slide over tiny type. Vary layouts to fit content
rather than producing repeated title-and-bullet slides.

For multi-step requests, report failures explicitly and continue only
independent steps.

## Focused Skills

- [Formatting](../powerpoint-formatting/SKILL.md): text, tables, colors.
- [Deck builder](../powerpoint-deck-builder/SKILL.md): one-slide-at-a-time workflow.
- [Redesign](../powerpoint-redesign/SKILL.md): preserve existing content.
- [Charts](../powerpoint-charts/SKILL.md): chart choice and interpretation.
- [Design](../powerpoint-design/SKILL.md): cards, dashboards, heroes, dividers.
- [Deck archetypes](../powerpoint-deck-archetypes/SKILL.md): standard deck outlines.
- [Speaker notes](../powerpoint-speaker-notes/SKILL.md): notes and timing.
