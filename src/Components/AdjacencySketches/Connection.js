export class Connection {
  constructor(parent, direction) {
    this.parent = parent;
    this.direction = direction;
    this.showingConnections = false;
    this.size = this.parent.realWidth / 10;
    this.setCoords();
  }

  setCoords = () => {
    if (this.direction === 0) {
      this.x = this.parent.x + this.parent.realWidth / 2;
      this.y = this.parent.y - this.parent.realWidth / 6;
    }
    if (this.direction === 1) {
      this.x = this.parent.x + this.parent.realWidth + this.parent.realWidth / 6;
      this.y = this.parent.y + this.parent.realWidth / 2;
    }
    if (this.direction === 2) {
      this.x = this.parent.x + this.parent.realWidth / 2;
      this.y = this.parent.y + this.parent.realWidth + this.parent.realWidth / 6;
    }
    if (this.direction === 3) {
      this.x = this.parent.x - this.parent.realWidth / 6;
      this.y = this.parent.y + this.parent.realWidth / 2;
    }
  }

  display = (p5) => {
    this.setCoords()
    p5.stroke(p5.outlineColor);
    p5.strokeWeight(2);
    if (p5.selectedConnection === this || this.highlightingConnection) {
      p5.fill(p5.highlightColor);
      if (this.selfConnectionHighlight) {
        p5.stroke(p5.highlightColor);
        p5.fill(p5.highlightDarker);
      }
    }
    else if (this.isHover(p5) || this.showingConnections) {
      if (!p5.selectedConnection) {
        p5.fill(p5.hoverColor);
        if (this.selfConnectionHighlight) {
          p5.stroke(p5.hoverColor);
          p5.fill(p5.hoverDarker);
        }
      }
      else p5.fill(p5.highlightColor);
    } else p5.fill(p5.circleColor);
    p5.circle(this.x, this.y, this.size);
    p5.stroke(p5.outlineColor)
    this.showingConnections = false;
    this.highlightingConnection = false;
    this.selfConnectionHighlight = false;
  };

  isHover = (p5) => {
    let hover =
      p5.mouseX >= this.x - this.size / 2 &&
      p5.mouseX <= this.x + this.size / 2 &&
      p5.mouseY >= this.y - this.size / 2 &&
      p5.mouseY <= this.y + this.size / 2;
    if (hover) {
      p5.hoveredConnection = this;
    }
    return hover;
  };
}
