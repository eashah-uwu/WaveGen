

export const sketch = (p5) => {

  const toHex = (color) => {
    let r = color[0]
    let g = color[1]
    let b = color[2]
    let sum = 255 +  b*256 + g*256*256 + r*256*256*256
    let hex ="#"+p5.hex(sum).substr(0, 6).toUpperCase()
    return hex
  }

  let width;
  let height;
  let drawingColor;
  let bgColor = "#ffffff";
  let N;
  let boxSize;
  let img;
  let px
  let py
  let mouseDown
  let sampling
  let filling
  let showGrid = false;

  const displayImage = (img) => {
    for (let i = 0; i < N; i++) {
      for(let j = 0; j < N; j++) {
        p5.fill(img[i][j])
        p5.stroke(img[i][j])
        p5.rect(j*boxSize, i*boxSize, boxSize, boxSize)
      }
    }
  }

  p5.updateWithProps = ({ width: w, height: h, defaultColor, selectedColor, size, callBackWord, addTile, image, setSelectedColor}) => {
    p5.setSelectedColor = setSelectedColor
    bgColor = defaultColor;
    if (selectedColor !== drawingColor) {
      drawingColor = selectedColor;
      filling = false
      sampling = false
    }
    if (image) {
      img = JSON.parse(JSON.stringify(image));
      displayImage(img)
      return
    }

    if (callBackWord === "CLEAR") {
      p5.setup()
      return
    } else if (callBackWord === "SAVE") {
      addTile(JSON.parse(JSON.stringify(img)))
      p5.setup()
      return
    } else if (callBackWord === "SAMPLE") {
      sampling = true
      filling = false
    } else if (callBackWord === "FILL") {
      filling = true
      sampling = false
    } else if (callBackWord === "GRID") {
      showGrid = !showGrid
      p5.background(bgColor)
      displayImage(img)
      return
    }

    if (w != width || h != height || size != N) {
      if (w) width = w;
      if (h) height = h;
      if (size) {
        N = size;
        boxSize = width / N;
      }
      p5.setup();
    }
  };

  const getX = (x) => {
    if (!x) x = p5.mouseX;
    if (x < 0) return -1;
    return p5.int(x / boxSize);
  };

  const getY = (y) => {
    if (!y) y = p5.mouseY;
    if (y < 0) return -1;
    return p5.int(y / boxSize);
  };

  const fillImg = (color) => {
    img = [];
    for (let i = 0; i < N; i++) {
      img.push([])
      for (let j = 0; j < N; j++) {
        img[i][j] = [p5.red(color), p5.green(color), p5.blue(color)]
      }
    }
  };

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.background(bgColor);
    fillImg(bgColor);
    px = 0
    py = 0
    mouseDown = false
    sampling = false
    filling = false
  };

  const showHover = () => { 
    p5.noStroke()
    p5.fill(img[py][px])
    // p5.stroke(img[py][px])
    p5.rect(px*boxSize, py*boxSize, boxSize, boxSize);
    p5.fill(drawingColor)
    // p5.stroke(drawingColor)
    p5.rect(getX()*boxSize, getY()*boxSize, boxSize, boxSize)
  };

  const inRange = (n, low, high) => {
    return (n >= low && n < high);
  }

  p5.mouseClicked = () => {
    if (!inRange(getX(), 0, N) || !inRange(getY(), 0, N)) return;
    if (sampling) {
      let color = img[getY()][getX()]
      p5.setSelectedColor(toHex(color))
      sampling = false
    } else if (filling) {
      fillImg(drawingColor)
      displayImage(img)
      filling = false
    }
  }

  p5.mousePressed = () => {
    if (sampling || filling) return
    mouseDown = true
  }

  p5.mouseReleased = () => {
    mouseDown = false
  }

  p5.draw = () => {
    if (showGrid)
    for (let i = 0; i <= N; i++) {
      p5.stroke(240)
      p5.line(i*boxSize, 0, i*boxSize, height)
      p5.line(0, i*boxSize, width, i*boxSize)
    }
    showHover()
    let x = getX()
    let y = getY()
    if (inRange(x, 0, N)) px = x
    if (inRange(y, 0, N)) py = y
    if (mouseDown && inRange(x, 0, N) && inRange(y, 0, N)) {
      img[y][x] = [p5.red(drawingColor), p5.green(drawingColor), p5.blue(drawingColor)]
      p5.fill(img[y][x])
      p5.rect(x*boxSize, y*boxSize, boxSize, boxSize)
    }

  };
};
