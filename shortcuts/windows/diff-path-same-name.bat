@REM Drag and drop comic scripts onto this .BAT icon to convert them.
@REM I recommend renaming this file to something comic project specific, or, something specific to your preferred Pandoc Lua Writer.

@echo off

@REM Paste your preferred destination folder path here.
set "DEST=C:\DestinationFolder"

@REM If the place doesn't exist, or you typo'd, it'll get created. So be careful.
if not exist "%DEST%" mkdir "%DEST%"

:loop
if "%~1"=="" goto end

echo Converting "%~1"...

@REM Change docx to your starting filetype on the -f line.
@REM If you want to use a Pandoc filter, 
@REM add a line after -f docx "$file" that says:
@REM "--lua-filter the-filter-you-want.lua \"
@REM make an additional --lua-filter line for each one you want.
@REM Put the name of the writer.lua you want on the -t line.
@REM I highly recommend putting the Pandoc Lua Writer in Pandoc's data directory,
@REM …or next to your Linux launcher so you don't have to link it by absolute path.
@REM The input and output filenames are handled for you.
@REM   Change .tsv to another file extension if need be.

pandoc -f docx "%~1" -t writer.lua -o "%DEST%\%~n1.tsv"

shift
goto loop

:end
echo Done.
pause