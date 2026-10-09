import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runInNewContext } from 'node:vm';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hosts = ['excel', 'powerpoint', 'word'];
const read = path => readFileSync(path, 'utf8');
const json = path => JSON.parse(read(path));
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const version = /^\d+\.\d+\.\d+$/;

export function filesUnder(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    const child = join(path, entry.name);
    return entry.isDirectory() ? filesUnder(child) : [child];
  });
}

export function frontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  assert.ok(match, 'Missing frontmatter');
  return match[1];
}

function field(metadata, name) {
  return new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(metadata)?.[1].trim();
}

export function checkRepository(base = root) {
  const marketplace = json(join(base, '.github', 'plugin', 'marketplace.json'));
  assert.ok(slug.test(marketplace.name));
  assert.ok(marketplace.owner?.name);
  assert.ok(version.test(marketplace.metadata?.version));
  assert.ok(Array.isArray(marketplace.plugins) && marketplace.plugins.length === 4);
  const names = new Set();
  const documents = [];
  const counts = {};
  for (const entry of marketplace.plugins) {
    assert.ok(slug.test(entry.name) && !names.has(entry.name), `Invalid/duplicate plugin ${entry.name}`);
    names.add(entry.name);
    assert.match(entry.source, /^plugins\/(excel|powerpoint|word|outlook)$/);
    const pluginRoot = join(base, entry.source);
    const plugin = json(join(pluginRoot, 'plugin.json'));
    assert.equal(plugin.name, entry.name);
    assert.equal(plugin.version, entry.version);
    assert.ok(version.test(plugin.version));
    assert.equal(plugin.description, entry.description);
    assert.ok(plugin.author?.name && plugin.license && Array.isArray(plugin.keywords));
    assert.equal(plugin.agents, 'agents/');
    assert.equal(plugin.skills, 'skills/');
    assert.ok(existsSync(join(pluginRoot, plugin.agents)));
    assert.ok(existsSync(join(pluginRoot, plugin.skills)));
    const host = basename(pluginRoot);
    // Outlook is intentionally outside the reviewed skill/content scope.
    if (!hosts.includes(host)) continue;
    const skillsRoot = join(pluginRoot, 'skills');
    const skills = readdirSync(skillsRoot, { withFileTypes: true }).filter(e => e.isDirectory());
    counts[host] = skills.length;
    for (const skill of skills) {
      assert.ok(slug.test(skill.name));
      const path = join(skillsRoot, skill.name, 'SKILL.md');
      assert.ok(existsSync(path), `Undiscoverable skill ${skill.name}`);
      const metadata = frontmatter(read(path));
      assert.equal(field(metadata, 'name'), skill.name, path);
      assert.ok(field(metadata, 'description'), `Missing description in ${path}`);
      assert.equal(field(metadata, 'hosts'), `[${host}]`, path);
      assert.equal(field(metadata, 'license'), 'MIT', path);
    }
    const agents = filesUnder(join(pluginRoot, 'agents')).filter(p => p.endsWith('.agent.md'));
    assert.equal(agents.length, 1);
    const agentMeta = frontmatter(read(agents[0]));
    assert.equal(field(agentMeta, 'hosts'), `[${host}]`);
    assert.equal(field(agentMeta, 'defaultForHosts'), `[${host}]`);
    assert.equal(field(agentMeta, 'version'), plugin.version);
    for (const path of filesUnder(pluginRoot).filter(p => p.endsWith('.md'))) {
      assert.ok(!/_SKILL\.md$/.test(path), `Hidden skill reference ${path}`);
      const text = read(path);
      for (const link of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
        if (/^(https?:|#)/.test(link[1])) continue;
        assert.ok(existsSync(resolve(dirname(path), link[1].split('#')[0])), `Broken link in ${path}: ${link[1]}`);
      }
      if (host === 'powerpoint') {
        assert.doesNotMatch(text, /slide\.add\w+\s*\(|pptx\.(?:charts|ChartType|ShapeType)|shrinkText\s*:|```(?:js|javascript|typescript)\b/i, path);
        assert.doesNotMatch(text, /get_selected_shapes|set_presentation_size|\b[WH]\s*[-+*]|\b[WH]\s*\/\s*\d/, path);
      }
      if (host === 'excel') {
        assert.doesNotMatch(text, /\b(?:get_workbook_info|list_sheets|list_tables|get_used_range|get_range_values|get_range_formulas|set_range_values|set_range_formulas|create_chart|create_table|add_pivot_field|create_pivot_table|analyze_data|recalculate_workbook|format_range|auto_fit_columns|set_list_validation|set_number_validation)\b/, path);
      }
      documents.push({ path, host, text });
    }
  }
  assert.deepEqual(counts, { excel: 1, powerpoint: 8, word: 4 });
  const readme = read(join(base, 'README.md'));
  for (const [host, count] of Object.entries(counts)) {
    assert.match(readme, new RegExp(`office-${host}\\*\\*[^\\n]*\\+ ${count}\\b`));
  }
  for (const name of ['powerpoint-charts', 'powerpoint-design', 'powerpoint-deck-archetypes', 'powerpoint-speaker-notes']) {
    assert.ok(existsSync(join(base, 'plugins', 'powerpoint', 'skills', name, 'SKILL.md')));
  }
  return documents;
}

export function loadSources(sourceDir) {
  assert.ok(sourceDir, 'Pass --source-dir with the reviewed add-in checkout; sources are required.');
  const lock = json(join(root, 'scripts', 'add-in-contract.json'));
  assert.match(lock.revision, /^[a-f0-9]{40}$/);
  const sources = {};
  for (const [path, expected] of Object.entries(lock.sources)) {
    const bytes = Buffer.from(read(join(sourceDir, path)).replace(/\r\n/g, '\n'), 'utf8');
    const actual = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    assert.equal(actual, expected, `Source mismatch: ${path} at ${lock.revision}`);
    sources[path] = bytes.toString('utf8');
  }
  return sources;
}

// Parameter declarations in the pinned configs are plain object literals.
// Skip quoted strings and comments while finding the object's closing brace.
export function objectLiteral(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (char === "'" || char === '"' || char === '`') {
      const quote = char;
      for (i++; i < text.length; i++) {
        if (text[i] === '\\') i++;
        else if (text[i] === quote) break;
      }
    } else if (text.slice(i, i + 2) === '//') {
      const end = text.indexOf('\n', i);
      i = end === -1 ? text.length : end;
    } else if (text.slice(i, i + 2) === '/*') {
      const end = text.indexOf('*/', i + 2);
      assert.ok(end !== -1, 'Unclosed comment');
      i = end + 1;
    } else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return text.slice(start, i + 1);
  }
  throw new Error('Unclosed parameter object');
}

export function extractContracts(sources) {
  const contracts = { excel: {}, powerpoint: {}, word: {} };
  for (const [path, text] of Object.entries(sources)) {
    if (path.endsWith('slideSpec.ts')) continue;
    const host = path.includes('/configs/') ? 'excel' : path.includes('/word/') ? 'word' : 'powerpoint';
    const configs = [...text.matchAll(/^    name: '(\w+)',/gm)];
    for (let i = 0; i < configs.length; i++) {
      const segment = text.slice(configs[i].index, configs[i + 1]?.index);
      const params = /params:\s*(\{)/.exec(segment);
      assert.ok(params, `Missing params for ${configs[i][1]}`);
      const literal = objectLiteral(segment, params.index + params[0].lastIndexOf('{'));
      const schema = runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
      contracts[host][configs[i][1]] = schema;
    }
  }
  assert.equal(Object.keys(contracts.excel).length, 10);
  assert.ok(contracts.word.insert_paragraph && contracts.powerpoint.add_slide_from_code);
  return contracts;
}

function validType(value, type) {
  if (type.endsWith('[]')) {
    return Array.isArray(value) && value.every(item => validType(item, type.slice(0, -2)));
  }
  if (type === 'any') return true;
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  return typeof value === type;
}

export function checkCall(call, host, contracts) {
  assert.ok(call && typeof call === 'object' && !Array.isArray(call));
  assert.deepEqual(Object.keys(call).sort(), ['arguments', 'tool']);
  const schema = contracts[host][call.tool];
  assert.ok(schema, `Unknown ${host} tool ${call.tool}`);
  assert.ok(call.arguments && typeof call.arguments === 'object' && !Array.isArray(call.arguments));
  for (const key of Object.keys(call.arguments)) assert.ok(Object.hasOwn(schema, key), `Unsupported ${call.tool}.${key}`);
  for (const [key, spec] of Object.entries(schema)) {
    const value = call.arguments[key];
    if (value === undefined) assert.equal(spec.required, false, `Missing ${call.tool}.${key}`);
    else {
      assert.ok(validType(value, spec.type), `Wrong type for ${call.tool}.${key}`);
      if (spec.enum) assert.ok(spec.enum.includes(value), `Invalid ${call.tool}.${key}: ${value}`);
    }
  }
  if (call.tool === 'insert_content_at_selection') {
    assert.ok(call.arguments.location, 'Selection insertion must explicitly state location');
  }
  return call.arguments;
}

export async function sourceParser(sources) {
  const text = sources['src/tools/powerpoint/slideSpec.ts'];
  assert.ok(text?.includes('function parseSlideSpec('), 'Missing actual slide parser');
  const end = text.indexOf('export async function renderSlideSpecToBase64');
  assert.ok(end > 0, 'Cannot isolate actual slide parser');
  const parser = text.slice(0, end).replace(/^import PptxGenJS from 'pptxgenjs';\r?\n/, '');
  const code = stripTypeScriptTypes(`${parser}\nexport { parseSlideSpec };`, { mode: 'strip' });
  return (await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)).parseSlideSpec;
}

export async function checkCompatibility(sourceDir) {
  const documents = checkRepository();
  const sources = loadSources(sourceDir);
  const contracts = extractContracts(sources);
  const parseSlide = await sourceParser(sources);
  assert.ok(!Object.hasOwn(contracts.powerpoint, 'get_selected_shapes'));
  assert.ok(!Object.hasOwn(contracts.powerpoint, 'set_presentation_size'));
  assert.throws(() => checkCall({
    tool: 'add_table_columns', arguments: { tableIndex: 0, headers: ['Owner'], data: [['Sales']] },
  }, 'word', contracts));
  assert.throws(() => checkCall({
    tool: 'add_table_rows', arguments: { tableIndex: 0, rows: [['Sales']], insertAtEnd: true },
  }, 'word', contracts));
  assert.throws(() => checkCall({
    tool: 'set_table_cell_value', arguments: { tableIndex: 0, rowIndex: 0, columnIndex: 0, value: 'Sales' },
  }, 'word', contracts));
  assert.throws(() => checkCall({
    tool: 'insert_content_at_selection', arguments: { html: '<p>Unsafe default</p>' },
  }, 'word', contracts));
  assert.throws(() => checkCall({
    tool: 'add_slide_from_code', arguments: { code: { elements: [] } },
  }, 'powerpoint', contracts));
  let calls = 0;
  let slides = 0;
  for (const { path, host, text } of documents) {
    for (const mention of text.matchAll(/`([a-z][a-z0-9_]*_[a-z0-9_]+)`/g)) {
      assert.ok(contracts[host][mention[1]], `Unknown tool mention ${mention[1]} in ${path}`);
    }
    for (const block of text.matchAll(/```json\r?\n([\s\S]*?)\r?\n```/g)) {
      const example = JSON.parse(block[1]);
      if (Object.hasOwn(example, 'tool')) {
        checkCall(example, host, contracts);
        calls++;
      } else {
        assert.equal(host, 'powerpoint', `Unrecognized JSON example in ${path}`);
        assert.match(text, /confirmed 10 x 7\.5 inch/, `Unspecified example dimensions in ${path}`);
        parseSlide(JSON.stringify(example), 10, 7.5);
        // Exercise the real string argument, not only the inner object.
        checkCall({ tool: 'add_slide_from_code', arguments: { code: JSON.stringify(example) } }, host, contracts);
        slides++;
      }
    }
  }
  assert.ok(calls >= 7 && slides >= 3, 'Expected workflow and slide examples were not checked');
  const valid = '{"elements":[{"type":"text","text":"Test","x":0.5,"y":0.5,"w":9,"h":1}]}';
  assert.throws(() => parseSlide('slide.addText("test")', 10, 7.5));
  assert.throws(() => parseSlide(valid.replace('"w":9', '"w":10'), 10, 7.5));
  assert.throws(() => parseSlide(valid.replace('"text":"Test"', '"text":"Test","shadow":{}'), 10, 7.5));
  assert.throws(() => parseSlide(valid.replace('"text":"Test"', '"text":[{"text":"Test"}]'), 10, 7.5));
  assert.throws(() => parseSlide('{"elements":[],"opacity":0.5}', 10, 7.5));
  assert.throws(() => parseSlide('{"elements":[{"type":"chart","chartType":"scatter","x":0,"y":0,"w":1,"h":1,"series":[]}]}', 10, 7.5));
  const textElement = JSON.parse(valid).elements[0];
  parseSlide(JSON.stringify({ elements: Array.from({ length: 100 }, () => textElement) }), 10, 7.5);
  assert.throws(() => parseSlide(JSON.stringify({ elements: Array.from({ length: 101 }, () => textElement) }), 10, 7.5));
  parseSlide(valid.replace('"Test"', JSON.stringify('x'.repeat(10_000))), 10, 7.5);
  assert.throws(() => parseSlide(valid.replace('"Test"', JSON.stringify('x'.repeat(10_001))), 10, 7.5));
  assert.throws(() => parseSlide(valid.replace('"text":"Test"', '"text":"Test","fontSize":97'), 10, 7.5));
  assert.throws(() => parseSlide(valid.replace('"text":"Test"', '"text":"Test","color":"#FFFFFF"'), 10, 7.5));
  const chart = {
    type: 'chart', chartType: 'line', x: 0.5, y: 0.5, w: 9, h: 5,
    series: [{ name: 'Trend', labels: ['Q1', 'Q2'], values: [1, 2] }],
  };
  for (const chartType of ['bar', 'line', 'pie', 'doughnut']) {
    parseSlide(JSON.stringify({ elements: [{ ...chart, chartType }] }), 10, 7.5);
  }
  assert.throws(() => parseSlide(JSON.stringify({
    elements: [{ ...chart, series: [{ name: 'Trend', labels: ['Q1', 'Q2'], values: [1] }] }],
  }), 10, 7.5));
  const table = { type: 'table', x: 0.5, y: 0.5, w: 9, h: 5, rows: [['A', 'B'], ['1', '2']] };
  parseSlide(JSON.stringify({ elements: [table] }), 10, 7.5);
  assert.throws(() => parseSlide(JSON.stringify({ elements: [{ ...table, rows: [['A', 'B'], ['1']] }] }), 10, 7.5));
  console.log(`Compatibility passed: 13 source hashes, ${documents.length} documents, ${calls} tool calls, ${slides} slide specs; actual parser rejection checks passed.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const option = process.argv.indexOf('--source-dir');
  await checkCompatibility(option === -1 ? undefined : process.argv[option + 1]);
}
