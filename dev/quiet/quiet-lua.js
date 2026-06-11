import fs from 'fs';
import path from 'path';
import process from 'process';

// Get command line arguments
const args = process.argv.slice(2);
const inputFile = args[0];
let outputFile = args[1];

if (!inputFile) {
    console.error("Error: Input file path is required.");
    console.error("Usage: node quiet-lua.js <inputFile> [outputFile]");
    process.exit(1);
}

// Default output file name if not provided
if (!outputFile) {
    const ext = path.extname(inputFile);
    const base = path.basename(inputFile, ext);
    outputFile = path.join(path.dirname(inputFile), `${base}.quiet${ext || '.lua'}`);
}

try {
    // Read input file
    const content = fs.readFileSync(inputFile, 'utf8');

    // Process text content using regex
    const processedContent = content
        .replace(/--\[\[[\s\S]*?\]\]\r?\n*/g, '')      // Remove block comments --[[ ... ]]
        .replace(/^[ \t]*--.*\r?\n/gm, '')              // Remove whole-line single comments
        .replace(/[ \t]*--.*/g, '')                     // Remove inline single comments
        .replace(/(?<=\S)([ \t]{2,})/g, ' ')           // Collapse multiple spaces to single space
        .replace(/^\r?\n+|\r?\n+$/g, '');              // Trim leading and trailing newlines

    // Write output file
    fs.writeFileSync(outputFile, processedContent, 'utf8');
    console.log(`Successfully created: ${outputFile}`);
} catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
}
