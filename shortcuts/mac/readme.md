## Mac Batch Shortcuts
These are bash scripts for the Mac app Automator…
…so IDK how they work if you just run them in terminal.

Instead,

1. Open a shortcut file and edit the appropriate parts. Again, there are instructions there to help you know what to change.
2. Without saving over the file, select all and copy its contents. Then,
3. Open Automator,
4. Pick `New Application`,
5. Add a `Run Shell Script` action
   - You can search for that with the search bar.
   - Pick `Shell: /bin/bash` and `Pass Input: as arguments`
6. And then empty the text box underneath and paste your code there instead.
7. Save the resulting Automator app next to your comic scripts.

Then you can drag comic scripts onto it to batch convert with pandoc.