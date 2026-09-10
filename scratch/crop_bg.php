<?php
$file = '/home/devcleon/fromme/public/images/forme-logo.png';
$img = imagecreatefrompng($file);

$width = imagesx($img);
$height = imagesy($img);

$minX = $width;
$maxX = 0;
$minY = $height;
$maxY = 0;

for ($x = 0; $x < $width; $x++) {
    for ($y = 0; $y < $height; $y++) {
        $color = imagecolorat($img, $x, $y);
        $alpha = ($color >> 24) & 0x7F;
        if ($alpha < 127) { // Not fully transparent
            if ($x < $minX) $minX = $x;
            if ($x > $maxX) $maxX = $x;
            if ($y < $minY) $minY = $y;
            if ($y > $maxY) $maxY = $y;
        }
    }
}

$newWidth = $maxX - $minX + 1;
$newHeight = $maxY - $minY + 1;

$cropped = imagecreatetruecolor($newWidth, $newHeight);
imagealphablending($cropped, false);
imagesavealpha($cropped, true);
$transparent = imagecolorallocatealpha($cropped, 0, 0, 0, 127);
imagefill($cropped, 0, 0, $transparent);

imagecopy($cropped, $img, 0, 0, $minX, $minY, $newWidth, $newHeight);
imagepng($cropped, $file);

imagedestroy($img);
imagedestroy($cropped);
echo "Cropped successfully.\n";
?>
