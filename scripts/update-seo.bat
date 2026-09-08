@echo off
REM Double-click this after editing seo-data.json — it regenerates the
REM og:/twitter: meta block in every page listed there.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync-seo-meta.ps1"
pause
