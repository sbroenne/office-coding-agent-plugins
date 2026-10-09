# Office Coding Agent Plugins

Official plugin marketplace for [Office Coding Agent](https://github.com/sbroenne/office-coding-agent).

## Plugins

| Plugin | Description |
|---|---|
| **office-excel** | Excel agent + 1 workbook workflow skill |
| **office-powerpoint** | PowerPoint agent + 8 presentation skills |
| **office-word** | Word agent + 4 document skills |
| **office-outlook** | Outlook agent + 4 email/calendar skills |

## Installation

Register this marketplace and install plugins:

```bash
# Register the marketplace
copilot plugin marketplace add sbroenne/office-coding-agent-plugins

# Install all plugins
copilot plugin install office-excel@office-coding-agent
copilot plugin install office-powerpoint@office-coding-agent
copilot plugin install office-word@office-coding-agent
copilot plugin install office-outlook@office-coding-agent
```

## License

MIT

## Compatibility and checks

Excel, PowerPoint, and Word guidance targets Office Coding Agent v0.7.0,
reviewed at commit `2b4656c0164b8da2f542047fa2525dfe8473eced`. Skills focus on
workflow, judgment, and safe editing; the live built-in Office tool descriptions
remain the authority for arguments and actions. Built-in Office tools are
registered directly with the Copilot SDK, not exposed as an MCP server.
Outlook content is unchanged by this compatibility update.

PowerPoint has eight discoverable skills: powerpoint, powerpoint-formatting,
powerpoint-deck-builder, powerpoint-redesign, powerpoint-charts,
powerpoint-design, powerpoint-deck-archetypes, and powerpoint-speaker-notes.

Run the dependency-free checks with Node.js 24 or newer:

```powershell
node --test scripts\compatibility.test.mjs
node scripts\check-compatibility.mjs --source-dir <pinned-add-in-checkout>
```

The second command requires the reviewed add-in sources and verifies their
Git blob hashes (normalizing Windows line endings) before checking examples. Missing or mismatched sources fail
the check, never silently skip it. CI checks out the pinned revision separately.
It validates manifests, discoverable skill names/paths, local references, tool
mentions and example arguments, and runs slide examples through the add-in's
actual JSON parser. It does not claim to test rendering inside Office.
