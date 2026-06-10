#!/usr/bin/env bash

# Destination folder. Change it if you want your stuff to go somewhere else.
DEST="$HOME/DestinationFolder"

# Gets created if it doesn't exist
mkdir -p "$DEST"

for file in "$@"; do
    echo "Converting \"$file\"..."

    filename=$(basename "$file")
    basename_no_ext="${filename%.*}"

    # Change docx to your starting filetype on the -f line.
    # I highly recommend putting the lua writer next to your Automator app.
    # Use the absolute path for your lua writer if it's not next to your Automator app.
    # Either change your lua writer's name to writer.lua, or, put the name of the writer.lua you want on the -t line.
    # The output on the -o line is done for you.
    pandoc -f docx "$file" \
           -t writer.lua \
           -o "$DEST/${basename_no_ext}.tsv"
done

echo "Done."