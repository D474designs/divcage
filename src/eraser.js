//eraser.js: tracking colors

/*global mainVideoWidth:false, mainVideoHeight:false */

var eraser = function() {

  x.save();
  x.translate(w, 0);
  x.scale(-1,1);
  x.drawImage(v, 0, 0, w, h);
  x.restore();
  
  var pixels = x.getImageData(0, 0, w, h),
      pixCount = pixels.data.length / 4;

  var emptyArray = pixelDataArray(undefined);
  var map = emptyArray, scores = emptyArray;

  for(var pi = 0; pi < pixCount; pi++){
    index = pi*4;
    r = pixels.data[index];
    g = pixels.data[index+1];
    b = pixels.data[index+2];
    hsl = rgb2hsl(r, g, b);
    ha = hsl[0];
    s = hsl[1];
    l = hsl[2];
    
    var ri = Math.floor(pi/w),
        ci = pi % w;
        
    if (ha >= 70 && ha <= 180 &&
        s >= 25 && s <= 90 &&
        l >= 20 && l <= 95) {

      // Remove color data from the cells that are touched 
      paintArray[ri][ci] = false;
      map[ri][ci] = 1;

    } else {
      map[ri][ci] = 0;
    }

    // If color data exist, paint the pixel with corresponding color 
    if(paintArray[ri][ci]){
      pixels.data[pi * 4] = paintArray[ri][ci][0];
      pixels.data[pi * 4 + 1] = paintArray[ri][ci][1];
      pixels.data[pi * 4 + 2] = paintArray[ri][ci][2];
    }
  }

  scoreSum(scores, map);
  findClosestHighScore(scores);
  highlightPlacer(x, pixels);

  //put conditional to below: when does eraser mode stop?
  if(erasing && (!painting)) {
    setTimeout(eraser,50);
  }
};