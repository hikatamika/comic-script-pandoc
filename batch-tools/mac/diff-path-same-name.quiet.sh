DEST="$HOME/DestinationFolder"

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
