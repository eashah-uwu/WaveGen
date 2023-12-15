export const sketch = (p5) => {
  p5.mPressed = false;
  p5.draggingTile = false;

  let width = 400;
  let height = 400;

  p5.connectionLineColor = "#3a3a3a";
  p5.circleColor = "#474747";
  p5.highlightColor = "#f53b2a";
  p5.highlightDarker = "#9c1b10"
  p5.hoverDarker = "#0d3fbd"
  p5.hoverColor = "#20a5f7";
  p5.outlineColor = "#ffffff"

  let tiles = [];

  p5.updateWithProps = ({ size, w, h, Tiles, connections, update, hoverConnection, bgColor }) => {
    if ((w || h) && (h !== height || w !== width)) {
      if (h) height = h;
      if (w) width = w;
      p5.setup()
    } else if (size && (width !== size || height !== size)) {
      width = size;
      height = size;
      p5.setup()
    }
    tiles = Tiles;
    p5.connections = connections;
    p5.setConnection = update;
    p5.hoverConnection = hoverConnection;
    p5.bg = bgColor

  };
  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.mousePressed = () => {
    if (p5.mouseButton === p5.RIGHT) {
      if (!p5.selectedConnection) p5.selectedConnection = p5.lastConnection
      else p5.selectedConnection = null
      let hovering = p5.hoveredConnection && p5.hoveredConnection.isHover(p5);
      if (hovering && p5.selectedConnection) {
        p5.setConnection([p5.selectedConnection, p5.hoveredConnection]);
        p5.lastConnection = p5.selectedConnection;
        p5.hoveredConnection = null;
        p5.selectedConnection = null;
      }
    }
    p5.mPressed = true;
  };

  p5.mouseReleased = () => {
    p5.mPressed = false;
    releaseTiles();
  };

  p5.mouseClicked = () => {
    let hovering = p5.hoveredConnection && p5.hoveredConnection.isHover(p5);
    if (p5.hoveredConnection) {
      if (hovering) {
        if (p5.selectedConnection) {
          p5.setConnection([p5.selectedConnection, p5.hoveredConnection]);
          p5.lastConnection = p5.selectedConnection;
          p5.hoveredConnection = null;
          p5.selectedConnection = null;
        } else {
          p5.selectedConnection = p5.hoveredConnection;
          p5.lastConnection = p5.selectedConnection;
        }
      } else {
        p5.hoveredConnection = null;
        p5.selectedConnection = null;
      }
    } else {
      p5.hoveredConnection = null;
      p5.selectedConnection = null;
    }
  };

  const displayConnections = (connections) => {
    let highlighting = true;
    if (!connections) {
      connections = p5.connections;
      highlighting = false;
    }
    if (highlighting) {
      p5.stroke(p5.hoverColor);
      p5.strokeWeight(4);
    }
    else {
      p5.stroke(p5.connectionLineColor);
      p5.strokeWeight(1);
    }
    for (let i = 0; i < connections.length; i++) {
      if (highlighting) {
        connections[i][0].showingConnections = true;
        connections[i][1].showingConnections = true;
        if (connections[i][0] === connections[i][1]) connections[i][0].selfConnectionHighlight = true
      }
      displayConnection(connections[i]);
    }
    p5.strokeWeight(1);
  };

  const displayConnection = (connection) => {
    p5.line(connection[0].x, connection[0].y, connection[1].x, connection[1].y);
  };

  const displayTiles = () => {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].display(p5);
    }
  };

  const releaseTiles = () => {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].dragging = false;
      p5.draggingTile = false;
    }
  };

  const getConnections = (connection) => {
    const toReturn = [];
    for (let i = 0; i < p5.connections.length; i++) {
      if (
        connection === p5.connections[i][0] ||
        connection === p5.connections[i][1]
      )
        toReturn.push(p5.connections[i]);
    }
    return toReturn;
  };

  p5.draw = () => {
    p5.background(p5.bg);
    displayConnections();
    if (p5.selectedConnection) {
      p5.stroke(p5.highlightColor);
      p5.strokeWeight(2);
      p5.line(
        p5.selectedConnection.x,
        p5.selectedConnection.y,
        p5.mouseX,
        p5.mouseY
      );
      p5.strokeWeight(1);
    }
    if (
      !p5.selectedConnection &&
      p5.hoveredConnection &&
      p5.hoveredConnection.isHover(p5)
    )
    displayConnections(getConnections(p5.hoveredConnection));
    if (p5.hoverConnection !== null && p5.hoverConnection !== undefined && p5.connections.length !== 0) {
      p5.stroke(p5.highlightColor);
      p5.strokeWeight(4);
      let hoveredConnection = p5.hoverConnection
      hoveredConnection[0].highlightingConnection = true;
      hoveredConnection[1].highlightingConnection = true;
      if (hoveredConnection[0] === hoveredConnection[1]) hoveredConnection[0].selfConnectionHighlight = true;
      displayConnection(hoveredConnection);
      p5.strokeWeight(1);
    }
    displayTiles();
  };
};
