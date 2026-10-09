---
name: word-tables
description: Safe creation, structural changes, and verification of Word tables.
version: 1.1.0
license: MIT
hosts: [word]
---

# Word Tables

Use live tool descriptions for arguments. Read the document outline and target
table before changing it. Table/row/cell indices are 0-based and can change
after structural edits; re-read them rather than reusing stale positions.

## Creating a Table

Confirm the selection/insertion location first. The table insertion tool works
at the selection, not the document-end location of a previous body paragraph.
Supply explicit row and column counts and rectangular string data; include
headers in the data. Choose one of the supported simple styles, not an
arbitrary named Word table style.

```json
{"tool":"insert_table","arguments":{"rows":3,"columns":2,"data":[["Metric","Value"],["Revenue","120"],["Cost","80"]],"style":"grid","hasHeaderRow":true}}
```

Verify the table's location, dimensions, headers, and contents after insertion.

## Adding Rows and Columns

Decide whether insertion belongs at Start or End. Supply the count explicitly.
New row values are row-major and match the existing column count. New column
values provide one row per existing table row, with the new column values
inside each row (including header values if present).

```json
{"tool":"add_table_rows","arguments":{"tableIndex":0,"rowCount":1,"insertLocation":"End","values":[["Profit","40"]]}}
```

```json
{"tool":"add_table_columns","arguments":{"tableIndex":0,"columnCount":1,"insertLocation":"End","values":[["Owner"],["Sales"],["Finance"]]}}
```

These examples are independent starting states, not a sequence: after adding
rows, include those rows in subsequent new-column values too.

## Editing and Removing Data

Cell updates set text and optionally bold/background formatting. They are not
general cell-style operations. Use the live tool contract's actual cell fields:

```json
{"tool":"set_table_cell_value","arguments":{"tableIndex":0,"rowIndex":1,"cellIndex":1,"text":"125","bold":true,"shadingColor":"#E8F0FA"}}
```

Read the cell back, including surrounding content if it has multiple paragraphs;
the tool updates the first paragraph, not a full rich-content cell replacement.
Before deleting a row, confirm its content and purpose. Re-read the table after
any edit, verify totals where relevant, and check that unrelated rows survived.
