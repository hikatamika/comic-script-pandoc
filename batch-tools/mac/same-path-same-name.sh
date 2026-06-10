#!/bin/bash

# Paste this file into an Automator Application

for file in "$@"; do
    echo "Converting \"$file\"..."

    # Get filename without extension
    base="${file%.*}"

    # Change docx to your starting filetype on the -f line.
    # I highly recommend putting the lua writer next to your automator app.
    # Use the absolute path for your lua writer if it's not next to your automator app.
    # Either change your lua writer's name to writer.lua, or, put the name of the writer.lua you want on the -t line.
    # The output on the -o line is done for you.
    pandoc -f docx "$file" \
           -t writer.lua \
           -o "${base}.tsv"
done

echo "Done."