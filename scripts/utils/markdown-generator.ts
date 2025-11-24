interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  sourceLink: string;
  sourcePublishedAt: string;
  sourceMedia: string[];
  author: {
    name: string;
    link?: string;
  };
  language: string;
  featured?: boolean;
  sort?: number;
}

interface SortedPrompts {
  all: Prompt[];
  featured: Prompt[];
  regular: Prompt[];
  stats: {
    total: number;
    featured: number;
  };
}

export function generateMarkdown(data: SortedPrompts): string {
  const { featured, regular, stats } = data;

  let md = generateHeader();
  md += generateGalleryCTA();
  md += generateTOC();
  md += generateWhatIs();
  md += generateStats(stats);
  md += generateFeaturedSection(featured);
  md += generateAllPromptsSection(regular);
  md += generateContribute();
  md += generateFooter();

  return md;
}

function generateHeader(): string {
  return `# 🍌 Awesome Nano Banana Pro Prompts

[![GitHub stars](https://img.shields.io/github/stars/YouMind-OpenLab/awesome-nano-banana-pro-prompts?style=social)](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Update README](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/actions/workflows/update-readme.yml/badge.svg)](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/CONTRIBUTING.md)

> 🎨 A curated collection of creative prompts for Google's Nano Banana Pro
>
> 精选的 Google Nano Banana Pro 创意提示词集合

---

`;
}

function generateGalleryCTA(): string {
  return `## 🌐 View in Web Gallery

**[👉 Browse on youmind.com/nano-banana-pro-prompts](https://youmind.com/nano-banana-pro-prompts)**

Why use our gallery?

| Feature | GitHub README | youmind.com Gallery |
|---------|--------------|---------------------|
| 🎨 Visual Layout | Linear list | Beautiful Masonry Grid |
| 🔍 Search | Ctrl+F only | Full-text search with filters |
| 🌍 Languages | English only | 16+ languages (auto-translated) |
| 📱 Mobile | Basic | Fully responsive |

---

`;
}

function generatePromptSection(prompt: Prompt, index: number): string {
  const authorLink = prompt.author.link || '#';
  const publishedDate = new Date(prompt.sourcePublishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let md = `### No. ${index + 1}: ${prompt.title}\n\n`;

  // Language badge
  md += `![Language-${prompt.language.toUpperCase()}](https://img.shields.io/badge/Language-${prompt.language.toUpperCase()}-blue)\n`;

  if (prompt.featured) {
    md += `![Featured](https://img.shields.io/badge/⭐-Featured-gold)\n`;
  }

  md += `\n#### 📖 Description\n\n${prompt.description}\n\n`;
  md += `#### 📝 Prompt\n\n\`\`\`\n${prompt.content}\n\`\`\`\n\n`;

  // 渲染所有图片，有几张渲染几张
  if (prompt.sourceMedia && prompt.sourceMedia.length > 0) {
    md += `#### 🖼️ Generated Images\n\n`;

    prompt.sourceMedia.forEach((imageUrl, imgIndex) => {
      md += `##### Image ${imgIndex + 1}\n\n`;
      md += `<div align="center">\n`;
      md += `<img src="${imageUrl}" width="${prompt.featured ? '700' : '600'}" alt="${prompt.title} - Image ${imgIndex + 1}">\n`;
      md += `</div>\n\n`;
    });
  }

  md += `#### 📌 Details\n\n`;
  md += `- **Author:** [${prompt.author.name}](${authorLink})\n`;
  md += `- **Source:** [Twitter Post](${prompt.sourceLink})\n`;
  md += `- **Published:** ${publishedDate}\n`;
  md += `- **Language:** ${prompt.language}\n\n`;
  md += `---\n\n`;

  return md;
}

function generateFeaturedSection(featured: Prompt[]): string {
  if (featured.length === 0) return '';

  let md = `## 🔥 Featured Prompts\n\n`;
  md += `> ⭐ Hand-picked by our team for exceptional quality and creativity\n\n`;

  featured.forEach((prompt, index) => {
    md += generatePromptSection(prompt, index);
  });

  return md;
}

function generateAllPromptsSection(regular: Prompt[]): string {
  if (regular.length === 0) return '';

  let md = `## 📋 All Prompts\n\n`;
  md += `> 📝 Sorted by publish date (newest first)\n\n`;

  regular.forEach((prompt, index) => {
    md += generatePromptSection(prompt, index);
  });

  return md;
}

function generateStats(stats: { total: number; featured: number }): string {
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'full',
    timeStyle: 'long',
  });

  return `## 📊 Statistics

<div align="center">

| Metric | Count |
|--------|-------|
| 📝 Total Prompts | **${stats.total}** |
| ⭐ Featured | **${stats.featured}** |
| 🔄 Last Updated | **${now}** |

</div>

---

`;
}

function generateTOC(): string {
  return `## 📖 Table of Contents

- [🌐 View in Web Gallery](#-view-in-web-gallery)
- [🤔 What is Nano Banana Pro?](#-what-is-nano-banana-pro)
- [📊 Statistics](#-statistics)
- [🔥 Featured Prompts](#-featured-prompts)
- [📋 All Prompts](#-all-prompts)
- [🤝 How to Contribute](#-how-to-contribute)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)
- [⭐ Star History](#-star-history)

---

`;
}

function generateWhatIs(): string {
  return `## 🤔 What is Nano Banana Pro?

**Nano Banana Pro** is Google's latest multimodal AI model featuring:

- 🎯 **Multimodal Understanding** - Process text, images, and video
- 🎨 **High-Quality Generation** - Photorealistic to artistic styles
- ⚡ **Fast Iteration** - Quick edits and variations
- 🌈 **Diverse Styles** - From pixel art to oil paintings
- 🔧 **Precise Control** - Detailed composition and lighting
- 📐 **Complex Scenes** - Multi-object, multi-character rendering

📚 **Learn More:** [Nano Banana Pro: 10 Real Cases](https://youmind.com/blog/nano-banana-pro-10-real-cases)

---

`;
}

function generateContribute(): string {
  return `## 🤝 How to Contribute

We welcome contributions! You can submit prompts via:

### 🐛 GitHub Issue

1. Click [**Submit New Prompt**](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/issues/new?template=submit-prompt.yml)
2. Fill in the form with prompt details and image
3. Submit and wait for team review
4. If approved (we'll add \`approved\` label), it will automatically sync to CMS
5. Your prompt will appear in README within 4 hours

**Note:** We only accept submissions via GitHub Issues to ensure quality control.

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

---

`;
}

function generateFooter(): string {
  const timestamp = new Date().toISOString();

  return `## 📄 License

Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

---

## 🙏 Acknowledgements

- [Payload CMS](https://payloadcms.com/)
- [youmind.com](https://youmind.com)

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=YouMind-OpenLab/awesome-nano-banana-pro-prompts&type=Date)](https://star-history.com/#YouMind-OpenLab/awesome-nano-banana-pro-prompts&Date)

---

<div align="center">

**[🌐 View in Web Gallery](https://youmind.com/nano-banana-pro-prompts)** •
**[📝 Submit a Prompt](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/issues/new?template=submit-prompt.yml)** •
**[⭐ Star this repo](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts)**

<sub>🤖 This README is automatically generated. Last updated: ${timestamp}</sub>

</div>
`;
}
