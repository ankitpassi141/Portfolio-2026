# Downscales and recompresses every image in images/gaming/ for web use:
# caps the longest edge at $maxEdge (never upscales), re-encodes as JPEG at
# $quality, applies any EXIF rotation before resizing (some of these are
# real phone photos, not screenshots), and normalizes every filename to a
# lowercase .jpg extension. Run this after dropping new photos into
# images/gaming/, before build-gaming-manifest.ps1 (or just double-click
# scripts/update-gaming.bat, which runs the manifest step only — this one
# is a separate, deliberate step since it's lossy).

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $root "images\gaming"
$maxEdge = 1800
$quality = 80L
$ORIENTATION_ID = 0x0112

if (-not (Test-Path $dir)) {
    Write-Error "images/gaming folder not found at $dir"
    exit 1
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

$exts = @(".jpg", ".jpeg", ".png")
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
