---
name: powerpoint-design
description: Solid-fill card, dashboard, hero, and divider layouts using supported JSON slide elements.
version: 2.0.0
license: MIT
hosts: [powerpoint]
---

# Design Skill

Use the [core workflow](../powerpoint/SKILL.md) and live tool description. Confirm actual page
dimensions, compute positions, and serialize concrete numeric inches into
the string `code` argument. Layout calculations happen before submission.

Gradients, shadows, opacity, radius controls, and rich text runs are not
supported specification fields. Use solid contrasting panels and deliberate
spacing for depth, or a user-provided PNG/JPEG for noneditable artwork.
Do not simulate unsupported effects with unsupported properties.

## Layout Recipes

| Layout | Supported construction |
| --- | --- |
| Three-column cards | Three `roundRect` backgrounds, one short heading and description text element each; optional solid accent bars |
| Dashboard | Four solid `rect`/`roundRect` panels in a 2 x 2 grid, each with a KPI number, label, and text trend; use real charts for data trends |
| Hero | `backgroundColor`, a centered bold title, a subtitle, and a solid accent line |
| Section divider | One half-page solid rectangle, section number on it, title/subtitle on the other half |
| Process | `chevron` or `arrowRight` shapes with separate centered text |
| Cycle/hierarchy | `ellipse`/`rect` nodes, supported `line` connectors, separate text; not native SmartArt |
| Matrix | Four rectangles with short labels and contrasting solid colors |
| Pyramid | Supported `triangle` shapes with separate labels, or stacked rectangles |

For equal-width columns, subtract both margins and all gaps from the page
width, divide by the column count, then calculate each x position. Submit only
the resulting numbers. Center blocks using half the remaining page height.
Keep content margins of 0.5 inches, gaps of 0.2-0.3 inches, and card padding
of 0.15-0.2 inches. Decorative backgrounds may reach page edges.

## Palette and Typography

| Palette | Heading/background | Accent | Light fill | Body |
| --- | --- | --- | --- | --- |
| Corporate | `1B3A5C` | `2D6DA4` | `F0F4F8` | `5A6978` |
| Warm | `8B4513` | `D2691E` | `FDF6EC` | `6B5B4F` |
| Nature | `2D5F2D` | `548235` | `F1F8E9` | `5D6B5D` |
| Dark | `1A1A2E` | `E94560` | `16213E` | `E8E8E8` |
| Minimal | `1F1F1F` | `2D7DD2` | `FAFAFA` | `4A4A4A` |

Use at most three font sizes per slide: 32-36 point title, 18-22 subtitle,
14-18 body. Bold headings, keep contrast high, and shorten overflow.

Example card specification for a **confirmed 10 x 7.5 inch** page:

```json
{
  "backgroundColor":"F0F4F8",
  "elements":[
    {"type":"text","text":"Our services","x":0.5,"y":0.5,"w":9,"h":0.8,"fontSize":32,"bold":true,"color":"1B3A5C"},
    {"type":"shape","shape":"roundRect","x":0.5,"y":2,"w":2.8,"h":3.5,"fillColor":"FFFFFF","lineColor":"B8D4E8"},
    {"type":"text","text":"Strategy","x":0.7,"y":2.4,"w":2.4,"h":0.6,"fontSize":20,"bold":true,"color":"1B3A5C"},
    {"type":"text","text":"Data-driven planning","x":0.7,"y":3.2,"w":2.4,"h":1.8,"fontSize":16,"color":"5A6978"},
    {"type":"shape","shape":"roundRect","x":3.6,"y":2,"w":2.8,"h":3.5,"fillColor":"FFFFFF","lineColor":"B8D4E8"},
    {"type":"text","text":"Engineering","x":3.8,"y":2.4,"w":2.4,"h":0.6,"fontSize":20,"bold":true,"color":"1B3A5C"},
    {"type":"text","text":"Reliable systems","x":3.8,"y":3.2,"w":2.4,"h":1.8,"fontSize":16,"color":"5A6978"},
    {"type":"shape","shape":"roundRect","x":6.7,"y":2,"w":2.8,"h":3.5,"fillColor":"FFFFFF","lineColor":"B8D4E8"},
    {"type":"text","text":"Growth","x":6.9,"y":2.4,"w":2.4,"h":0.6,"fontSize":20,"bold":true,"color":"1B3A5C"},
    {"type":"text","text":"Measurable outcomes","x":6.9,"y":3.2,"w":2.4,"h":1.8,"fontSize":16,"color":"5A6978"}
  ]
}
```

For a dashboard, use two rows rather than four narrow columns. For hero and
divider slides, keep all text inside the safe area even if fills are full-page.
Verify every slide image and revise crowding or overlap before continuing.
