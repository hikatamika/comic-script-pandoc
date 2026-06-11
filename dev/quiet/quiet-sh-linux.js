import fs from 'fs';
import path from 'path';
import process from 'process';

// Get command line arguments
const args = process.argv.slice(2);
const inputFile = args[0];
let outputFile = args[1];

if (!inputFile) {
    console.error("Error: Input file path is required.");
    console.error("Usage: node quiet-sh-linux.js <inputFile> [outputFile]");
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

    // Strip Windows Byte Order Mark (BOM) if present to protect Linux compatibility
    if (content.startsWith('\uFEFF')) {
        content = content.slice(1);
    }

    // Process text content using regex
    const processedContent = content
        // Remove comments (lines starting with #) but ignore the shebang (#!...)
        .replace(/^(?!#!)[ \t]*#.*(?:\r?\n|$)/gm, '')
        // Collapse 3 or more newlines into 2 Linux newlines
        .replace(/(\r?\n|\n){3,}/g, '\n\n')
        // Trim leading and trailing newlines
        .replace(/^\n+|\n+$/g, '')
        // Ensure standard Linux LF line endings across the entire file
        .replace(/\r\n/g, '\n');

    // Write output file
    fs.writeFileSync(outputFile, processedContent, 'utf8');
    console.log(`Successfully created: ${outputFile}`);
} catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
}
