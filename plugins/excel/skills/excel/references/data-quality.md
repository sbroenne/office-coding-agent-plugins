# Data Quality Workflow

Use when cleaning, normalizing, validating, or repairing workbook data.
Consult the live tool descriptions for action and argument details.

1. Profile the complete source, paging through large datasets. Identify blanks,
   formula errors, inconsistent types, casing, and duplicates.
2. Read formulas before changing cells. Normalize only known input values;
   preserve headers and calculated columns.
3. Resolve ambiguous dates, identifiers, and units conservatively. Do not strip
   leading zeros from IDs or reinterpret dates without a clear source convention.
4. Add input validation where it prevents recurrence. Choose whole-number,
   decimal, list, date, or custom rules based on the business meaning.
5. Re-read changed values and validation rules. Compare counts and check that
   unrelated cells and formulas remain unchanged.

For duplicate removal, decide which columns define identity and which record
to retain before using a destructive operation. Formatting alone does not
convert text into numbers or repair invalid dates.
