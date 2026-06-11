#!/usr/bin/env bash

for file in "$@"; do
    echo "Converting \"$file\"..."

    base="${file%.*}"

    pandoc -f docx "$file" \
           -t writer.lua \
           -o "${base}.tsv"
done

echo "Done."