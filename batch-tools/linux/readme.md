## Linux Batch Tools

1. With these you're gonna want to pick one `.sh` and its matching `.desktop`.
2. When you're using them, they should be in the same folder. Your Lua writer should be in the same folder too.
3. Open the `.sh` in a text editor and edit the pandoc lines so that your incoming filetype, .lua writer name, and outgoing file extension are what you want.
   - If you're using `diff-path-same-name`, you have to set your desired output folder path at the top.
4. Drag and drop your comic scripts into the `.desktop` icon and it should send all of them through Pandoc.