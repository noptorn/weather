Add-Type -AssemblyName System.Drawing

$dir = 'D:\MySpace\Content\Weather\2026.05.29\T2'
$bg16 = Join-Path $dir 'bg16_generated.png'
$bg9 = Join-Path $dir 'bg9_generated.png'

function New-Bmp($w, $h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  @($bmp, $g)
}

function Draw-CoverImage($g, $path, $w, $h) {
  $img = [System.Drawing.Image]::FromFile($path)
  $scale = [Math]::Max($w / $img.Width, $h / $img.Height)
  $nw = [int]($img.Width * $scale)
  $nh = [int]($img.Height * $scale)
  $x = [int](($w - $nw) / 2)
  $y = [int](($h - $nh) / 2)
  $g.DrawImage($img, $x, $y, $nw, $nh)
  $img.Dispose()
}

function Fill-Overlay($g, $w, $h, $alpha) {
  $b = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, 0, 0, 0))
  $g.FillRectangle($b, 0, 0, $w, $h)
  $b.Dispose()
}

function Draw-TextPath($g, $text, $fontName, $size, $x, $y, $fill, $stroke, $strokeW) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $fam = New-Object System.Drawing.FontFamily($fontName)
  $path.AddString($text, $fam, [int][System.Drawing.FontStyle]::Bold, $size, (New-Object System.Drawing.PointF($x, $y)), [System.Drawing.StringFormat]::GenericTypographic)
  $pen = New-Object System.Drawing.Pen($stroke, $strokeW)
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $g.DrawPath($pen, $path)
  $brush = New-Object System.Drawing.SolidBrush($fill)
  $g.FillPath($brush, $path)
  $brush.Dispose()
  $pen.Dispose()
  $path.Dispose()
  $fam.Dispose()
}

function Draw-Badge($g, $rect, $text, $fontSize, $fill1, $fill2, $border, $textColor) {
  $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
  $r = 18
  $x = $rect.X
  $y = $rect.Y
  $w = $rect.Width
  $h = $rect.Height
  $gp.AddArc($x, $y, $r, $r, 180, 90)
  $gp.AddArc($x + $w - $r, $y, $r, $r, 270, 90)
  $gp.AddArc($x + $w - $r, $y + $h - $r, $r, $r, 0, 90)
  $gp.AddArc($x, $y + $h - $r, $r, $r, 90, 90)
  $gp.CloseFigure()
  $lg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $fill1, $fill2, 0)
  $g.FillPath($lg, $gp)
  $pen = New-Object System.Drawing.Pen($border, 6)
  $g.DrawPath($pen, $gp)
  Draw-TextPath $g $text 'Tahoma' $fontSize ($x + 28) ($y + 18) $textColor ([System.Drawing.Color]::Black) 7
  $lg.Dispose()
  $pen.Dispose()
  $gp.Dispose()
}

function Save-Png($bmp, $path) {
  if (Test-Path -LiteralPath $path) {
    Remove-Item -LiteralPath $path -Force
  }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

$yellow = [System.Drawing.Color]::FromArgb(255, 255, 230, 0)
$white = [System.Drawing.Color]::White
$red = [System.Drawing.Color]::FromArgb(255, 190, 0, 0)
$darkRed = [System.Drawing.Color]::FromArgb(255, 80, 0, 0)
$blue = [System.Drawing.Color]::FromArgb(255, 0, 68, 160)
$darkBlue = [System.Drawing.Color]::FromArgb(255, 0, 25, 90)
$cyan = [System.Drawing.Color]::FromArgb(255, 0, 220, 255)
$black = [System.Drawing.Color]::Black

$a = New-Bmp 1920 1080
$bmp = $a[0]
$g = $a[1]
Draw-CoverImage $g $bg16 1920 1080
$shade = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle(0, 0, 1150, 1080)), [System.Drawing.Color]::FromArgb(230, 0, 0, 0), [System.Drawing.Color]::FromArgb(20, 0, 0, 0), 0)
$g.FillRectangle($shade, 0, 0, 1150, 1080)
$shade.Dispose()
Draw-TextPath $g 'ฝนต่อเนื่อง' 'Tahoma' 142 70 66 $yellow $black 18
Draw-TextPath $g 'บ่าย-ค่ำ' 'Tahoma' 118 82 235 $white $black 16
Draw-Badge $g (New-Object System.Drawing.Rectangle(70, 520, 760, 138)) 'ใต้ฝั่งตก 70%' 68 $red $darkRed $yellow $white
Draw-Badge $g (New-Object System.Drawing.Rectangle(70, 690, 760, 130)) 'อันดามัน 2-3 ม.' 62 $blue $darkBlue $cyan $white
Draw-TextPath $g 'กทม.ฝน 60%' 'Tahoma' 58 92 870 $white $black 10
Draw-TextPath $g '29 พ.ค. 69' 'Tahoma' 50 1535 40 $white $black 9
Save-Png $bmp (Join-Path $dir 'cover16x9.png')
$g.Dispose()
$bmp.Dispose()

