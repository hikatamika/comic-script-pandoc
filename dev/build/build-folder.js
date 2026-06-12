import { readFileSync, mkdirSync, existsSync, renameSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

//SECTION - Consts

// Get current file path and dev>build
const __filename = fileURLToPath(import.meta.url);
const currentDir = dirname(__filename);

// Hop up two, get to project root
const projectRoot = resolve(currentDir, '..', '..');

// Get version from package.json
const packageJsonPath = resolve(projectRoot, './package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Get to builds folder
const buildTargetDir = resolve(projectRoot, '..', 'builds', version);

//
const topLvlBuildDirs = ['Windows', 'Mac', 'Linux'];
const samePlatDirs = ['pandoc', 'shortcuts'];
const perPandocFolder = ['custom', 'filters'];

const srcReadme = resolve(projectRoot, 'dev/build/build-readme.md');

//!SECTION - Consts

//SECTION - Making the Folders
// Create the folders... carefully…
try {
  if (!existsSync(buildTargetDir)) {
    // The build folder itself
    mkdirSync(buildTargetDir, { recursive: true });
    console.log(`Successfully created folder: ${buildTargetDir}`);

    //SECTION - Making the platform folders + filling things that are the same
    // Top Level Folders
    topLvlBuildDirs.forEach(topFolder => {
      mkdirSync(resolve(buildTargetDir, topFolder), { recursive: true });

      // The things that are the same per platform: pandoc(empty), shortcuts(empty), and the readmes
      samePlatDirs.forEach(samePlat => {
        // make pandoc and shortcuts
        mkdirSync(resolve(buildTargetDir, topFolder, samePlat), { recursive: true });
        // Put in the readme
        cpSync(srcReadme, resolve(buildTargetDir, topFolder, 'readme.md'));
        cpSync(srcReadme, resolve(buildTargetDir, topFolder, 'readme.txt'));
      });

      // Back in pandoc, we fill it
      // Put in custom and filters
      perPandocFolder.forEach(perPandoc => {
        mkdirSync(resolve(buildTargetDir, topFolder, 'pandoc', perPandoc), { recursive: true });
      });

      // Copy the stuff to custom and filters
      cpSync(resolve(projectRoot, 'writers'), resolve(buildTargetDir, topFolder, 'pandoc', 'custom'), { recursive: true });
      cpSync(resolve(projectRoot, 'filters'), resolve(buildTargetDir, topFolder, 'pandoc', 'filters'), { recursive: true });
    });
    //!SECTION - Making the platform folders + filling things that are the same

    //SECTION - Filling Windows
    cpSync(resolve(projectRoot, 'shortcuts/windows'), resolve(buildTargetDir, 'Windows', 'shortcuts'), { recursive: true });
    //!SECTION - Filling Windows
    
    //SECTION - Filling Mac
    cpSync(resolve(projectRoot, 'shortcuts/mac'), resolve(buildTargetDir, 'Mac', 'shortcuts'), { recursive: true });
    //!SECTION - Filling Mac
    
    //SECTION - Filling Linux
    cpSync(resolve(projectRoot, 'shortcuts/mac'), resolve(buildTargetDir, 'Linux', 'shortcuts'), { recursive: true });
    //!SECTION - Filling Linux

    //SECTION - The script example folder
    mkdirSync(resolve(buildTargetDir, 'Example Scripts'), { recursive: true });
    cpSync(resolve(projectRoot, 'example-scripts'), resolve(buildTargetDir, 'Example Scripts'), { recursive: true });
    //!SECTION - The script example folder

  } else {
    console.log(`Folder already exists: ${buildTargetDir}`);
  }
} catch (error) {
  console.error(`Failed to create directory:`, error.message);
  process.exit(1);
}
//!SECTION - Making the Folders

