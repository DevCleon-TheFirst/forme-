<?php
$inputFile = '/home/devcleon/.gemini/antigravity-ide/brain/facf8eb6-55c3-41bb-af1b-71772f9fac9e/forme_logo_raw_1789045683770.jpg';
$outputFile = '/home/devcleon/fromme/public/images/forme-logo.png';

$img = imagecreatefromjpeg($inputFile);
imagealphablending($img, false);
imagesavealpha($img, true);

$width = imagesx($img);
$height = imagesy($img);

$tolerance = 200;

for ($x = 0; $x < $width; $x++) {
    for ($y = 0; $y < $height; $y++) {
        $rgb = imagecolorat($img, $x, $y);
        $colors = imagecolorsforindex($img, $rgb);
        if ($colors['red'] > $tolerance && $colors['green'] > $tolerance && $colors['blue'] > $tolerance) {
            $trans_colour = imagecolorallocatealpha($img, 0, 0, 0, 127);
            imagesetpixel($img, $x, $y, $trans_colour);
        }
    }
}

imagepng($img, $outputFile);
imagedestroy($img);
echo "Background removed successfully.\n";
?>
