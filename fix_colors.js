const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        // استبدال درجات اللون الأصفر المختلفة بالأحمر
        const newContent = content.replace(/bg-yellow-(300|400|500|600)/g, 'bg-red-600')
                                  .replace(/text-yellow-(300|400|500|600)/g, 'text-red-600')
                                  .replace(/border-yellow-(300|400|500|600)/g, 'border-red-600');
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated colors in: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.ts')) {
            replaceInFile(filePath);
        }
    });
}

walkDir('./src');
console.log('Color replacement complete.');
