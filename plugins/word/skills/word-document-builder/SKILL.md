---
name: word-document-builder
description: >
  Specialized skill for creating and restructuring Word documents. Covers
  multi-section content planning and selection-safe section creation.
version: 1.1.0
license: MIT
hosts: [word]
---

# Document Builder Skill

Activate this skill when creating new documents, restructuring existing ones, or building multi-section content.

## Thorough Planning

When triggered by keywords like **"gründlich"**, **"deep"**, **"think"**, **"go deep"**, **"detail"**, **"ausführlich"**, **"thoroughly"**, use the deep planning workflow:

### Phase 1: Plan
1. Read the current selection, document outline, and existing content.
2. Create a structured plan:
   - Document title and purpose
   - Section outline (headings, subheadings)
   - Content summary for each section
   - Formatting approach

### Phase 2: Execute Section by Section
For each planned section:
1. Choose scope before writing. Use the [core safe insertion workflow](../word/SKILL.md).
2. For document-end sections, append both heading and body paragraphs with
   explicit `location: "End"` and named styles. Body insertion does not move
   the selection; do not follow it with selection HTML as if it did.
3. For rich content beside selected text, put the heading and body together
   in one HTML insertion with explicit `location: "Before"` or `"After"`.
   Do not accept the default Replace when adding content.
4. Add tables, lists, and images only at a confirmed supported location;
   selection-based tools do not automatically target the appended section.
5. Read back the section and adjacent original content; check location and preservation.
6. Refine if incomplete or incorrectly formatted, then move to the next section.

### Phase 3: Polish
1. `get_document_overview` → verify final structure
2. Check heading hierarchy is consistent
3. Verify spacing and formatting
4. Add headers/footers if appropriate
5. Final summary of what was created

## Create → Verify → Fix Loop (MANDATORY)

For EVERY section you create:
```
1. Write content
2. get_document_section → read back
3. Compare to plan — is it complete? Well-formatted?
4. If issues → fix → read again
5. Only move to next section when current one is right
```

## Document Structure Planning

### Content Types
- **Report**: Title → Executive Summary → Sections → Conclusion
- **Proposal**: Title → Overview → Approach → Timeline → Budget
- **Memo**: To/From/Date → Subject → Body → Action Items
- **Meeting Notes**: Date/Attendees → Agenda → Discussion → Action Items
- **Technical Doc**: Title → Overview → Details → Examples → References

### Layout Variety
Mix content types within sections:
- Paragraphs for narrative
- Bullet lists for key points
- Numbered lists for steps/processes
- Tables for comparisons/data
- Quotes/callouts for emphasis

## Fast Mode (Default)

Without deep triggers, work in a single pass:
1. Read document state
2. Make changes
3. Verify
4. Summarize

## Always-On Rules

- **Plan before writing** — even in fast mode, outline what you'll create
- **Coherent blocks** — build large documents section by section; short
  documents may be inserted as a single block at a confirmed location.
- **Verify everything** — read back every section after writing
- **Match existing style** — if the document has content, match its tone and formatting
- **Preserve selection content** — add beside it unless replacement was requested.
- **Preserve language** — write in the user's requested language, not the tool's language.
