const fs = require('fs');

const USERNAME = 'MahadevaprasadS-0720';
const README_PATH = 'README.md';

async function updateProjects() {
  try {
    const headers = { 'User-Agent': 'NodeJS-Script' };
    if (process.env.GH_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GH_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=10`, { headers });
    const repos = await res.json();

    if (!Array.isArray(repos)) {
      console.error('Failed to fetch repositories:', repos);
      return;
    }

    const filteredRepos = repos
      .filter(repo => !repo.fork && repo.name.toLowerCase() !== USERNAME.toLowerCase())
      .slice(0, 5);

    let tableContent = '| Project Name | Description | Tech / Link |\n| :--- | :--- | :--- |\n';
    
    filteredRepos.forEach(repo => {
      const name = `**${repo.name}**`;
      const desc = repo.description ? repo.description.replace(/\|/g, '-') : 'Personal project';
      const link = repo.homepage ? `[Live Demo](${repo.homepage}) / [Code](${repo.html_url})` : `[Repository](${repo.html_url})`;
      tableContent += `| ${name} | ${desc} | ${link} |\n`;
    });

    const readmeContent = fs.readFileSync(README_PATH, 'utf8');
    const startTag = '<!-- PROJECTS:START -->';
    const endTag = '<!-- PROJECTS:END -->';

    const startIndex = readmeContent.indexOf(startTag);
    const endIndex = readmeContent.indexOf(endTag);

    if (startIndex === -1 || endIndex === -1) {
      console.error('Projects placeholder tags missing');
      return;
    }

    const updatedReadme = 
      readmeContent.substring(0, startIndex + startTag.length) +
      '\n' + tableContent +
      readmeContent.substring(endIndex);

    fs.writeFileSync(README_PATH, updatedReadme, 'utf8');
    console.log('README successfully updated.');
  } catch (err) {
    console.error('Execution error:', err);
    process.exit(1);
  }
}

updateProjects();
