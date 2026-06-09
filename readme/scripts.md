# Scripts

## [Ames Guide](../scripts/ames-guide.lua)

### Recommendations
The first, and hopefully not last, parser. For those that like to measure twice and cut once.

It's inspired by [**Steenz's Standard Comic Script**](https://www.oheysteenz.com/scs-template) and works well with that structure, given that in word processing apps, _you use **styles** instead of styling the script elements manually line-by line._

Try it with:

- MS Word `.DOCX`
- LibreOffice `.ODT`
- Markdown `.MD`

> [!info]
> If you're using Google Docs, ensure you're using _styles_ instead of _**manual styling**_. Then, download as one of the above filetypes.

### Input

| Element | Notes |
| :------ | :---- |
| Pages   | Should share a unique heading level.<br><br>Can be auto-numbered by the parser. Alternatively, the parser can pull page numbers from your comic script. |
| Lettering Sources | Should share a unique heading level.<br>The name of the heading label becomes the name of the lettering source.    |
| Lettering Lines   | Should be:<br><br>• automatically ordered lists _(**no** manual, typed-text numbering),_<br>• block quotes,<br>• or paragraphs more indented than previous line.     |