import { readFileSync, mkdirSync, existsSync, renameSync, cpSync, createWriteStream, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { ZipArchive } from 'archiver';

//SECTION - Consts

// Get current file path and dev>build
const __filename = fileURLToPath(import.meta.url);
const currentDir = dirname(__filename);

// Project title
const projectName = 'Comic-Script-Pandoc'; 

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

const archive = new ZipArchive({ zlib: { level: 9 } });

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
    topLvlBuildDirs.forEach(topFolderBaseName => {
      // ComicScriptPandoc
      const topFolder = `Comic-Script-Pandoc-v${version}-${topFolderBaseName}`; 

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
    const winFolder = `${projectName}-v${version}-Windows`;
    cpSync(resolve(projectRoot, 'shortcuts/windows'), resolve(buildTargetDir, winFolder, 'shortcuts'), { recursive: true });
    //!SECTION - Filling Windows
    
    //SECTION - Filling Mac
    const macFolder = `${projectName}-v${version}-Mac`;
    cpSync(resolve(projectRoot, 'shortcuts/mac'), resolve(buildTargetDir, macFolder, 'shortcuts'), { recursive: true });  
    //!SECTION - Filling Mac
    
    //SECTION - Filling Linux
    const linFolder = `${projectName}-v${version}-Linux`;
    cpSync(resolve(projectRoot, 'shortcuts/linux'), resolve(buildTargetDir, linFolder, 'shortcuts'), { recursive: true });
    //!SECTION - Filling Linux

    //SECTION - The script example folder
    const exFolder = `${projectName}-v${version}-Example Scripts`;
    mkdirSync(resolve(buildTargetDir, exFolder), { recursive: true });
    cpSync(resolve(projectRoot, 'example-scripts'), resolve(buildTargetDir, exFolder), { recursive: true });
    //!SECTION - The script example folder

  } else {
    console.log(`Folder already exists: ${buildTargetDir}`);
  }
} catch (error) {
  console.error(`Failed to create directory:`, error.message);
  process.exit(1);
}
//!SECTION - Making the Folders

//SECTION - Zipping and Deleting the Build Folders
const foldersToZip = [
  ...topLvlBuildDirs.map(osName => `${projectName}-v${version}-${osName}`), 
  `${projectName}-v${version}-Example Scripts`
];

foldersToZip.forEach(folderName => {
  const folderPath = resolve(buildTargetDir, folderName);
  const zipOutputPath = resolve(buildTargetDir, `${folderName}.zip`);

  // Verify the folder exists before attempting to zip
  if (!existsSync(folderPath)) return;

  const output = createWriteStream(zipOutputPath);
  const zipper = new ZipArchive({ zlib: { level: 9 } });

  // CRITICAL: Only delete the directory AFTER the write stream has completely closed
  output.on('close', () => {
    console.log(`Successfully zipped ${folderName}: ${zipper.pointer()} total bytes`);
    
    try {
      rmSync(folderPath, { recursive: true, force: true });
      console.log(`Successfully deleted source folder: ${folderName}`);
    } catch (rmError) {
      console.error(`Failed to delete source folder ${folderName}:`, rmError.message);
    }
  });

  zipper.on('error', (err) => {
    console.error(`Error zipping ${folderName}:`, err);
  });

  zipper.pipe(output);
  
  // Append contents cleanly
  zipper.directory(folderPath, false); 
  
  zipper.finalize();
});
//!SECTION - Zipping and Deleting the Build Folders
