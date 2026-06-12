#!/usr/bin/env bash

# I recommend renaming this file to something comic project specific, or, specific to your preferred Pandoc Lua Writer.

# Destination folder. Change it if you want your stuff to go somewhere else.
DEST="$HOME/DestinationFolder"

# Gets created if it doesn't exist
mkdir -p "$DEST"

for file in "$@"; do
    echo "Converting \"$file\"..."

    filename=$(basename "$file")
    basename_no_ext="${filename%.*}"

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
           -o "$DEST/${basename_no_ext}.tsv"
done

echo "Done."