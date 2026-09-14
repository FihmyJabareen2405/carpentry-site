import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const files = [
  'app/page.tsx',
  'app/projects/page.tsx',
  'app/projects/[slug]/page.tsx',
  'app/admin/projects/page.tsx',
  'app/admin/projects/new/page.tsx',
  'app/admin/projects/new/actions.ts',
  'app/admin/projects/[id]/edit/page.tsx',
  'app/admin/projects/[id]/edit/actions.ts',
];

function filePath(rel) {
  return path.join(root, ...rel.split('/'));
}

function removeLine(text, regex) {
  return text
    .split(/\r?\n/)
    .filter((line) => !regex.test(line))
    .join('\n');
}

function removeCityFormField(text) {
  // Matches the complete FormField block that contains name="city".
  return text.replace(
    /\n\s*<FormField\s+label=["'](?:עיר\s*\/\s*מיקום|מיקום|עיר)["']>\s*[\s\S]*?name=["']city["'][\s\S]*?<\/FormField>\s*/g,
    '\n'
  );
}

function removeCityConst(text) {
  // Handles both multiline and compact versions used by the admin actions.
  return text
    .replace(
      /\n\s*const\s+city\s*=\s*String\(\s*formData\.get\(["']city["']\)\s*\|\|\s*["']["']\s*\)\.trim\(\)\s*\|\|\s*null;\s*/g,
      '\n'
    )
    .replace(
      /\n\s*const\s+city\s*=\s*String\(\s*formData\.get\(["']city["']\)\s*\|\|\s*["']["']\s*\)\s*\.trim\(\)\s*\|\|\s*null;\s*/g,
      '\n'
    );
}

function removeProjectCityJsx(text) {
  const patterns = [
    // ProjectTag block in /projects.
    /\n\s*\{project\.city\s*&&\s*\(\s*<ProjectTag>[\s\S]*?project\.city[\s\S]*?<\/ProjectTag>\s*\)\}\s*/g,
    // Simple span in admin project cards.
    /\n\s*\{project\.city\s*&&\s*\(\s*<span>[\s\S]*?project\.city[\s\S]*?<\/span>\s*\)\}\s*/g,
    // DetailRow on project detail page.
    /\n\s*\{project\.city\s*&&\s*\(\s*<DetailRow\s+[\s\S]*?label=["']מיקום["'][\s\S]*?value=\{project\.city\}[\s\S]*?\/?>\s*\)\}\s*/g,
    // Customer gallery / home page city paragraph.
    /\n\s*\{item\.city\s*&&\s*\(\s*<p[^>]*>[\s\S]*?\{item\.city\}[\s\S]*?<\/p>\s*\)\}\s*/g,
  ];
  for (const pattern of patterns) text = text.replace(pattern, '\n');
  return text;
}

function patch(rel, original) {
  let text = original;

  // Remove DB select/property lines that only exist for project location.
  text = removeLine(text, /^\s*city,\s*$/);
  text = removeLine(text, /^\s*city\s*:\s*project\.city,\s*$/);

  // Remove form field and server-action parsing/writes.
  text = removeCityFormField(text);
  text = removeCityConst(text);
  text = removeLine(text, /^\s*city,\s*$/);

  // Remove visible UI occurrences.
  text = removeProjectCityJsx(text);

  if (rel === 'app/projects/[slug]/page.tsx') {
    // SEO call: createSeoDescription(title, description, city) -> no city.
    text = text.replace(
      /createSeoDescription\(\s*project\.title,\s*project\.description,\s*project\.city\s*\)/g,
      'createSeoDescription(\n      project.title,\n      project.description\n    )'
    );

    // SEO helper signature: remove city parameter.
    text = text.replace(
      /function\s+createSeoDescription\(\s*title:\s*string,\s*description:\s*string\s*\|\s*null,\s*city:\s*string\s*\|\s*null\s*\)/g,
      'function createSeoDescription(\n  title: string,\n  description: string | null\n)'
    );

    // SEO fallback: remove the optional "in city" suffix.
    text = text.replace(
      /`\$\{title\}\s*-\s*עבודת נגרות בהתאמה אישית מבית \$\{SITE_NAME\}\$\{\s*city\s*\?\s*` ב\$\{city\}`\s*:\s*["']["']\s*\}\.`/g,
      '`${title} - עבודת נגרות בהתאמה אישית מבית ${SITE_NAME}.`'
    );
  }

  // Normalize excessive blank lines introduced by block removals.
  text = text.replace(/\n{4,}/g, '\n\n\n');
  return text;
}

let changed = 0;
let missing = [];

for (const rel of files) {
  const full = filePath(rel);
  if (!fs.existsSync(full)) {
    missing.push(rel);
    continue;
  }

  const original = fs.readFileSync(full, 'utf8');
  const updated = patch(rel, original);

  if (updated !== original) {
    const backup = `${full}.before-remove-location`;
    if (!fs.existsSync(backup)) {
      fs.writeFileSync(backup, original, 'utf8');
    }
    fs.writeFileSync(full, updated, 'utf8');
    console.log(`✓ עודכן: ${rel}`);
    changed++;
  } else {
    console.log(`• ללא שינוי: ${rel}`);
  }
}

console.log('\n----------------------------------------');
console.log(`עודכנו ${changed} קבצים.`);
if (missing.length) {
  console.log('לא נמצאו הקבצים הבאים:');
  for (const rel of missing) console.log(`  - ${rel}`);
}
console.log('');
console.log('עמודת city ב-Supabase לא נמחקה. האתר פשוט מפסיק לקרוא/לכתוב/להציג אותה.');
console.log('נוצר גיבוי .before-remove-location לכל קובץ ששונה.');
