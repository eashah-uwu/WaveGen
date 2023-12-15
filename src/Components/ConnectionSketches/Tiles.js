import { Connection } from "./Connection";

export class Tile {
  constructor(name, tile, x, y, w) {
    this.img = tile.img;
    this.name = name;
    this.x = x;
    this.y = y;
    this.padding = w / 50;
    this.width = w - 2 * this.padding;
    this.realWidth = w;
    this.dragging = false;
    this.connections = [];
    for (let i = 0; i < 4; i++) {
      this.connections.push(new Connection(this, i));
    }
  }

  display = (p5) => {
    let dx = 0;
    let dy = 0;

    if (this.dragging) {
      p5.fill(p5.highlightColor);
      dx = p5.mouseX - p5.pmouseX;
      dy = p5.mouseY - p5.pmouseY;
    } else if (this.isHover(p5)) p5.fill(p5.hoverColor);
    else p5.fill(p5.outlineColor);

    displayImg(p5, this.img, this.x, this.y, this.width, this.padding);
    p5.hoveredFound = false;
    for (let i = 0; i < 4; i++) {
      this.connections[i].display(p5);
    }
    this.x += dx;
    this.y += dy;

    if (this.x < 0) this.x = 0;
    if (this.x + this.realWidth > p5.width) this.x = p5.width - this.realWidth;
    if (this.y < 0) this.y = 0;
    if (this.y + this.realWidth > p5.height) this.y = p5.height - this.realWidth;
  };

  isHover = (p5) => {
    let hover =
      p5.mouseX >= this.x &&
      p5.mouseX <= this.x + this.realWidth &&
      p5.mouseY >= this.y &&
      p5.mouseY <= this.y + this.realWidth;
    this.dragging = (hover || this.dragging) && p5.mPressed && !p5.draggingTile;
    if (this.dragging) p5.draggingTile = true;
    return hover;
  };
}

export const displayImg = (p5, img, x, y, width, padding) => {
  let sizeY = width / img.length;
  let sizeX = width / img[0].length;
  p5.noStroke();
  p5.rect(x, y, width + 2 * padding, width + 2 * padding);

  for (let Y = 0; Y < img.length; Y++) {
    for (let X = 0; X < img[Y].length; X++) {
      p5.fill(img[Y][X]);
      p5.rect(x + padding + X * sizeX, y + padding + Y * sizeY, sizeX, sizeY);
    }
  }
};

export const rotateImage = (img, orientation) => {
  const size = img.length;
  const buffer = [];
  if (orientation == 0) return img;
  else if (orientation == 1) {
    for (let i = 0; i < size; i++) {
      buffer.push([]);
      for (let j = 0; j < size; j++) {
        buffer[i].push(img[size - 1 - j][i]);
      }
    }
    return buffer;
  } else if (orientation == 2) {
    for (let i = 0; i < size; i++) {
      buffer.push([]);
      for (let j = 0; j < size; j++) {
        buffer[i].push(img[size - 1 - i][size - 1 - j]);
      }
    }
    return buffer;
  } else if (orientation == 3) {
    for (let i = 0; i < size; i++) {
      buffer.push([]);
      for (let j = 0; j < size; j++) {
        buffer[i].push(img[j][size - 1 - i]);
      }
    }
    return buffer;
  }
};
