import * as fs from 'fs';
import * as path from 'path';

function readFilesInDirectory(directoryPath: string): void {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (statErr, stats) => {
                if (statErr) {
                    console.error('Error getting file stats:', statErr);
                    return;
                }

                if (stats.isFile() && filePath.includes("styles")) {
                    console.log('File:', filePath);
                    replaceContentInFile(filePath);
                } else if (stats.isDirectory()) {
                    console.log('Directory:', filePath);
                    // If you want to recursively read files in subdirectories
                    // uncomment the line below
                    readFilesInDirectory(filePath);
                }
            });
        });
    });
}

function replaceContentInFile(filePath: string): void {
    fs.readFile(filePath, 'utf-8', (readErr, data) => {
        if (readErr) {
            console.error('Error reading file:', readErr);
            return;
        }

        // Define the regex pattern for matching "margin-left: *px;"
        const regexPattern = /(\d+)px/g;

        // Replace the matched content with "margin-left: dynamicSize($1)px"
        let replacedContent = data.replace(regexPattern, '${dynamicSize($1)}px');

        // If the import statement is not present, add it at the beginning of the file
        if (
        data.includes("import { Colors , dynamicSize }") || 
        data.includes("import { Colors , dynamicSize}") ||
        data.includes("import {Colors , dynamicSize }") ||
        data.includes("import { Colors, dynamicSize }") ||
        data.includes("import {Colors, dynamicSize}") || 
        data.includes("import {dynamicSize}") ||   
        data.includes("import { dynamicSize }")
        ) {
            

        } else {
            replacedContent = `import { Colors , dynamicSize } from '../../config';\n${replacedContent}`;
        }
        

        // Write the modified content back to the file
        fs.writeFile(filePath, replacedContent, 'utf-8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return;
            }

            console.log('Content replaced in', filePath);
        });
    });
}

// Replace '/home/user/Documents/envia_ts/src' with the actual path to the directory you want to read
const directoryPath = '/home/user/Documents/envia_ts/src';
readFilesInDirectory(directoryPath);
