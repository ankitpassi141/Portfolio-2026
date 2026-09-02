@echo off
REM Double-click this after adding or removing photos in images\gaming\ —
REM it rebuilds js\gaming-manifest.js so gaming-gallery.html picks them up.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-gaming-manifest.ps1"
pause
