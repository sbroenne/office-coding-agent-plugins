---
name: powerpoint-formatting
description: Supported JSON slide text, table, color, and positioning rules.
version: 2.0.0
license: MIT
hosts: [powerpoint]
---

# Formatting Skill

Use the [core workflow](../powerpoint/SKILL.md) and live tool description before creating slides.
`add_slide_from_code` takes a JSON string in `code`, not executable code.
Confirm page dimensions and compute all coordinates before submission.

## Text

Use a string for a paragraph or a flat string array for bullet items. Each item
must be a string, not a rich text object. Combine labels and descriptions:
`"Revenue: increased"`; separate elements are needed for differently styled
text. `bold` applies to an entire text element, not individual runs.
`valign` accepts `top`, `mid`, `bottom`; `align` accepts `left`, `center`, `right`.
The contract has no numbered-bullet or auto-shrink option.

Use 28-36 point titles, 18-22 point subtitles, 14-18 point body text, and
12-14 point captions when space allows. Shorten overflow rather than relying
on automatic shrinking. Allow enough height for wrapped lines.

## Colors and Shapes

Use six-digit hex strings without `#`. Fields are flat: `fillColor`,
`lineColor`, `lineWidth`, not nested fill/line objects. Use solid fills.
Keep 0.5 inch content margins and 0.2-0.3 inch gaps after confirming page size.

## Tables

Use `rows` as a rectangular string array, including headers explicitly.
Set `fontSize`, `color`, and `borderColor` if needed. Values must be strings;
there are no per-cell style objects. Maximum 50 rows and 20 columns.

Example specification for a **confirmed 10 x 7.5 inch** page:

```json
{
  "elements": [
    {"type":"text","text":"Results","x":0.5,"y":0.5,"w":9,"h":0.8,"fontSize":32,"bold":true,"color":"1B3A5C"},
    {"type":"text","text":["Revenue: increased","Costs: stable"],"x":0.5,"y":1.5,"w":4,"h":2,"fontSize":18,"valign":"top"},
    {"type":"table","rows":[["Metric","Value"],["Revenue","120"],["Cost","80"]],"x":5,"y":1.5,"w":4.5,"h":2,"fontSize":14,"color":"333333","borderColor":"B8D4E8"}
  ]
}
```

Serialize the specification into `code`. Verify full and detail images after
every change. Compare text and table contents with the user's source data.
