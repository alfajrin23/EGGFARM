import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile('.env.local', 'utf8');
const values = new Map();
for (const line of source.split(/\r?\n/)) {
  const match = line.match(/^\s*(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY)\s*=\s*(.*?)\s*$/);
  if (!match) continue;
  let value = match[2];
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
  values.set(match[1], value);
}

const url = values.get('NEXT_PUBLIC_SUPABASE_URL');
const anonKey = values.get('NEXT_PUBLIC_SUPABASE_ANON_KEY');
if (!url || !anonKey) throw new Error('.env.local harus mengisi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.');

const config = `window.SUPABASE_CONFIG = ${JSON.stringify({ url, anonKey }, null, 2)};\n`;
await writeFile('supabase-config.js', config, 'utf8');
console.log('supabase-config.js dibuat dari variabel NEXT_PUBLIC Supabase. Nilainya tidak ditampilkan.');
