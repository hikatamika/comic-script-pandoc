#!/bin/bash

# Paste this file into an Automator Application

# Destination folder
DEST="$HOME/DestinationFolder"

# Gets created if it doesn't exist
mkdir -p "$DEST"

for file in "$@"; do
    echo "Converting \"$file\"..."

    # Filename without path or extension
    filename=$(basename "$file")
    basename_no_ext="${filename%.*}"

    pandoc -f docx "$file" \
           -t writer.lua \
           -o "$DEST/${basename_no_ext}.tsv"
done

echo "Done."