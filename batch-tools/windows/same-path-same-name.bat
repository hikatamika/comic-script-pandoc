@REM Drag and drop comic scripts onto this .BAT icon to convert them.
@REM You can rename this to something else if you want.

@echo off

:loop
if "%~1"=="" goto end

echo Converting "%~1"...

@REM Don't forget, -f is for "From" file type (`docx`, here); change it if you're starting from a different filetype.
@REM -t is for "To" writer. For our purposes, typically a specified .lua
@REM   Rename `writer.lua` to the Pandoc writer you're using, or rename the writer you're using to 'writer.lua`.
@REM   Link the LUA Writer relatively, or absolutely if it's not in the same place as this batch file.
@REM The input and output filenames are handled for you.
@REM   Change .tsv to another file extension if need be.

pandoc -f docx "%~1" -t writer.lua -o "%~dpn1.tsv"

shift
goto loop

:end
echo Done.
pause