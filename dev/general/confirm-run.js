import prompts from 'prompts';

const response = await prompts({
  type: 'confirm',
  name: 'ok',
  message: 'Run the script?',
  initial: false
});

if (!response.ok) {
  process.exit(1);
}