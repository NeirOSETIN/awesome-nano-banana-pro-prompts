import 'dotenv/config';
import { Octokit } from '@octokit/rest';
import { createPrompt } from './utils/cms-client.js';
import { uploadImageToCMS } from './utils/image-uploader.js';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

interface IssueFields {
  prompt_title?: string;
  prompt?: string;
  description?: string;
  image_url?: string;
  author_name?: string;
  author_link?: string;
  source_link?: string;
  language?: string;
}

async function parseIssue(issueBody: string): Promise<IssueFields> {
  const fields: Record<string, string> = {};
  const lines = issueBody.split('\n');

  let currentField: string | null = null;
  let currentValue: string[] = [];

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (currentField) {
        fields[currentField] = currentValue.join('\n').trim();
      }
      currentField = line.replace('### ', '').toLowerCase().replace(/\s+/g, '_');
      currentValue = [];
    } else if (currentField) {
      currentValue.push(line);
    }
  }

  if (currentField) {
    fields[currentField] = currentValue.join('\n').trim();
  }

  return fields;
}

async function main() {
  try {
    const issueNumber = process.env.ISSUE_NUMBER;
    const issueBody = process.env.ISSUE_BODY || '';

    if (!issueNumber) {
      throw new Error('ISSUE_NUMBER not provided');
    }

    console.log(`📋 Processing approved issue #${issueNumber}...`);

    const fields = await parseIssue(issueBody);

    console.log('📸 Uploading image to CMS...');
    const imageUrl = await uploadImageToCMS(fields.image_url || '');

    console.log('📝 Creating prompt in CMS (no draft)...');
    const prompt = await createPrompt({
      title: fields.prompt_title || '',
      content: fields.prompt || '',
      description: fields.description || '',
      sourceLink: fields.source_link || '',
      sourceMedia: [imageUrl],
      author: {
        name: fields.author_name || '',
        link: fields.author_link || '',
      },
      language: fields.language?.toLowerCase() || 'en',
      sourcePublishedAt: new Date().toISOString(),
      sourceMeta: {
        github_issue: issueNumber,
      },
    });

    console.log(`✅ Created prompt in CMS: ${prompt?.id}`);

    // Close the issue
    await octokit.issues.update({
      owner: process.env.GITHUB_REPOSITORY?.split('/')[0] || '',
      repo: process.env.GITHUB_REPOSITORY?.split('/')[1] || '',
      issue_number: parseInt(issueNumber),
      state: 'closed',
    });

    console.log(`✅ Closed issue #${issueNumber}`);

  } catch (error) {
    console.error('❌ Error syncing approved issue:', error);
    process.exit(1);
  }
}

main();
