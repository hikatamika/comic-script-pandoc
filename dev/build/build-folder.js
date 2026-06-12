import { readFileSync, readdirSync, mkdirSync, existsSync, statSync, cpSync, createWriteStream, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { ZipArchive } from 'archiver';

//SECTION - Consts

//SECTION - Important Paths
// Get current file path and dev>build
const currentDir = dirname(fileURLToPath(import.meta.url));

// Hop up two, get to project root
const projectRoot = resolve(currentDir, '../../');

// Thing so I don't repeat root all the time
const root = (...paths) => resolve(projectRoot, ...paths);

// Get version from package.json
const packageJsonPath = root('package.json');

const { version } = JSON.parse(
  readFileSync(packageJsonPath, 'utf8')
);

// Get to builds folder
const buildTargetDir = root('..', 'builds', version);

const samePlatDirs = ['pandoc', 'shortcuts'];

const srcReadme = root('manual.md');
//!SECTION - Important Paths

//SECTION - Proj Meta
// Project title
const projectName = 'Comic-Script-Pandoc';

//Folder Prefix
const topFolderPrefix = (suffix) =>
  `${projectName}-v${version}-${suffix}`;

//!SECTION - Proj Meta

//SECTION - OSes
// Build older structure
const platforms = [
  { name: 'Windows', shortcutSrc: 'windows' },
  { name: 'Mac', shortcutSrc: 'mac' },
  { name: 'Linux', shortcutSrc: 'linux' }
];

const topLvlBuildDirs = platforms.map(p => p.name);
//!SECTION - OSes

//!SECTION - Consts

//SECTION - Making the Folders
// Create the folders... carefully…
try {
    // The build folder itself
    mkdirSync(buildTargetDir, { recursive: true });
    console.log(`Successfully created folder: ${buildTargetDir}`);

    //SECTION - Making the platform folders + filling things that are the same
    // Top Level Folders
    platforms.forEach(({ name, shortcutSrc }) => {
      // ComicScriptPandoc
      const topFolder = topFolderPrefix(`${name}`);

      // Common paths
      const topPath = resolve(buildTargetDir, topFolder);
      const pandocPath = resolve(topPath, 'pandoc');
      const customPath = resolve(pandocPath, 'custom');
      const filtersPath = resolve(pandocPath, 'filters');

      mkdirSync(topPath, { recursive: true });

      // The things that are the same per platform: pandoc(empty), shortcuts(empty), and the readmes
      samePlatDirs.forEach(samePlat => {
        // make pandoc and shortcuts
        mkdirSync(resolve(topPath, samePlat), { recursive: true });
      });
      
      // Put in the readme
      ['md', 'txt'].forEach(ext =>
        cpSync(srcReadme, resolve(topPath, `readme.${ext}`))
      );

      // Back in pandoc, we fill it
      // Put in custom and filters
      mkdirSync(pandocPath, { recursive: true });
      mkdirSync(customPath, { recursive: true });
      mkdirSync(filtersPath, { recursive: true });

      // Copy the stuff to custom and filters
      // For the writers, skip the per-writer-type folder groupings
      
      const writersDir = root('writers');
      const customDir = customPath;

      function flattenCopy(srcDir, destDir) {
        for (const entry of readdirSync(srcDir)) {
          const srcPath = resolve(srcDir, entry);

          if (statSync(srcPath).isDirectory()) {
            flattenCopy(srcPath, destDir); // recurse
          } else {
            cpSync(srcPath, resolve(destDir, entry));
          }
        }
      }

      flattenCopy(writersDir, customDir);

      cpSync(root('filters'), filtersPath, { recursive: true });

      //SECTION - Filling the Platforms (While we're here)
      cpSync(
        root(`shortcuts/${shortcutSrc}`),
        resolve(topPath, 'shortcuts'),
        { recursive: true }
      );
      //!SECTION - Filling the Platforms

    });
    
    //!SECTION - Making the platform folders + filling things that are the same

    //SECTION - The script example folder
    const exFolder = topFolderPrefix('Example-Scripts');
    mkdirSync(resolve(buildTargetDir, exFolder), { recursive: true });
    cpSync(root('example-scripts'), resolve(buildTargetDir, exFolder), { recursive: true });
    //!SECTION - The script example folder

} catch (error) {
  console.error(`Failed to create directory:`, error.message);
  process.exit(1);
}
//!SECTION - Making the Folders

//SECTION - Zipping and Deleting the Build Folders
const foldersToZip = [
  ...topLvlBuildDirs.map(osName => topFolderPrefix(`${osName}`)),
  topFolderPrefix(`Example Scripts`)
];

function zipFolder(folderPath, zipOutputPath, label) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipOutputPath);
    const zipper = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', () => resolve(zipper.pointer()));
    output.on('error', reject);

    zipper.on('error', reject);

    zipper.pipe(output);
    zipper.directory(folderPath, false);
    zipper.finalize();
  }).then((bytes) => {
    console.log(`Zipped ${label}: ${bytes} bytes`);

    rmSync(folderPath, { recursive: true, force: true });
    console.log(`Deleted ${label}`);
  });
}

for (const folderName of foldersToZip) {
  const folderPath = resolve(buildTargetDir, folderName);
  const zipOutputPath = resolve(buildTargetDir, `${folderName}.zip`);

  if (!existsSync(folderPath)) {
    console.warn(`Skipping missing folder: ${folderName}`);
    continue;
  }

  try {
    await zipFolder(folderPath, zipOutputPath, folderName);
  } catch (err) {
    console.error(`Failed zip for ${folderName}:`, err);
  }
}
//!SECTION - Zipping and Deleting the Build Folders
