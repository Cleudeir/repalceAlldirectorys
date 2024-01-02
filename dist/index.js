"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function readFilesInDirectory(directoryPath) {
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
                }
                else if (stats.isDirectory()) {
                    console.log('Directory:', filePath);
                    // If you want to recursively read files in subdirectories
                    // uncomment the line below
                    readFilesInDirectory(filePath);
                }
            });
        });
    });
}
function replaceContentInFile(filePath) {
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
        if (data.includes("import { Colors , dynamicSize }") ||
            data.includes("import { Colors , dynamicSize}") ||
            data.includes("import {Colors , dynamicSize }") ||
            data.includes("import { Colors, dynamicSize }") ||
            data.includes("import {Colors, dynamicSize}") ||
            data.includes("import {dynamicSize}") ||
            data.includes("import { dynamicSize }")) {
        }
        else {
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
