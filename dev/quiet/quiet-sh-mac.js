import fs from 'fs';
import path from 'path';
import process from 'process';

// Get command line arguments
const args = process.argv.slice(2);
const inputFile = args[0]; // Extract string from index 0
let outputFile = args[1];  // Extract string from index 1

if (!inputFile) {
    console.error("Error: Input file path is required.");
    console.error("Usage: node quiet-sh-mac.js <inputFile> [outputFile]");
    process.exit(1);
}

// Default output file name if not provided
if (!outputFile) {
    const ext = path.extname(inputFile);
    const base = path.basename(inputFile, ext);
    outputFile = path.join(path.dirname(inputFile), `${base}.quiet${ext || '.sh'}`);
}

try {
    // Read input file
    let content = fs.readFileSync(inputFile, 'utf8');

    // Strip Windows Byte Order Mark (BOM) if present to protect Unix compatibility
    if (content.startsWith('\uFEFF')) {
        content = content.slice(1);
    }

    const processedContent = content
        // Remove ALL comment lines (including shebangs) and their trailing newlines
        .replace(/^[ \t]*#.*(?:\r?\n|$)/gm, '')
        // Trim leading and trailing newlines
        .replace(/^\r?\n+|\r?\n+$/g, '')
        // Ensure standard Unix LF line endings for macOS compatibility
        .replace(/\r\n/g, '\n');

    // Write output file
    fs.writeFileSync(outputFile, processedContent, 'utf8');
    console.log(`Successfully created: ${outputFile}`);
} catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
}
