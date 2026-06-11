@echo off

set "DEST=C:\DestinationFolder"

if not exist "%DEST%" mkdir "%DEST%"

:loop
if "%~1"=="" goto end

echo Converting "%~1"...

pandoc -f docx "%~1" -t writer.lua -o "%DEST%\%~n1.tsv"

shift
goto loop

:end
echo Done.
pause
