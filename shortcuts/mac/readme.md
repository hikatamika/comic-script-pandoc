## Mac Batch Shortcuts
These are bash scripts for the Mac app Automator…

…so IDK how they work if you just run them in terminal.

Ideally you:

1. Open Automator,
2. Pick new Application,
3. Add a `Run Shell Script` action
   - You can search for that with the search bar.
   - Pick `Shell: /bin/bash` and `Pass Input: as arguments`
4. And then empty the text box underneath and paste these scripts there instead.
5. Save the resulting Automator app next to your somewhere handy.

Then you can drag comic scripts onto it to batch convert with pandoc.