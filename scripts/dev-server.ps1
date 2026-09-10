# Minimal static file server for local preview (no Node/Python available
# on this machine). Serves the repo root over HTTP so relative-path CSS/
# JS/asset links resolve the same way they do on GitHub Pages.
param(
  [int]$Port = 5173
)

$root = Split-Path -Parent $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Output "Serving $root on http://localhost:$Port/"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".mp3"  = "audio/mpeg"
  ".ico"  = "image/x-icon"
  ".woff" = "font/woff"
  ".woff2"= "font/woff2"
  ".webmanifest" = "application/manifest+json"
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    try {
      $relPath = [Uri]::UnescapeDataString($request.Url.AbsolutePath)
      if ($relPath -eq "/") { $relPath = "/index.html" }
      $filePath = Join-Path $root ($relPath.TrimStart("/"))

      if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = $mime[$ext]
        if (-not $contentType) { $contentType = "application/octet-stream" }
        $response.ContentType = $contentType
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $response.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
        $response.OutputStream.Write($notFound, 0, $notFound.Length)
      }
    } catch {
      try { $response.StatusCode = 500 } catch {}
    } finally {
      # A client that aborts mid-download (e.g. a page unloading with many
      # background-image requests in flight) leaves this throwing on close
      # — swallow it so one flaky connection can't take the whole loop down.
      try { $response.OutputStream.Close() } catch {}
    }
  }
} finally {
  $listener.Stop()
}
