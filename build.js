const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['.git', '.github', 'node_modules', '.vscode']);

const folders = fs.readdirSync('.', { withFileTypes: true })
    .filter(d => d.isDirectory() && !IGNORE.has(d.name) && !d.name.startsWith('.'))
    .map(dir => {
        const files = fs.readdirSync(dir.name)
            .filter(f => f.endsWith('.md'))
            .sort((a, b) => a.localeCompare(b));

        const items = files.map(f => ({
            title: path.basename(f, '.md'),
            path: `${dir.name}/${f}`
        }));

        return { name: dir.name, items };
    })
    .filter(f => f.items.length > 0);

fs.writeFileSync('content.json', JSON.stringify(folders, null, 2));
console.log(`Generated content.json with ${folders.length} folder(s)`);
