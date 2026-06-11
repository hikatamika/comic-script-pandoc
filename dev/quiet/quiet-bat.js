import fs from 'fs';
import path from 'path';
import process from 'process';

// Get command line arguments
const args = process.argv.slice(2);
const inputFile = args[0];
let outputFile = args[1];

if (!inputFile) {
    console.error("Error: Input file path is required.");
    console.error("Usage: node quiet-bat.js <inputFile> [outputFile]");
    process.exit(1);
}

// Default output file name if not provided
if (!outputFile) {
    const ext = path.extname(inputFile);
    const base = path.basename(inputFile, ext);
    outputFile = path.join(path.dirname(inputFile), `${base}.quiet${ext || '.bat'}`);
}

try {
    // Read input file
    const content = fs.readFileSync(inputFile, 'utf8');

    // Process text content using regex
    const processedContent = content
        .replace(/^@REM.*$\r?\n+/gm, '') // Remove @REM lines
        .replace(/(\r?\n){3,}/g, '\r\n\r\n')          // Collapse 3+ newlines into 2
        .replace(/^\r?\n+|\r?\n+$/g, '');              // Trim leading and trailing newlines

    // Write output file
    fs.writeFileSync(outputFile, processedContent, 'utf8');
    console.log(`Successfully created: ${outputFile}`);
} catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
}
