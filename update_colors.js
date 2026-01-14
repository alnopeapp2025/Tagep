import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        // استبدال خلفيات اللون الأصفر بالأحمر
        const regex = /bg-yellow-\d{3}/g;
        if (regex.test(content)) {
            const newContent = content.replace(regex, 'bg-red-600');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated colors in: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
            replaceInFile(fullPath);
        }
    });
}

traverseDir(path.join(process.cwd(), 'src'));
