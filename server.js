const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

function getFolders() {
  const items = fs.readdirSync('.', { withFileTypes: true });
  return items
    .filter(item => item.isDirectory() && !item.name.startsWith('.'))
    .map(dir => {
      const files = fs.readdirSync(dir.name).filter(f => f.endsWith('.md'));
      return {
        name: dir.name,
        items: files.map(f => ({
          title: path.basename(f, '.md'),
          path: `${dir.name}/${f}`
        })).sort((a, b) => a.title.localeCompare(b.title))
      };
    });
}

function serveFile(filePath, res, contentType = 'text/html') {
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/api/folders') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getFolders()));
    return;
  }
  
  if (req.url.startsWith('/api/content/')) {
    const file = decodeURIComponent(req.url.slice(14));
    serveFile(file, res, 'text/plain');
    return;
  }
  
  if (req.url === '/' || req.url === '/index.html') {
    serveFile('index.html', res);
    return;
  }
  
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
