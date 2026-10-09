import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkRepository, root, loadSources } from './check-compatibility.mjs';

test('actual marketplace resolves all reviewed agents and skills', () => {
  assert.ok(checkRepository().length >= 17);
});

test('missing authoritative source is a failure, not a skipped check', () => {
  assert.throws(() => loadSources(undefined), /sources are required/);
});

function mutateFile(relative, change, pattern) {
  const temp = mkdtempSync(join(tmpdir(), 'office-plugin-compatibility-'));
  try {
    cpSync(join(root, 'plugins'), join(temp, 'plugins'), { recursive: true });
    cpSync(join(root, '.github', 'plugin'), join(temp, '.github', 'plugin'), { recursive: true });
    cpSync(join(root, 'README.md'), join(temp, 'README.md'));
    const path = join(temp, relative);
    writeFileSync(path, change(readFileSync(path, 'utf8')));
    assert.throws(() => checkRepository(temp), pattern);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

test('plugin/marketplace version disagreement fails', () => {
  mutateFile('plugins/excel/plugin.json', text => text.replace('1.2.0', '99.0.0'), /99\.0\.0/);
});

test('directory-mismatched skill metadata fails', () => {
  mutateFile('plugins/word/skills/word/SKILL.md', text => text.replace(/^name: word\r?$/m, 'name: Word Document Editing'), /Word Document Editing/);
});

test('executable slide instructions fail', () => {
  mutateFile('plugins/powerpoint/skills/powerpoint/SKILL.md', text => `${text}\nslide.addText("Unsafe");\n`, /powerpoint/);
});

test('obsolete Excel tool instructions fail', () => {
  mutateFile('plugins/excel/skills/excel/SKILL.md', text => `${text}\nUse get_workbook_info.\n`, /excel/);
});

test('broken skill cross-references fail', () => {
  mutateFile('plugins/word/skills/word/SKILL.md', text => `${text}\n[Missing](../not-a-skill/SKILL.md)\n`, /Broken link/);
});
