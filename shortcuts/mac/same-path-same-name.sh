#!/bin/bash

# Paste this file into an Automator Application made for your project, or, preferred Pandoc Lua Writer and save destination.

for file in "$@"; do
    echo "Converting \"$file\"..."

    base="${file%.*}"

    # Change docx to your starting filetype on the -f line.
    # If you want to use a Pandoc filter, 
    # add a line after -f docx "$file" that says:
    # "--lua-filter the-filter-you-want.lua \"
    # make an additional --lua-filter line for each one you want.
    # Put the name of the writer.lua you want on the -t line.
    # I highly recommend putting the Pandoc Lua Writer in Pandoc's data directory,
    # …or next to your Linux launcher so you don't have to link it by absolute path.
    # The output on the -o line is done for you.
    # Change .tsv to another file extension if need be.
    pandoc -f docx "$file" \
           -t writer.lua \
           -o "${base}.tsv"
done

echo "Done."