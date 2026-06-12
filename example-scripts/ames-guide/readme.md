## Converted `ames-guide.docx` with

```cmd
pandoc -f docx example-scripts/ames-guide.docx --lua-filter em-to-double-dash.lua -t ames-guide.lua -o example-scripts/ames-guide-docx.tsv
```

## Converted `ames-guide.md` with

```cmd
pandoc -f commonmark_x-yaml_metadata_block example-scripts/ames-guide.md --lua-filter filters/em-to-double-dash.lua -t writers/ames-guide.lua -o example-scripts/ames-guide-md.tsv
```

> [!warning]
> The `-yaml_metadata_block` on `commonmark_x` was important. Pandoc refused the file due to its YAML mapping values, without it.

> [!note]
> Take note of the use of `--lua-filter em-to-double-dash.lua` in both.