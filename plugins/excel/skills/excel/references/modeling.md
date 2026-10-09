# Modeling Workflow

Use for formulas, assumptions, dependencies, scenarios, or model refactoring.
Use the live tool descriptions for the available formula and recalculation actions.

1. Identify inputs and outputs. Keep assumptions in explicit cells/tables,
   separate from calculated results.
2. Read existing formulas and values. Understand relative/absolute references
   and dependencies before writing.
3. Write the smallest formula block first, then read it back before filling
   or copying across the rest of the model.
4. Recalculate after changes, then read outputs rather than trusting cached values.
5. Reconcile subtotals and grand totals. Check signs, units, and order of magnitude.

Spot-check zero, blank, negative, and unusually large inputs. Reuse shared
assumptions across sheets. Flag detected circular references or unnecessary
volatile formulas rather than quietly replacing the model.
