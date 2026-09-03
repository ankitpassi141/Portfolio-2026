# Downscales and recompresses every image in images/about/ for web use:
# caps the longest edge at $maxEdge (never upscales), re-encodes as JPEG at
# $quality, applies any EXIF rotation before resizing, and normalizes
# every filename to a lowercase .jpg extension — including from .png and
# .heic sources (System.Drawing on this machine can decode HEIC directly,
# via the Windows HEIF codec). Run this after adding or replacing a photo
# in images/about/. See reference/about-page.md for the expected filename
# per slot — this script does not rename files to match those slots, only
# normalizes/compresses whatever is already there.

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $root "images\about"
$maxEdge = 1600
$quality = 82L
$ORIENTATION_ID = 0x0112

if (-not (Test-Path $dir)) {
    Write-Error "images/about folder not found at $dir"
    exit 1
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

$exts = @(".jpg", ".jpeg", ".png", ".heic", ".heif")
$files = Get-ChildItem -Path $dir -File | Where-Object { $exts -contains $_.Extension.ToLower() }

$totalBefore = 0
$totalAfter = 0
$count = 0
$failed = @()

foreach ($f in $files) {
    $totalBefore += $f.Length
    $img = $null
    $bmp = $null
    try {
        $img = [System.Drawing.Image]::FromFile($f.FullName)

        if ($img.PropertyIdList -contains $ORIENTATION_ID) {
            $prop = $img.GetPropertyItem($ORIENTATION_ID)
            switch ([int]$prop.Value[0]) {
                2 { $img.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
                3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
                4 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
                5 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
                6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
                7 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
                8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
            }
        }

        $w = $img.Width; $h = $img.Height
        $scale = [Math]::Min(1.0, $maxEdge / [Math]::Max($w, $h))
        $nw = [Math]::Max(1, [int]([Math]::Round($w * $scale)))
        $nh = [Math]::Max(1, [int]([Math]::Round($h * $scale)))

        $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $nw, $nh)
        $g.Dispose()
        $img.Dispose()
        $img = $null

        $targetName = [System.IO.Path]::GetFileNameWithoutExtension($f.Name) + ".jpg"
        $targetPath = Join-Path $dir $targetName
        $tmpPath = $targetPath + ".tmp"

        $bmp.Save($tmpPath, $jpegCodec, $encParams)
        $bmp.Dispose()
        $bmp = $null

        if ($f.FullName -ne $targetPath) {
            Remove-Item -Path $f.FullName -Force
        }
        Move-Item -Path $tmpPath -Destination $targetPath -Force

        $totalAfter += (Get-Item $targetPath).Length
        $count++
    } catch {
        $failed += $f.Name
        Write-Warning "Failed on $($f.Name): $($_.Exception.Message)"
    } finally {
        if ($img) { $img.Dispose() }
        if ($bmp) { $bmp.Dispose() }
    }
}

Write-Output ("Compressed " + $count + "/" + $files.Count + " image(s): " + [Math]::Round($totalBefore/1MB,1) + " MB -> " + [Math]::Round($totalAfter/1MB,1) + " MB")
if ($failed.Count -gt 0) {
    Write-Output ("Failed: " + ($failed -join ", "))
}
