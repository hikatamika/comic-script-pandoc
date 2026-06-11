import { execSync } from 'node:child_process';
import pkg from '../package.json' with { type: 'json' };

const tag = `v${pkg.version}`;

execSync(`git tag ${tag}`, { stdio: 'inherit' });

console.log(`Created tag ${tag}`);

// Create AND push. I wanna test just creating first, lowk.
// execSync(`git push origin ${tag}`, { stdio: 'inherit' });

// console.log(`Created and pushed ${tag}`);