---
name: excel
description: Safe workbook analysis, transformation, reporting, visualization, and modeling workflows.
license: MIT
hosts: [excel]
---

# Excel Working Guide

Use the active workbook and the live tool descriptions for available actions
and arguments. Do not assume older standalone Excel tool names still exist.
This skill adds workflow judgment, not a second tool reference.

## Operating Loop

1. Discover workbook structure and the user's selection before assuming scope.
2. Read exact target values and formulas before modifying anything.
3. Apply the smallest write that fulfills the request.
4. Format values according to their meaning, then re-read important outputs.
5. Summarize changes and any failures in the user's language.

## Safety and Quality

- "These cells" means the current selection, not the whole used range.
- Preserve formulas, headers, table structure, and unrelated worksheets.
- Inspect formulas separately from values; displayed numbers do not reveal
  whether a cell is calculated.
- Read large ranges in pages. Keep track of offsets and do not analyze only
  the first page as if it were the complete dataset.
- Keep writes rectangular and match their dimensions to the exact destination.
- Use explicit worksheet targets once discovered, rather than relying on the
  active sheet remaining unchanged.
- Distinguish missing values, zero, empty text, and formula errors.
- Perform analysis using returned data; do not assume a separate analysis tool.
- Report failed steps explicitly. Continue only steps that do not depend on
  the failed result.

## Focused Workflows

- [Data quality](references/data-quality.md): normalization and validation.
- [Reporting](references/reporting.md): summaries, KPIs, and pivots.
- [Visualization](references/visualization.md): chart choice and interpretation.
- [Modeling](references/modeling.md): assumptions, formulas, and reconciliation.
