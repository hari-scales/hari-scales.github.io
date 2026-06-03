const fs = require('fs');

const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

// Update Google Fonts link
const oldLinkRegex = /https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/g;
const newLink = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap';
content = content.replace(oldLinkRegex, newLink);

// Replace serif fonts with Syne
content = content.replace(/font-family:\s*'Cormorant Garamond',\s*serif;/g, "font-family: 'Syne', sans-serif;");
content = content.replace(/font-family:\s*'Playfair Display',\s*serif;/g, "font-family: 'Syne', sans-serif;");

// Replace sans-serif fonts with Space Grotesk
content = content.replace(/font-family:\s*'Inter',\s*sans-serif;/g, "font-family: 'Space Grotesk', sans-serif;");
content = content.replace(/font-family:\s*'DM Sans',\s*sans-serif;/g, "font-family: 'Space Grotesk', sans-serif;");

fs.writeFileSync(path, content, 'utf8');
console.log('Fonts updated successfully!');