$a = New-Bmp 1080 1920
$bmp = $a[0]
$g = $a[1]
Draw-CoverImage $g $bg9 1080 1920
$shade = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle(0, 0, 1080, 560)), [System.Drawing.Color]::FromArgb(235, 0, 0, 0), [System.Drawing.Color]::FromArgb(35, 0, 0, 0), 90)
$g.FillRectangle($shade, 0, 0, 1080, 560)
$shade.Dispose()
Draw-TextPath $g 'ใต้ฝั่งตก' 'Tahoma' 122 58 70 $yellow $black 17
Draw-TextPath $g '70%' 'Arial' 230 72 210 $yellow $black 22
Draw-Badge $g (New-Object System.Drawing.Rectangle(72, 1350, 936, 130)) 'บ่าย-ค่ำ ฝนต่อ' 58 $red $darkRed $yellow $white
Draw-Badge $g (New-Object System.Drawing.Rectangle(72, 1515, 936, 124)) 'กทม.ฝน 60%' 56 $blue $darkBlue $cyan $white
Draw-TextPath $g 'อันดามัน 2-3 ม.' 'Tahoma' 54 88 1715 $white $black 9
Save-Png $bmp (Join-Path $dir 'cover9x16.png')
$g.Dispose()
$bmp.Dispose()

$a = New-Bmp 1920 1080
$bmp = $a[0]
$g = $a[1]
Draw-CoverImage $g $bg16 1920 1080
Fill-Overlay $g 1920 1080 70
Draw-TextPath $g 'สรุปฝน 29 พ.ค. 69' 'Tahoma' 78 58 38 $white $black 12
Draw-TextPath $g 'ใต้ฝั่งตก 70%' 'Tahoma' 78 58 150 $yellow $black 13
$rows = @(
  @('เหนือ', '60%'),
  @('อีสาน', '60%'),
  @('กลาง', '60%'),
  @('ตะวันออก', '60%'),
  @('ใต้ฝั่งออก', '60%'),
  @('ใต้ฝั่งตก', '70%'),
  @('กทม.-ปริมณฑล', '60%')
)
$y = 150
foreach ($row in $rows) {
  $hot = $row[0] -eq 'ใต้ฝั่งตก'
  $c1 = if ($hot) { [System.Drawing.Color]::FromArgb(215, 160, 0, 0) } else { [System.Drawing.Color]::FromArgb(190, 0, 25, 34) }
  $c2 = if ($hot) { [System.Drawing.Color]::FromArgb(215, 70, 0, 0) } else { [System.Drawing.Color]::FromArgb(190, 0, 12, 22) }
  Draw-Badge $g (New-Object System.Drawing.Rectangle(980, $y, 850, 78)) ($row[0] + '   ' + $row[1]) 40 $c1 $c2 $yellow $white
  $y += 92
}
Draw-Badge $g (New-Object System.Drawing.Rectangle(58, 865, 1210, 100)) 'อันดามันตอนบน 2-3 ม. | ฝนฟ้าคะนอง > 3 ม.' 42 $blue $darkBlue $cyan $white
Draw-TextPath $g 'เรือเล็กงดออกฝั่ง' 'Tahoma' 48 1390 885 $white $black 9
Save-Png $bmp (Join-Path $dir 'sum16x9.png')
$g.Dispose()
$bmp.Dispose()

$a = New-Bmp 1080 1920
$bmp = $a[0]
$g = $a[1]
Draw-CoverImage $g $bg9 1080 1920
Fill-Overlay $g 1080 1920 45
Draw-TextPath $g 'สรุปบ่าย-ค่ำ' 'Tahoma' 90 55 55 $white $black 13
Draw-TextPath $g 'ใต้ฝั่งตก 70%' 'Tahoma' 76 60 168 $yellow $black 13
$rows = @(
  @('เหนือ', '60%'),
  @('ตะวันออก', '60%'),
  @('ใต้ฝั่งตก', '70%'),
  @('กทม.', '60%')
)
$y = 1110
foreach ($row in $rows) {
  $hot = $row[0] -eq 'ใต้ฝั่งตก'
  $c1 = if ($hot) { [System.Drawing.Color]::FromArgb(220, 160, 0, 0) } else { [System.Drawing.Color]::FromArgb(205, 0, 25, 34) }
  $c2 = if ($hot) { [System.Drawing.Color]::FromArgb(220, 70, 0, 0) } else { [System.Drawing.Color]::FromArgb(205, 0, 12, 22) }
  Draw-Badge $g (New-Object System.Drawing.Rectangle(62, $y, 956, 98)) ($row[0] + '   ' + $row[1]) 44 $c1 $c2 $yellow $white
  $y += 120
}
Draw-Badge $g (New-Object System.Drawing.Rectangle(62, 1648, 956, 122)) 'อันดามัน 2-3 ม.' 54 $blue $darkBlue $cyan $white
Draw-TextPath $g 'เรือเล็กงดออกฝั่ง' 'Tahoma' 48 106 1802 $white $black 9
Save-Png $bmp (Join-Path $dir 'sum9x16.png')
$g.Dispose()
$bmp.Dispose()

