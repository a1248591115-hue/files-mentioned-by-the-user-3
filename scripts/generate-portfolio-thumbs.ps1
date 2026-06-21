param(
  [int]$ThumbLongEdge = 1000,
  [int]$DisplayLongEdge = 1800,
  [int]$ThumbQuality = 74,
  [int]$DisplayQuality = 80,
  [int]$MaxVideoMB = 20
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$sourceRoot = Join-Path $repoRoot '作品\杨君鸿视觉设计作品集'
$thumbRoot = Join-Path $repoRoot 'public\assets\portfolio-thumbs'
$displayRoot = Join-Path $repoRoot 'public\assets\portfolio-display'
$videoRoot = Join-Path $repoRoot 'public\assets\portfolio-videos'
$posterPath = Join-Path $repoRoot 'public\assets\video-card-poster.svg'
$manifestPath = Join-Path $repoRoot 'src\portfolioWorks.generated.js'
$sourceRootFull = [System.IO.Path]::GetFullPath($sourceRoot).TrimEnd('\') + '\'

New-Item -ItemType Directory -Force -Path $thumbRoot, $displayRoot, $videoRoot | Out-Null

function Convert-ToBase36([UInt32]$Number) {
  if ($Number -eq 0) { return '0' }
  $chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  $result = ''
  $n = [UInt64]$Number
  while ($n -gt 0) {
    $result = $chars[[int]($n % 36)] + $result
    $n = [Math]::Floor($n / 36)
  }
  return $result
}

function Get-PortfolioAssetHash([string]$Value) {
  $hash = [UInt32]2166136261
  $mask32 = [UInt64]4294967295
  foreach ($char in $Value.ToCharArray()) {
    $hash = [UInt32]($hash -bxor [UInt32][int][char]$char)
    $hash = [UInt32](([UInt64]$hash * [UInt64]16777619) -band $mask32)
  }
  return Convert-ToBase36 $hash
}

function Get-PortfolioGroup([string]$RelativePath, [bool]$IsVideo) {
  $path = '/' + ($RelativePath -replace '\\', '/')

  if ($IsVideo) {
    return @{ Category = 'editing'; Prefix = 'editing-video' }
  }

  if (
    $path.Contains('/插画/') -or
    $path.Contains('/海报设计/') -or
    $path.Contains('/书籍封面/') -or
    $path.Contains('/UI设计/') -or
    $path.Contains('/游戏ui/') -or
    $path.Contains('/电商设计/')
  ) {
    return @{ Category = 'graphic'; Prefix = 'graphic' }
  }

  if ($path.Contains('/AI短剧封面设计/') -or $path.Contains('/ai视频/')) {
    return @{ Category = 'editing'; Prefix = 'editing-image' }
  }

  if (
    $path.Contains('/IP设计/') -or
    $path.Contains('/产品设计/') -or
    $path.Contains('/包装设计/') -or
    $path.Contains('/海外产品设计/')
  ) {
    return @{ Category = 'ipProduct'; Prefix = 'ip-product' }
  }

  return $null
}

function Get-PortfolioHeight([string]$RelativePath, [bool]$IsVideo) {
  $path = '/' + ($RelativePath -replace '\\', '/')
  if ($IsVideo) { return 640 }
  if ($path.Contains('/电商设计/') -and $path.Contains('详情页')) { return 980 }
  if ($path.Contains('/海报设计/') -or $path.Contains('/书籍封面/')) { return 860 }
  if ($path.Contains('/IP设计/') -or $path.Contains('/产品设计/') -or $path.Contains('/包装设计/')) { return 780 }
  if ($path.Contains('/插画/')) { return 760 }
  if ($path.Contains('/UI设计/') -or $path.Contains('/游戏ui/')) { return 720 }
  if ($path.Contains('/电商设计/')) { return 660 }
  return 720
}

function Get-PortfolioTitle([System.IO.FileInfo]$File) {
  return [System.IO.Path]::GetFileNameWithoutExtension($File.Name).Replace('_', ' ').Replace('-', ' ')
}

function Save-PortfolioJpeg([System.IO.FileInfo]$File, [string]$OutputPath, [int]$MaxLongEdge, [int]$Quality) {
  if ((Test-Path -LiteralPath $OutputPath) -and
      ((Get-Item -LiteralPath $OutputPath).LastWriteTimeUtc -ge $File.LastWriteTimeUtc)) {
    return $false
  }

  $image = $null
  $bitmap = $null
  $graphics = $null
  $encoderParams = $null

  try {
    $image = [System.Drawing.Image]::FromFile($File.FullName)
    $scale = [Math]::Min($MaxLongEdge / $image.Width, $MaxLongEdge / $image.Height)
    if ($scale -gt 1) { $scale = 1 }

    $width = [Math]::Max(1, [int][Math]::Round($image.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($image.Height * $scale))

    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.Clear([System.Drawing.Color]::FromArgb(16, 13, 24))
    $graphics.DrawImage($image, 0, 0, $width, $height)

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
      Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
      [System.Drawing.Imaging.Encoder]::Quality,
      [int64]$Quality
    )

    $bitmap.Save($OutputPath, $codec, $encoderParams)
    return $true
  } catch {
    Write-Warning "Skipped image: $($File.FullName) - $($_.Exception.Message)"
    return $false
  } finally {
    if ($encoderParams) { $encoderParams.Dispose() }
    if ($graphics) { $graphics.Dispose() }
    if ($bitmap) { $bitmap.Dispose() }
    if ($image) { $image.Dispose() }
  }
}

$posterSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#111827"/>
      <stop offset=".55" stop-color="#312e81"/>
      <stop offset="1" stop-color="#c4b5fd"/>
    </linearGradient>
    <radialGradient id="r" cx="68%" cy="34%" r="50%">
      <stop stop-color="#e9d5ff" stop-opacity=".8"/>
      <stop offset=".35" stop-color="#a78bfa" stop-opacity=".45"/>
      <stop offset="1" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" rx="48" fill="url(#g)"/>
  <rect width="1200" height="800" rx="48" fill="url(#r)"/>
  <path d="M535 302v196l170-98-170-98z" fill="#fff" fill-opacity=".88"/>
  <text x="72" y="690" fill="#fff" fill-opacity=".88" font-family="Arial, sans-serif" font-size="54" font-weight="700">VIDEO WORK</text>
</svg>
'@
Set-Content -LiteralPath $posterPath -Value $posterSvg -Encoding UTF8

$portfolio = [ordered]@{
  graphic = @()
  editing = @()
  ipProduct = @()
}
$counters = @{}
$imageCreated = 0
$imageSkipped = 0
$videoCopied = 0
$videoSkippedLarge = 0

$imageFiles = Get-ChildItem -LiteralPath $sourceRoot -Recurse -File |
  Where-Object { $_.Extension -match '^\.(png|jpg|jpeg|webp)$' } |
  Sort-Object FullName

foreach ($file in $imageFiles) {
  $relative = $file.FullName.Substring($sourceRootFull.Length)
  $group = Get-PortfolioGroup $relative $false
  if (-not $group) { continue }

  $jsPath = '../作品/杨君鸿视觉设计作品集/' + ($relative -replace '\\', '/')
  $hash = Get-PortfolioAssetHash $jsPath
  $thumbPath = Join-Path $thumbRoot "$($group.Prefix)-$hash.jpg"
  $displayPath = Join-Path $displayRoot "$($group.Prefix)-$hash.jpg"

  $changedThumb = Save-PortfolioJpeg $file $thumbPath $ThumbLongEdge $ThumbQuality
  $changedDisplay = Save-PortfolioJpeg $file $displayPath $DisplayLongEdge $DisplayQuality
  if ($changedThumb -or $changedDisplay) { $imageCreated += 1 } else { $imageSkipped += 1 }

  if (-not $counters.ContainsKey($group.Prefix)) { $counters[$group.Prefix] = 0 }
  $counters[$group.Prefix] += 1

  $portfolio[$group.Category] += [ordered]@{
    id = "$($group.Prefix)-$($counters[$group.Prefix].ToString('000'))"
    img = "/assets/portfolio-display/$($group.Prefix)-$hash.jpg"
    url = "/assets/portfolio-display/$($group.Prefix)-$hash.jpg"
    thumb = "/assets/portfolio-thumbs/$($group.Prefix)-$hash.jpg"
    height = Get-PortfolioHeight $relative $false
    title = Get-PortfolioTitle $file
    type = 'image'
    sourcePath = $jsPath
  }
}

$videoFiles = Get-ChildItem -LiteralPath (Join-Path $sourceRoot 'ai视频') -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -match '^\.(mp4|webm|mov)$' } |
  Sort-Object FullName

foreach ($file in $videoFiles) {
  $relative = $file.FullName.Substring($sourceRootFull.Length)
  $group = Get-PortfolioGroup $relative $true
  $jsPath = '../作品/杨君鸿视觉设计作品集/' + ($relative -replace '\\', '/')
  $hash = Get-PortfolioAssetHash $jsPath
  $extension = $file.Extension.ToLowerInvariant()

  if ($file.Length -gt ($MaxVideoMB * 1MB)) {
    $videoSkippedLarge += 1
    Write-Warning "Skipped oversized video (> $MaxVideoMB MB): $($file.FullName)"
    continue
  }

  $videoOutput = Join-Path $videoRoot "$($group.Prefix)-$hash$extension"
  if ((-not (Test-Path -LiteralPath $videoOutput)) -or
      ((Get-Item -LiteralPath $videoOutput).LastWriteTimeUtc -lt $file.LastWriteTimeUtc)) {
    Copy-Item -LiteralPath $file.FullName -Destination $videoOutput -Force
    $videoCopied += 1
  }

  if (-not $counters.ContainsKey($group.Prefix)) { $counters[$group.Prefix] = 0 }
  $counters[$group.Prefix] += 1

  $portfolio[$group.Category] += [ordered]@{
    id = "$($group.Prefix)-$($counters[$group.Prefix].ToString('000'))"
    img = '/assets/video-card-poster.svg'
    url = "/assets/portfolio-videos/$($group.Prefix)-$hash$extension"
    thumb = '/assets/video-card-poster.svg'
    height = Get-PortfolioHeight $relative $true
    title = Get-PortfolioTitle $file
    type = 'video'
    sourcePath = $jsPath
  }
}

$json = $portfolio | ConvertTo-Json -Depth 8
$manifest = @"
// This file is generated by scripts/generate-portfolio-thumbs.ps1.
// Add, remove, or rename works in 作品/杨君鸿视觉设计作品集, then run: npm run thumbs
export const portfolioWorks = $json;

"@
Set-Content -LiteralPath $manifestPath -Value $manifest -Encoding UTF8

Write-Host "Portfolio assets ready. images updated: $imageCreated, cached: $imageSkipped, videos copied: $videoCopied, large videos skipped: $videoSkippedLarge"
Write-Host "Thumbnails: $thumbRoot"
Write-Host "Display images: $displayRoot"
Write-Host "Manifest: $manifestPath"

