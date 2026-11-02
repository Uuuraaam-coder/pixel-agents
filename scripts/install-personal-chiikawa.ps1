# Personal-use only. Fan sprites are not bundled or redistributed with this repository.
$ErrorActionPreference = "Stop"
$base = "https://raw.githubusercontent.com/heelee912/chiikawa-dots-pets/main/pets"
$dest = Join-Path $PSScriptRoot "..\webview-ui\public\personal-characters"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$characters = @("chiikawa", "hachiware", "usagi", "momonga")
foreach ($id in $characters) {
  $url = "$base/$id/spritesheet.png"
  $out = Join-Path $dest "$id.png"
  Write-Host "Downloading personal character asset: $id"
  Invoke-WebRequest -Uri $url -OutFile $out
  if ((Get-Item $out).Length -lt 1024) { throw "Downloaded sprite appears invalid: $id" }
}
Write-Host "Four personal sprite sheets are installed at $dest"
Write-Host "Run npm run build again. Do not commit the downloaded images to a public repository."
