import fs from 'fs';
import path from 'path';
import process from 'process';

// Get command line arguments
const args = process.argv.slice(2);
const inputFile = args[0];
let outputFile = args[1]; 

// Default output file name if not provided (overwrites the input file)
if (!outputFile) {
    outputFile = inputFile;
}

try {
    // Read input file
    let content = fs.readFileSync(inputFile, 'utf8');

    // Remove Windows UTF-8 Byte Order Mark (BOM) if present
    if (content.startsWith('\uFEFF')) {
        content = content.slice(1);
    }

    // Process text content
    const processedContent = content
        .replace(/\r\n/g, '\n')         // Convert Windows CRLF to Linux LF
        .replace(/^\n+|\n+$/g, '');     // Trim leading and trailing newlines

    // Write output file
    fs.writeFileSync(outputFile, processedContent, 'utf8');
    console.log(`Successfully created Linux-friendly script: ${outputFile}`);
} catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
}