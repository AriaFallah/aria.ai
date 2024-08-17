#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const directory = path.join(__dirname, '..', 'src', 'content', 'thoughts');

// Create the template using template literals
const template = `---
date: ${new Date().toISOString()}
timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
---
`;

// Find the highest numbered file
const mostRecentNumber = fs
  .readdirSync(directory)
  .map((file) => {
    const match = file.match(/^(\d+)\.md$/);
    return match ? parseInt(match[1]) : null;
  })
  .filter(Boolean)
  .sort((a, b) => b - a)[0];

const newFileName = `${mostRecentNumber + 1}.md`;
const filePath = path.join(directory, newFileName);

fs.writeFileSync(filePath, template);

console.log(`Created file: ${filePath}`);
spawn('code', [filePath], { stdio: 'inherit' });
