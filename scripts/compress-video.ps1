# Converts and compresses a source video (any format ffmpeg reads — .mov,
# .mp4, whatever a phone exports) into a small, web-ready .mp4 (with
# audio), plus a poster .jpg frame — the pair used by a hobby card's
# hover-video feature (see reference/about-page.md). Requires ffmpeg on
# PATH.
#
# Usage:
#   scripts/compress-video.ps1 -InputPath "images/about/source.mov" -Slug "hobby-6-football"
#
# Writes images/about/<Slug>.mp4 and images/about/<Slug>.jpg. Does NOT
# delete the input file — remove it yourself once you've checked the
# output looks right.
#
# The poster is grabbed from frame 0 of the FINISHED output video, not
# the source — that guarantees it's pixel-identical to what the video
# shows the instant it starts playing (about.js resets currentTime to 0
# on every hover), so there's no visible "jump" when hover swaps the
# static photo for the video.

param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$Slug,
    [int]$Duration = 30,       # seconds kept, from the start of the clip
    [int]$Width = 480,         # output width in px; height scales to match, even
    [int]$Crf = 26             # x264 quality — lower = bigger/better, 23-28 is a sane range
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Error "ffmpeg not found on PATH. Install it (e.g. 'winget install Gyan.FFmpeg') and restart your shell."
    exit 1
}
if (-not (Test-Path $InputPath)) {
    Write-Error "Input file not found: $InputPath"
    exit 1
}

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "images\about"
$mp4Path = Join-Path $outDir ($Slug + ".mp4")
$jpgPath = Join-Path $outDir ($Slug + ".jpg")

Write-Output "Encoding video -> $mp4Path"
ffmpeg -y -i $InputPath -t $Duration -vf "scale=$($Width):-2" -c:v libx264 -preset slow -crf $Crf -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart $mp4Path

Write-Output "Extracting poster frame (from the output, so it matches frame 0 exactly) -> $jpgPath"
ffmpeg -y -i $mp4Path -vframes 1 -update 1 -q:v 3 $jpgPath

$mp4Size = [Math]::Round((Get-Item $mp4Path).Length / 1MB, 2)
$jpgSize = [Math]::Round((Get-Item $jpgPath).Length / 1KB, 0)
Write-Output "Done: $Slug.mp4 ($mp4Size MB), $Slug.jpg ($jpgSize KB)"
Write-Output "Add `"video: `"$Slug.mp4`"`" to that hobby's entry in js/about-data.js (photo: `"$Slug.jpg`" should already match)."
