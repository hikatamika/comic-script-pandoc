# A Powershell script to make quiet.lua files using run-on-save tools in IDEs.
param(
    [Parameter(Mandatory=$true)]
    [string]$InputFile,

    [string]$OutputFile
)

if (-not $OutputFile) {
    $OutputFile = [System.IO.Path]::ChangeExtension($InputFile, "quiet.bat")
}

(Get-Content $InputFile -Raw) `
    -replace '(?m)^@REM.*\n+' `
    -replace '(\r?\n){3,}', "`r`n`r`n" `
    -replace '^\r?\n+|\r?\n+$' |
    Set-Content $OutputFile