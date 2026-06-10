for file in "$@"; do
    echo "Converting \"$file\"..."

    # Get filename without extension
    base="${file%.*}"

    # Change docx to your starting file type. 
    # Use the absolute path for your lua writer if it's not next to your automator app
    # The output is done for you.
    pandoc -f docx "$file" \
           -t writer.lua \
           -o "${base}.tsv"
done

echo "Done."
