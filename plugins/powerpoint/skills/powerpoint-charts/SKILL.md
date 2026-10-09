---
name: powerpoint-charts
description: Supported JSON bar, line, pie, and doughnut charts with data and layout guidance.
version: 2.0.0
license: MIT
hosts: [powerpoint]
---

# PowerPoint Charts

Use the [core workflow](../powerpoint/SKILL.md) and live tool description. A chart is a `chart`
element in a JSON specification serialized into the `code` string argument of
`add_slide_from_code`. Confirm the actual page size before computing positions.

Only `bar`, `line`, `pie`, and `doughnut` are supported. Use bars to compare
categories, lines for time trends, and pie/doughnut for parts of a whole.
Use a single series for pie/doughnut to keep the meaning clear.
Do not promise scatter, area, radar, 3D, stacked options, custom axes, legend
placement, data-label settings, or doughnut hole size: none are JSON fields.

## Data

Keep category labels aligned across series and preserve the source numbers.
Use 6-8 points for readability where possible. Choose a consistent palette
and add an insight beside the chart rather than crowding it with prose.
Keep units and time periods explicit; do not compare incompatible measures.

Example specification for a **confirmed 10 x 7.5 inch** page:

```json
{
  "backgroundColor":"FFFFFF",
  "elements":[
    {"type":"text","text":"Quarterly revenue","x":0.5,"y":0.5,"w":9,"h":0.7,"fontSize":28,"bold":true,"color":"1B3A5C"},
    {"type":"chart","chartType":"bar","title":"Revenue","series":[{"name":"North","labels":["Q1","Q2","Q3","Q4"],"values":[120,180,150,210]},{"name":"South","labels":["Q1","Q2","Q3","Q4"],"values":[90,140,170,190]}],"colors":["0B5394","3D85C6"],"x":0.5,"y":1.5,"w":5.5,"h":5},
    {"type":"text","text":"North leads in Q4","x":6.3,"y":2,"w":3.2,"h":2,"fontSize":20,"fillColor":"F0F4F8","valign":"mid"}
  ]
}
```

Use `chartType: "line"` with matching category labels for trends, or
`"pie"`/`"doughnut"` with one series for composition. Verify the slide image
and source numbers, shorten crowded labels, and split charts if necessary.
Do not invent data or sources to satisfy an outline.
