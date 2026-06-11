#!/usr/bin/env bash

# I recommend renaming this file to something comic project specific, or, specific to your preferred Pandoc Lua Writer.

for file in "$@"; do
    echo "Converting \"$file\"..."

    base="${file%.*}"

    # Change docx to your starting filetype on the -f line.
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