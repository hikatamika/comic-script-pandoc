#!/usr/bin/env bash

for file in "$@"; do
    echo "Converting \"$file\"..."

    base="${file%.*}"

    # Change docx to your starting filetype on the -f line.
    # I highly recommend putting the Lua writer next to your Linux launcher.
    # Use the absolute path for your Lua writer if it's not next to your Linux launcher.
    # Either change your Lua writer's name to writer.Lua, or, put the name of the writer.Lua you want on the -t line.
    # The output on the -o line is done for you.
    pandoc -f docx "$file" \
           -t writer.lua \
           -o "${base}.tsv"
done

echo "Done."