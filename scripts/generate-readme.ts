import 'dotenv/config';
import fs from 'fs';
import { fetchAllPrompts, sortPrompts } from './utils/cms-client.js';
import { generateMarkdown } from './utils/markdown-generator.js';

async function main() {
  try {
    console.log('📥 Fetching prompts from CMS (locale: en-US)...');
    const prompts = await fetchAllPrompts('en-US');

    console.log(`✅ Fetched ${prompts.length} prompts`);

    console.log('🔃 Sorting prompts...');
    const sorted = sortPrompts(prompts);

    console.log('📝 Generating README...');
    const markdown = generateMarkdown(sorted);

    console.log('💾 Writing README.md...');
    fs.writeFileSync('README.md', markdown, 'utf-8');

    console.log('✅ README.md updated successfully!');
    console.log(`📊 Stats: ${sorted.all.length} total, ${sorted.featured.length} featured`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
