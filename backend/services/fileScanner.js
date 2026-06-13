import fs from 'fs';
import path from 'path';

export const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);
    const ignoreList = ['node_modules', '.git', 'dist', 'build', 'public', '.vscode'];

    files.forEach((file) => {
        if (ignoreList.includes(file)) return;

        const fullPath = path.join(dirPath, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (/\.(js|jsx|ts|tsx)$/.test(file)) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
};