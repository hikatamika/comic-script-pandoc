@echo off

:loop
if "%~1"=="" goto end

echo Converting "%~1"...

pandoc -f docx "%~1" -t writer.lua -o "%~dpn1.tsv"

shift
goto loop

:end
echo Done.
pause