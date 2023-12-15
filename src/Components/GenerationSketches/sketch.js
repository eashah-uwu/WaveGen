import { rotateImage } from "../AdjacencySketches/Tiles";

export const sketch = (p5) => {
  let defaultCount = 100
  let Json
  let N
  let width
  let height

  let Entropies;
  let fixedEntropies;
  let timeStamps
  let defaultEntropy;

  let toPlace
  let placeOrientation
  let hovering = true;
  let pause = false
  let toRestart = false
  let recursion = true
  let animating = true
  let showUndo = false
  let animationSpeed = 0
  let speedUp = 1;
  let slowDown = 1;

  let drawStack;
  let undoStack = [];
  let stackPointer;

  let fillCount
  let updateCount

  let tileSize;
  let bgColor = "#0f0f0f"

  const resetStates = () => {
    initDefaultEntropy()
    initEntropies()
    placeOrientation = 0
    hovering = true
    pause = false
    toRestart = false
    stackPointer = 0
    drawStack = []
    fillCount = 0
    updateCount = 0
  }

  p5.updateWithProps = ({width: w, height: h, json, gridSize, animationSpeed: speed=0, callback, fixedTile=null}) => {
    console.log(json)
    if (toPlace !== fixedTile) placeOrientation = 0
    toPlace = fixedTile
    if (speed !== animationSpeed) {
      animationSpeed = speed
      if (animationSpeed < 0) {
        speedUp = 1
        slowDown = Math.pow(2, -animationSpeed/2)
      } else if (animationSpeed > 0) {
        slowDown = 1
        speedUp = Math.pow(2, animationSpeed/2)
      } else {
        speedUp = 1
        slowDown = 1
      }
      return
    }

    if (callback === "CLEAR") {
      p5.setup()
      return
    } else if (callback === "SAVE") {
      let name = prompt("Name your image:")
      if (name !== null && name !== '') p5.saveCanvas(name, 'png')
    } else if (callback === "ANIMATION") {
      animating = !animating
    } else if (callback === "BACKTRACKING") {
      showUndo = !showUndo
    } else if (callback === "PAUSE/PLAY") {
      pause = !pause
    } else if (callback === "RESTART") {
      displayGrid()
      stackPointer = 0
      toRestart = false
    } else if (callback === "END") {
      displayFinalImage()
      toRestart = true
      stackPointer = drawStack.length
    } else if (callback === "SKIP") {
      drawForward(speedUp*2)
    } else if (callback === "REWIND") {
      drawBackward(10)
    } else if (callback === "CLEAR FIXED") {
      fixedEntropies = undefined;
      initDefaultEntropy()
      initEntropies()
    }
    if (callback !== "NONE") return;

    if (Json !== json) {
      Json = json
      p5.setup()
    }


    if (width !== w || height !== h || gridSize !== N) {
      width = w
      height = h
      N = gridSize
      undoStack = []
      p5.setup()
    }
  }

  const showPlaced = () => {
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let img = getTileImg(x, y)
        if (img) displayTile(img, x, y, tileSize)
      }
    }
  }
  
  const drawForward = (n) => {
    if (drawStack.length === 0 || stackPointer === drawStack.length) return
    for (let i = 0; i < n; i++) {
      let stackItem = drawStack[stackPointer++]
      if (stackItem.tile.name === 'blankImage') displayBlank(stackItem.x, stackItem.y, tileSize)
      else displayTile(rotateImage(Json[stackItem.tile.name].img, stackItem.tile.orientation), stackItem.x, stackItem.y, tileSize)
      if (stackPointer >= drawStack.length) {
        stackPointer = drawStack.length
        toRestart = true
        // setTimeout(displayFinalImage, 200 )
        break;
      }
    }
  }
  
  const drawBackward = (n) => {
    if (stackPointer === 0) return
    toRestart = false
    for (let i = 0; i < n; i++) {
      let stackItem = drawStack[--stackPointer]
      displayBlank(stackItem.x, stackItem.y, tileSize)
      if (stackPointer < 0) {
        stackPointer = 0
        break;
      }
    }
  }

  p5.keyPressed = () => {
    if (p5.key === 'r') p5.setup()
    if (p5.key === 'z') {if (undoStack.length !== 0) undoAllChanges(undoStack.splice(-1, 1)[0])}
    if (p5.key === ' ') {pause = !pause; console.log(stackPointer, drawStack.length, stackPointer/drawStack.length * 100)}
    if (p5.key === 'ArrowRight') placeOrientation = mod((placeOrientation + 1), 4)
    if (p5.key === 'ArrowLeft') placeOrientation = mod((placeOrientation - 1), 4)
  }

  const deepCopy = (toCopy) => {
    return JSON.parse(JSON.stringify(toCopy))
  }
  
  const mod = (n, d) => {
    while (n < 0) n += d
    return n % d
  } 
  
  p5.setup = () => {
    p5.createCanvas(width, height);
    if (!Json) return

    resetStates()
    if (fixedEntropies !== undefined && undoStack.length !== 0){
      Entropies = deepCopy(fixedEntropies)
    }
    tileSize = width/N
    
    displayGrid()
    if (undoStack.length !== 0) showPlaced()
    promptUser()
  };

  const displayGrid = () => {
    p5.background(bgColor)
    p5.stroke(10)
    for (let i = 0; i <= N; i++) {
      p5.line(i*tileSize, 0, i*tileSize, height)
      p5.line(0, i*tileSize, width, i*tileSize)
    }
  }

  const displayFinalImage = () => {
    console.log("FINAL IMAGE")
    p5.textSize(tileSize/5)
    p5.textAlign(p5.CENTER, p5.CENTER)
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let img = getTileImg(x, y)
        if (img) displayTile(img, x, y, tileSize)
        else {
          p5.fill("#1f1f1f")
          p5.rect(x*tileSize, y*tileSize, tileSize, tileSize)
          p5.fill(255)
          p5.text(Entropies[y][x].length, (x+0.5)*tileSize, (y+0.5)*tileSize)
        }
      }
    }
    hovering = false
    toRestart = true
  }

  const getTileImg = (x, y) => {
    let tiles = Entropies[y][x]
    if (!tiles) return;
    if (tiles.length !== 1) return undefined;
    let tile = tiles[0]
    let img = rotateImage(Json[tile.name].img, tile.orientation)
    return img
  }
  
  const displayTile = (img, x, y, size) => {
    const stepY = size/img.length
    const stepX = size/img[0].length
    
    for (let Y = 0; Y < img.length; Y++) {
      for (let X = 0; X < img[Y].length; X++) {
        p5.fill(img[Y][X])
        p5.stroke(img[Y][X])
        p5.rect(x*tileSize + X * stepX, y*tileSize + Y * stepY, stepX, stepY)
      }
    }
    
    p5.stroke(0)
  }

  const displayBlank = (x, y, size) => {
    p5.fill(bgColor)
    p5.stroke(0)
    p5.rect(x*tileSize, y*tileSize, size, size)
  } 

  const getMatches = (tileName, orientation) => {
    return Json[tileName].matches[orientation]
  }

  const isSameTile = (tile1, tile2) => {
    return (tile1.name === tile2.name && tile1.orientation === tile2.orientation)
  }

  const inRange = (i, low, high) => {
    return (i >= low && i < high)
  }
  
  const getX = (x) => {
    if (x === undefined) x = p5.mouseX
    if (x < 0) return -1
    return p5.int(x/tileSize)
  }
  
  const getY = (y) => {
    if (y === undefined) y = p5.mouseY
    if (y < 0) return -1
    return p5.int(y/tileSize)
  }

  const initDefaultEntropy = () => {
    defaultEntropy = []
    let names = Object.keys(Json)
    for (let i = 0; i < names.length; i++) {
      let tileName = names[i]
      if (p5.int(Json[tileName].bias * defaultCount) <= 0) continue
      for (let o = 0; o < 4; o++) {
        defaultEntropy.push({"name": tileName, "orientation": o})
      }
    }
  }
  
  const initEntropies = () => {
    Entropies = []
    timeStamps = []
    for (let i = 0; i < N; i++) {
      Entropies.push([])
      timeStamps.push([])
      for (let j = 0; j < N; j++) {
        Entropies[i].push(deepCopy(defaultEntropy))
        timeStamps[i].push(0)
      }
    }
  }

  const getBiasedIndex = (entropies) => {

    const toSubtract = []
    let totalBias = 0
    
    for (let i = 0; i < entropies.length; i++) {
      let tile = entropies[i]
      let bias = Json[tile.name].bias
      let count = p5.int(defaultCount * bias)
      totalBias += count
      toSubtract.push(count)
    }
    
    let landingNum = p5.random()*totalBias
    let i = 0
    while (landingNum > toSubtract[i]) {
      landingNum -= toSubtract[i++]
    }  
    return i
  }

  const getLeastEntropyCell = () => {
    let toReturn = []
    let leastEntropy = defaultEntropy.length
    
    let mostRecentIndex = 0
    let recentTimeStamp = 0

    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let entropy = Entropies[y][x]
        if (entropy.length === leastEntropy) {
          if (timeStamps[y][x] > recentTimeStamp) {
            recentTimeStamp = timeStamps[y][x]
            mostRecentIndex = toReturn.length
          }
          toReturn.push([x, y])
        }
        else if (entropy.length < leastEntropy && entropy.length !== 1) {
          recentTimeStamp = 0
          mostRecentIndex = 0
          toReturn = [[x, y]]
          leastEntropy = entropy.length
        }
      }
    }


    if (toReturn.length === 0) return [-1, -1]
    else return toReturn[mostRecentIndex]
  }

  const promptUser = () => {
    if (drawStack.length !== 0 || (!animating && toRestart) || !Json) return
    if (N >= 25) p5.fill(255, 0, 0, 35)
    else p5.fill(0, 50)
    p5.rect(0, 0, p5.width, p5.height)
    let text = "Click A Cell to Start Generation"
    if (N >= 25) text += "\nFinding Image may take a while and leave the page unresponsive"
    p5.fill(255, 50)
    p5.noStroke()
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.textSize(20)
    p5.text(text, p5.width/2, p5.height/2)
  }

  p5.draw = () => {
    if (p5.millis() <= 2000) return

    if (hovering && drawStack.length === 0) {  
      let px = getX(p5.pmouseX)
      let py = getY(p5.pmouseY)
      if (!inRange(px, 0, N) || !inRange(py, 0, N)) return
      if (Entropies[py][px].length === 1) displayTile(getTileImg(px, py), px, py, tileSize)
      else displayBlank(px, py, tileSize)
      if (toPlace !== null) {
        displayTile(rotateImage(Json[toPlace].img, placeOrientation), getX(), getY(), tileSize)
      } else {
        p5.noFill()
        p5.stroke(255)
        p5.rect(getX()*tileSize, getY()*tileSize, tileSize, tileSize)
      }
    }

    if (pause) return
  
    if (p5.frameCount % Math.ceil(slowDown) === 0 && !toRestart && drawStack.length > 0) {
      drawForward(speedUp)
    }

  }

  const imageNotFound = () => {
    hovering = false
    p5.background(0);
    p5.fill(255)
    p5.textSize(35)
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.text("NO IMAGE FOUND", width/2, height/2)
    console.log("NO IMAGE FOUND")
    toRestart = false
  }

  let started = false

  p5.mouseClicked = () => {
  
    let [x, y] = [getX(), getY()]
    
    if (!inRange(x, 0, N) || !inRange(y, 0, N) || p5.millis() <= 100) return

    if (toRestart) {
      toRestart = false
      let toRecover = toPlace
      p5.setup()
      toPlace = toRecover
    }

    console.log("CLICKED", x, y)
    if (toPlace !== null && stackPointer === 0) {
      const {status, allChanges} = updateEntropy(x, y, {name: toPlace, orientation: placeOrientation}, true)
      if (!status) undoAllChanges(allChanges)
      else {
        displayTile(getTileImg(x, y), x, y, tileSize)
        undoStack.push(allChanges)
        console.log(undoStack)
      }
      return
    }

    if (started || stackPointer !== 0) return;
    started = true
    fixedEntropies = deepCopy(Entropies)
    displayGrid()
    showPlaced()
    let startTime = p5.millis()  
    let found = fillNext([x, y])
    started = false
    let endTime = p5.millis()
    console.log("FILLED", fillCount)
    console.log("ENDED IN", endTime-startTime, startTime, endTime)
    console.log("UPDATES MADE", updateCount, drawStack.length)
    if (!found) {
      drawStack = []
      imageNotFound()
    }  
    else if (!animating) displayFinalImage()
  }

  const fillNext = (coords) => {
    if (!coords) coords = getLeastEntropyCell()
    let [x, y] = coords
    
    if (x === -1 || y === -1) return true

    let foundTile = false
    while (Entropies[y][x].length > 0 && !foundTile) {
      foundTile = fillCell(x, y, getBiasedIndex(Entropies[y][x]))
    }

    return foundTile
  } 

  const fillCell = (x, y, i) => {
    const tile = deepCopy(Entropies[y][x][i])
    const {status, allChanges} = updateEntropy(x, y, tile)
    
    if (!status) {
      undoAllChanges(allChanges)
      removeTileFromEntropy(x, y, tile)
      return false
    }
    
    if (!recursion) return true
    
    const foundTile = fillNext()
    if (!foundTile) {
      undoAllChanges(allChanges)
      removeTileFromEntropy(x, y, tile)
      return false
    }
    return true  
  }
  
  const updateEntropy = (x, y, tile, checking) => {
    const changes = [{x, y, change: storeEntropy(x, y)}]
    if (checking) {
      Entropies[y][x] = Entropies[y][x].filter(tileObject => isSameTile(tile, tileObject))
      if (Entropies[y][x].length === 0) return {status: false, allChanges: changes}
    } else Entropies[y][x] = [tile]
    fillCount++
    if (animating && started) drawStack.push({tile, x, y})
    else if (!started) displayTile(getTileImg(x, y), x, y, tileSize)
    for (let i = 0; i < 4; i++) {
      //add cascaded changes if made
      const {status, allChanges} = updateNeighbor(x, y, tile, i)
      changes.push(...allChanges)
      if (!status) return {status: false, allChanges: changes}
    }
    //return all changes made by adding current tile, along with status of inserting tile
    return {status: true, allChanges: changes}
  }
  
  const updateNeighbor = (x, y, tileObject, direction) => {

    let dy = direction === 0 || direction === 2 ? direction === 0 ? -1 : 1 : 0
    let dx = direction === 1 || direction === 3 ? direction === 3 ? -1 : 1 : 0
    
    if (!inRange(x+dx, 0, N) || !inRange(y+dy, 0, N)) return {status: true, allChanges: []}
    if (Entropies[y+dy][x+dx].length === 1) return {status: true, allChanges: []}
    
    const oldEntropy = deepCopy(Entropies[y+dy][x+dx])
    const matches = getMatches(tileObject.name, mod(direction - tileObject.orientation, 4)) //adjacencies if tile upright
    
    const newEntropy = []
    for (let i = 0; i < oldEntropy.length; i++) {
      let tile = oldEntropy[i]
      if (!matches[tile.name]) continue
      let orientationsToCheck = matches[tile.name]
      for (let o = 0; o < orientationsToCheck.length; o++) {
        if (tile.orientation === mod(orientationsToCheck[o]+tileObject.orientation, 4)) 
          newEntropy.push(tile)
      }
    }
    
    Entropies[y+dy][x+dx] = newEntropy
    
    if (Entropies[y+dy][x+dx].length === 1) {
      const tile = Entropies[y+dy][x+dx][0]
      return updateEntropy(x+dx, y+dy, tile)
    }
    else timeStamps[y+dy][x+dx] = ++updateCount
    return  {status: Entropies[y+dy][x+dx].length !== 0, allChanges: []}
  }
  
  const storeEntropy = (x, y) => {
    
    const toReturn = [deepCopy(Entropies[y][x])]
    for (let direction = 0; direction < 4; direction++){
      let dy = direction === 0 || direction === 2 ? direction === 0 ? -1 : 1 : 0
      let dx = direction === 1 || direction === 3 ? direction === 3 ? -1 : 1 : 0
      
      if (!inRange(x+dx, 0, N) || !inRange(y+dy, 0, N)) toReturn.push(undefined)
      else toReturn.push(deepCopy(Entropies[y+dy][x+dx]))
    }
    
    return toReturn
  }

  const undoAllChanges = (changes) => {
    while (changes.length > 0) {
      const {x, y, change} = changes.splice(-1, 1)[0]
      undoEntropy(change, x, y)
    }
  }
  
  const undoEntropy = (changes, x, y) => {
    fillCount--
    Entropies[y][x] = changes.splice(0, 1)[0]
    if (animating && started) {
      if (showUndo) drawStack.push({tile: {name: 'blankImage', orientation: 0}, x, y})
      else drawStack.splice(drawStack.length-1, 1)  
    }else {
      displayBlank(x, y, tileSize)
    }
    
    for (let direction = 0; direction < 4; direction++){
      let dy = direction === 0 || direction === 2 ? direction === 0 ? -1 : 1 : 0
      let dx = direction === 1 || direction === 3 ? direction === 3 ? -1 : 1 : 0
      
      if (inRange(x+dx, 0, N) && inRange(y+dy, 0, N))
        Entropies[y+dy][x+dx] = changes[direction]
    }
  }

  const removeTileFromEntropy = (x, y, toRemove) => {
    Entropies[y][x].splice(Entropies[y][x].findIndex(tile => isSameTile(tile, toRemove)), 1)
  }
};
