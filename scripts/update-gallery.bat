@echo off
REM Double-click this after adding or removing photos in images\gallery\ —
REM it rebuilds js\gallery-manifest.js so gallery.html picks them up.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-gallery-manifest.ps1"
pause
