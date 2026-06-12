# Read Me

## "`pandoc`" Folder — Custom Writer Templates

You'll want to copy the contents of the `pandoc` to the matching `pandoc` data folder on your computer!
Though Pandoc will look for it here, Pandoc typically doesn't create the `pandoc` folder automatically. If you don't see it, make it!

### Windows

`C:\Users\USERNAME\AppData\Roaming\pandoc`  
AKA `%APPDATA%\pandoc`

### Mac

`/Users/USERNAME/.local/share`
AKA `$HOME/.local/share`

### Linux

`/home/USERNAME/.local/share`
AKA `$HOME/.local/share`

Make an Explorer/Finder/File Browser shortcut for this `pandoc` folder, as you'll likely want to copy, rename, and edit the Pandoc Writers in `custom` to tailor them to your project, keeping the original versions on hand.

In the Writer files, you can Find ⚙️ emojis that'll point you to options you can edit and toggle to tailor them to your comic scripts.

## "`shortcuts`" Folder — Conversion Shortcuts

This is where the drag and drop shortcuts for conversion are.
I recommend using these as a base; copying and modifying them per comic project.

### Windows & Linux

1. Copy a shortcut that exports converted comic scripts in the way you prefer, to where your comic scripts are.
   - For Windows users, the shortcut is just one file.
   - For Linux users, the `.sh` file of your choice and the `drag-on-me.desktop` launcher work together as one.
2. Open and edit the shortcut files. Instructions are there to help you know what to edit inside.

### Mac

1. Open a shortcut file and edit the appropriate parts. Again, there are instructions there to help you know what to change.
2. Without saving over the file, select all and copy its contents. Then,
3. Open Automator,
4. Pick `New Application`,
5. Add a `Run Shell Script` action
   - You can search for that with the search bar.
   - Pick `Shell: /bin/bash` and `Pass Input: as arguments`
6. And then empty the text box underneath and paste your code there instead.
7. Save the resulting Automator app next to your comic scripts.

### Converting Your Comic Scripts

From there, converting scripts should be as easy as dragging and dropping the script files onto the shortcut icon.