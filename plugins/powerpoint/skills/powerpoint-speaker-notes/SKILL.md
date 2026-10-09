---
name: powerpoint-speaker-notes
description: Concise talking points, transitions, timing, and preservation of existing speaker notes.
version: 1.1.0
license: MIT
hosts: [powerpoint]
---

# Speaker Notes

Use the [core workflow](../powerpoint/SKILL.md) and live tool descriptions.
Read existing notes before editing a slide. Preserve user-authored notes unless
the request includes updating them; restore them after whole-slide replacement.
For new decks, include useful notes unless the user asks for slides only.

## What Good Notes Add

Give the presenter context that is not already on the slide:

- An opening sentence that explains why the message matters.
- Two to five talking points with supporting context or verified sources.
- A transition to the next slide.
- A realistic timing suggestion.

Keep notes glanceable and usually under 150 words. Use conversational language,
short lines, and occasional pause or audience-interaction cues. Do not turn
them into a full script or repeat every visible bullet.

## Accuracy and Scope

Do not invent causes, forecasts, citations, or numerical claims. Distinguish
known facts from suggestions and questions. Match the deck's language and tone.
Divider slides may need only a transition; a simple edit does not require
rewriting every slide's notes.

Example for a slide whose verified message is "The project remains on schedule":

```text
The main point is that delivery is still on track.

Explain which milestones were completed and which are next, using the
project's confirmed status information.

Ask whether any dependencies need attention before the next checkpoint.

Next, walk through the remaining work and owners.

About 1 minute.
```

## Check That Notes Were Saved

Read notes back after saving. Some hosts return guidance instead of modifying
notes. If that happens, provide the complete draft for manual entry in the
Notes pane; do not claim the notes were saved or silently accept a truncated
preview as the full result.
