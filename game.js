// State of the game
let boxPerColumn = +document.querySelector('#box-size').value
const canvasDivWidth = document.querySelector('#canvas')
let unitLength = canvasDivWidth.offsetWidth / boxPerColumn /* width and height of a box */
let boxColor = document.querySelector('#box-color').value /* color of the box */
let canvasColor = document.querySelector('#canvas-color').value
let strokeColor = document.querySelector('#stroke-color').value /* color of the stroke of the box */
let columns; /* number of columns in our game of life */
let rows; /* number of rows in our game of life */
let currentBoard; /* the states of the board of the current generation */
let nextBoard; /* the states of the board of the next generation */

// Update the FPS display value based on slider value
const fpsSlider = document.querySelector('#fps-slider')
const fpsOutput = document.querySelector('#fps-output')
fpsOutput.innerText = fpsSlider.value

// Update the fps variable that canvas is using
let fps = +fpsSlider.value

fpsSlider.addEventListener('input', () => {
    // Retrieve fps value from slider
    fps = +fpsSlider.value

    // Update slider display value
    fpsOutput.innerText = fps

    // Update frameRate for canvas
    frameRate(fps)

    // console.log("FPS: ", fps)
})

// Box per row changer
const boxSizeSlider = document.querySelector('#box-size')
const boxSizeOutput = document.querySelector('#box-size-output')
boxSizeOutput.innerText = boxSizeSlider.value

function resizeBox() {
    // Retrieve box size value from slider
    boxPerColumn = +boxSizeSlider.value

    // Update slider display value
    boxSizeOutput.innerText = boxPerColumn

    clear()
    unitLength = Math.floor(canvasDivWidth.offsetWidth / boxPerColumn)
    const oldCols = columns
    const oldRows = rows
    calRowAndCols()

    // Resize array 
    let newCurrentBoard = []
    let newNextBoard = []
    for (let i = 0; i < columns; i++) {
        newCurrentBoard[i] = []
        newNextBoard[i] = []

    }
    // console.log("rows :", rows)
    // console.log("columns :", columns)
    // console.log("new current board: ", newCurrentBoard)

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            newCurrentBoard[i][j] = {}

            if (i < oldCols && j < oldRows) {
                newCurrentBoard[i][j].alive = currentBoard[i][j].alive
                newCurrentBoard[i][j].neighbors = currentBoard[i][j].neighbors
                newCurrentBoard[i][j].rounds = currentBoard[i][j].rounds
            } else {
                // Random state for new boxes
                newCurrentBoard[i][j].alive = random() > 0.8 ? true : false;
            }
            newNextBoard[i][j] = {
                alive: false,
                neighbors: 0,
                rounds: 0,
            };

        }
    }
    // Swap the currentBoard to be resized board
    currentBoard = newCurrentBoard
    nextBoard = newNextBoard
    resizeCanvas(columns * unitLength, rows * unitLength)


}



boxSizeSlider.addEventListener('input', resizeBox)

// Select DOM elements
const rainbowColorButton = document.querySelector('#rainbow-color-button')
const strokeButton = document.querySelector('#no-stroke-button')
const randomColorButton = document.querySelector('#random-color-button')
const invertColorButton = document.querySelector('#invert-color-button')
const randomGenerateButton = document.querySelector('#random-generate')
const neighborButton = document.querySelector('#neighbor-color-button')
const stableLifeButton = document.querySelector('#stable-color-button')
const randomBoxColorButton = document.querySelector('#random-box-color')
const randomCanvasColorButton = document.querySelector('#random-canvas-color')
const randomStrokeColorButton = document.querySelector('#random-stroke-color')
let canvasElement
let canvas
const circleButton = document.querySelector('#circle-button')
const nextButton = document.querySelector('#next')
const inputButton = document.querySelector('#input-button')
let canvasHeight

function calCanvasHeight() {

    if (((windowHeight - document.querySelector('.game-control').clientHeight - document.querySelector('.container-fluid').clientHeight)) < windowHeight * 0.65) {
        canvasHeight = windowHeight * 0.65
        // console.log('Using fixed height')
    } else {
        canvasHeight = windowHeight - document.querySelector('.game-control').clientHeight - document.querySelector('.container-fluid').clientHeight
        // console.log('using max height')
    }
}

// Run only once
function setup() {
    // Canvas height = window height - top bar - game control

    calCanvasHeight()

    canvas = createCanvas(canvasDivWidth.offsetWidth, canvasHeight)
    canvas.parent(document.querySelector('#canvas'))

    // console.log("canvas Div width: ", canvasDivWidth.offsetWidth)

    /*Calculate the number of columns and rows */
    calRowAndCols()


    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = []
    nextBoard = []
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = []
        nextBoard[i] = []
    }

    // console.log("Initial columns: ", columns)
    // console.log("Initial rows: ", rows)

    frameRate(fps)

    init()
    resizeCanvas(columns * unitLength, rows * unitLength)

    // For using addClass and removeClass method from p5 on changing canvas background
    canvasElement = select('#defaultCanvas0').elt

    // console.log("set up canvas: width = ", windowWidth, " height = ", windowHeight)

}

function windowResized() {
    unitLength = (canvasDivWidth.offsetWidth / boxPerColumn)
    // Number of columns unchanged while unit length decreases, (each box size scales down)
    // console.log("canvas width", canvasDivWidth.offsetWidth)
    // console.log("unit length: ", unitLength)
    // As window size is not a square shape, number of rows change when window is resized in a non-proportional ratio

    calCanvasHeight()
    const newRows = Math.floor(canvasHeight / unitLength)
    for (let i = 0; i < columns; i++) {
        for (let j = rows; j < newRows; j++) {
            currentBoard[i][j] = {
                alive: false,
                neighbors: 0,
                rounds: 0,
            };
            nextBoard[i][j] = {
                alive: false,
                neighbors: 0,
                rounds: 0,
            };

            // For random state
            currentBoard[i][j].alive = random() > 0.8 ? true : false;

        }
    }
    rows = newRows
    resizeCanvas(columns * unitLength, rows * unitLength);
}

const gameButton = document.querySelector('#joystick-button')
const scoreDisplay = document.querySelector('#score-display')
const score = document.querySelector('#score')
// const starButton = document.querySelector('#star-button')

// Run once per frame
function draw() {

    generate();
    clear()
    background(color(0, 0, 0, 0))


    const colorInvertActive = invertColorButton.classList.contains('active')
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (!colorInvertActive) { // color invert not active
                if (currentBoard[i][j].alive) {
                    if (rainbowColorButton.classList.contains('active') && randomColorButton.classList.contains('active')) {
                        let fillColor = (Math.random() >= 0.5) ? color(0, 0, 0, 0) : randColor() // Decide whether box is filled by rainbow or random color


                        fill(fillColor)
                    } else if (rainbowColorButton.classList.contains('active')) {

                        console.log('rainbow box should display')
                        fill(color(0, 0, 0, 0))
                    } else if (randomColorButton.classList.contains('active')) {
                        const randomColor = randColor()
                        fill(randomColor)
                        boxColorSelector.value = randomColor
                    } else {
                        // Neighbors === 3 will have darker color
                        if (neighborButton.classList.contains('active')) {
                            if (currentBoard[i][j].neighbors === 3) {
                                const darkerColor = hexToRGBA(boxColor) + ',0.9)'

                                fill(darkerColor)

                            } else {
                                const lighterColor = hexToRGBA(boxColor) + ',0.3)'
                                fill(lighterColor)
                            }
                        } else if (stableLifeButton.classList.contains('active')) {
                            let rgbaColor
                            if (currentBoard[i][j].rounds === 1) {
                                rgbaColor = hexToRGBA(boxColor) + ',0.3)' // 30% opacity
                            } else if (currentBoard[i][j].rounds === 2) {
                                rgbaColor = hexToRGBA(boxColor) + ',0.6)' // 60% opacity
                            } else if (currentBoard[i][j].rounds === 3) {
                                rgbaColor = hexToRGBA(boxColor) + ',0.8)' // 75% opacity
                            } else {
                                rgbaColor = hexToRGBA(boxColor) + ',1)' // 100% opacity
                            }

                            fill(rgbaColor)
                        } else {
                            fill(boxColor)
                        }

                    }
                } else {
                    fill(canvasColor);
                }
            } else { // Invert is active
                if (!currentBoard[i][j].alive) {
                    if (rainbowColorButton.classList.contains('active') && randomColorButton.classList.contains('active')) {
                        let fillColor = (Math.random() >= 0.5) ? color(0, 0, 0, 0) : randColor()
                        fill(fillColor)
                    } else if (rainbowColorButton.classList.contains('active')) {
                        fill(color(0, 0, 0, 0))
                    } else if (randomColorButton.classList.contains('active')) {
                        const randomColor = randColor()
                        fill(randomColor)
                        canvasColorSelector.value = randomColor
                        boxColorSelector.value = canvasColor

                    } else {
                        // Neighbors === 3 will have darker color

                        if (neighborButton.classList.contains('active')) {
                            if (currentBoard[i][j].neighbors === 3) {
                                const darkerColor = hexToRGBA(boxColor) + ',0.3)'

                                fill(darkerColor)

                            } else {
                                const lighterColor = hexToRGBA(boxColor) + ',0.9)'
                                fill(lighterColor)
                            }
                        } else {
                            fill(boxColor)
                        }
                    }
                } else {
                    fill(canvasColor);
                }

            }
            if (!strokeButton.classList.contains('no-stroke-active')) {
                stroke(strokeColor)
            } else {
                stroke(color(0, 0, 0, 0))
            }
            if (circleButton.classList.contains('active')) {
                rect(i * unitLength, j * unitLength, unitLength, unitLength, unitLength);
            }
            // else if (starButton.classList.contains('active')) {
            //     let boxImg

            //     function preload() {
            //         boxImg = loadImage('media/rubik-color.png')
            //     }
            //     preload()

            //     function setup() {
            //         image(boxImg, i * unitLength, j * unitLength, unitLength, unitLength)
            //     }
            //     setup()
            // } 
            else {
                rect(i * unitLength, j * unitLength, unitLength, unitLength)
            }
        }
    }

    if (randomColorButton.classList.contains('active')) {
        randomColorButton.style.backgroundColor = randColor()
    } else {
        randomColorButton.style.backgroundColor = 'white';
    }

    // Count score
    // cells living more rounds will give more scores
    let currentScore = 0
    if (gameButton.classList.contains('active')) {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                if (currentBoard[i][j].rounds === 2) {
                    currentScore += 2
                } else if (currentBoard[i][j].rounds >= 3)
                    currentScore += 4
            }
        }
        score.innerText = currentScore

    }
}

// Initialize/reset the board state
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            // currentBoard[i][j] = 0;
            // nextBoard[i][j] = 0;

            currentBoard[i][j] = {
                alive: false,
                neighbors: 0,
                rounds: 0,
            }

            nextBoard[i][j] = {
                alive: false,
                neighbors: 0,
                rounds: 0,
            }

            // For random state
            currentBoard[i][j].alive = random() > 0.8 ? true : false;

        }
    }

    // Reset color displaying in the selectors
    boxColorSelector.value = '#969696'
    canvasColorSelector.value = '#ffffff'
    strokeColorSelector.value = '#323232'
    boxColor = boxColorSelector.value
    canvasColor = canvasColorSelector.value
    strokeColor = strokeColorSelector.value

    // Reset button effects
    rainbowColorButton.classList.remove('active')
    strokeButton.classList.remove('no-stroke-active')
    strokeButton.innerText = "Box Stroke On"
    randomColorButton.classList.remove('active')
    invertColorButton.classList.remove('active')
    invertColorButton.classList.remove('invert-on')
    neighborButton.classList.remove('active')
    stableLifeButton.classList.remove('active')
    circleButton.classList.remove('active')
}

// Core business logic of game of life
function generate() {
    // Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the neighborhood (8 surrounding boxes)
            currentBoard[x][y].neighbors = 0
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i === 0 && j === 0) {
                        // the cell itself is not its own neighbor 
                        continue
                    }
                    // The modulo operator is crucial for wrapping edge elements
                    if (currentBoard[(x + i + columns) % columns][(y + j + rows) % rows].alive) { // + column and + rows are used to prevent negative index  
                        currentBoard[x][y].neighbors++
                    }
                }
            }

            // Rules of Life
            if (currentBoard[x][y].alive && currentBoard[x][y].neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y].alive = false;
                nextBoard[x][y].rounds = 0
            } else if (currentBoard[x][y].alive && currentBoard[x][y].neighbors > 3) {
                // Die of Overpopulation
                nextBoard[x][y].alive = false;
                nextBoard[x][y].rounds = 0
            } else if (!currentBoard[x][y].alive && currentBoard[x][y].neighbors === 3) {
                // New Life due to Reproduction
                nextBoard[x][y].alive = true
                nextBoard[x][y].rounds = 1
            } else {
                // No change
                nextBoard[x][y].alive = currentBoard[x][y].alive

                if (currentBoard[x][y].alive) {
                    nextBoard[x][y].rounds += 1
                } else {
                    nextBoard[x][y].rounds = 0
                }

            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard]

}

// When keyboard is used to select boxes
let key_x = 0
let key_y = 0
let prev_x
let prev_y

// When mouse is dragged
function mouseDragged() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || inputButton.classList.contains('keyboard-active') || mouseY < 0) {
        console.log("RETURNED mouseX: ", mouseX, "mouseY: ", mouseY)
        return
    }
    console.log("NOT RETURNED mouseX: ", mouseX, "mouseY: ", mouseY)
    const x = Math.floor(mouseX / unitLength)
    const y = Math.floor(mouseY / unitLength)
    currentBoard[x][y].alive = true

    if (rainbowColorButton.classList.contains('active')) {
        d
        fill(color(0, 0, 0, 0))
    } else if (randomColorButton.classList.contains('active')) {
        fill(randColor())
    } else {
        fill(boxColor)
    }
    stroke(strokeColor)


    if (circleButton.classList.contains('active')) {
        rect(x * unitLength, y * unitLength, unitLength, unitLength, unitLength);
    } else {
        rect(x * unitLength, y * unitLength, unitLength, unitLength)
    }
}

// When mouse is pressed
function mousePressed() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        console.log("RETURNED mouseX: ", mouseX, "mouseY: ", mouseY)
        return
    }

    if (inputButton.classList.contains('keyboard-active')) {
        noLoop()
        const x = Math.floor(mouseX / unitLength)
        const y = Math.floor(mouseY / unitLength)

        key_x = x
        key_y = y

        // console.log("x: ", x, "y: ", y)

        // highlight selected cells
        if (rainbowColorButton.classList.contains('active')) {
            fill(color(0, 0, 0, 0))

        } else if (randomColorButton.classList.contains('active')) {
            fill(randColor())
        } else {
            fill(boxColor)
            // console.log('fill')
        }
        stroke(strokeColor)
        if (circleButton.classList.contains('active')) {
            rect(x * unitLength, y * unitLength, unitLength, unitLength, unitLength);
        } else {
            rect(x * unitLength, y * unitLength, unitLength, unitLength)
            // console.log('draw')
        }


        if (prev_x !== null && prev_y !== null) {
            fill(canvasColor)
            rect(prev_x * unitLength, prev_y * unitLength, unitLength, unitLength)
        }

        prev_x = key_x
        prev_y = key_y

        return
    }
    // console.log("mouseX: ", mouseX)
    // console.log("mouseY: ", mouseY)
    noLoop()
    mouseDragged()
}

// When mouse is released
function mouseReleased() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || inputButton.classList.contains('keyboard-active')) {
        return
    }
    loop()
}

function keyTyped() {
    // if key is not WASD or Enter, ignore
    if ((key <= 37 || key >= 40) && key !== 30 && key !== 'p' || !inputButton.classList.contains('keyboard-active')) { // 37 is 'a' and 40 is 's'
        return
    }

    // Detect Enter pressed twice
    if (key === 'p') {
        loop()
        inputButton.firstElementChild.innerHTML = '<i class="bi bi-mouse"></i>'
        inputButton.classList.remove('keyboard-active')
        return
    }

    switch (key) {
        case 'a': // Left
            key_x--
            break
        case 'w': // Up
            key_y--
            break
        case 'd': // Right
            key_x++
            break
        case 's': // Down
            key_y++
            break
    }

    console.log("x: ", key_x, " y: ", key_y)

    // Prevent the selected index from out of scope
    if (key_x < 0) {
        key_x = columns - 1
    }
    if (key_y < 0) {
        key_y = rows - 1
    }
    if (key_x > columns) {
        key_x = 0
    }
    if (key_y > rows) {
        key_y = 0
    }

    // highlight selected cells
    if (rainbowColorButton.classList.contains('active')) {
        fill(color(255, 255, 255, 0.1))
    } else if (randomColorButton.classList.contains('active')) {
        fill(randColor())
    } else {
        fill(boxColor)
    }
    stroke(strokeColor)

    if (circleButton.classList.contains('active')) {
        rect(key_x * unitLength, key_y * unitLength, unitLength, unitLength, unitLength);
    } else {
        rect(key_x * unitLength, key_y * unitLength, unitLength, unitLength)
    }

    if (key === 'Enter') {
        if (!currentBoard[key_x][key_y].alive) {
            currentBoard[key_x][key_y].alive = true
        } else {
            currentBoard[key_x][key_y].alive = false
        }
    }
    if (!currentBoard[prev_x][prev_y].alive) {
        fill(canvasColor)
        rect(prev_x * unitLength, prev_y * unitLength, unitLength, unitLength)
    }
    prev_x = key_x
    prev_y = key_y

}
// Reset button
document.querySelector('#reset-game').addEventListener('click', () => init())

// Pause button
document.querySelector('#pause').addEventListener('click', () => noLoop())

// Start button
document.querySelector('#start').addEventListener('click', () => {
    if (inputButton.classList.contains('keyboard-active')) {
        inputButton.firstElementChild.innerHTML = '<i class="bi bi-mouse"></i>'
        inputButton.classList.remove('keyboard-active')
    }
    loop()
})

// Next button
nextButton.addEventListener('click', () => {

    draw()
    noLoop()
})

// Change box color 
const boxColorSelector = document.querySelector('#box-color')
boxColor = boxColorSelector.value



// console.log("Initial box color: ", boxColor)
boxColorSelector.addEventListener('change', () => {
    boxColor = boxColorSelector.value
    // console.log("New box Color: ", boxColor)
})

// Change canvas color
const canvasColorSelector = document.querySelector('#canvas-color')
canvasColor = canvasColorSelector.value
canvasColorSelector.addEventListener('change', () => {
    canvasColor = canvasColorSelector.value
})

// Change stroke color
const strokeColorSelector = document.querySelector('#stroke-color')
strokeColor = strokeColorSelector.value
strokeColorSelector.addEventListener('change', () => {
    strokeColor = strokeColorSelector.value
})




// Set up random color button
const randColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

// console.log("random color: ", randColor());

// console.log("box color: ", boxColor)

// Function to recalculate rows and columns based on current window width
function calRowAndCols() {
    calCanvasHeight()

    columns = floor(canvasDivWidth.offsetWidth / unitLength)
    rows = floor(canvasHeight / unitLength)
}

// Set up rainbow color button
rainbowColorButton.addEventListener('click', () => {
    rainbowColorButton.classList.toggle('active')
    console.log('rainbow button is clicked')

    if (rainbowColorButton.classList.contains('active')) {
        canvas.addClass('rainbowBackground')
        draw()
    } else {
        canvas.removeClass('rainbowBackground')
    }

})

// Set up stroke button
strokeButton.addEventListener('click', () => {
    strokeButton.classList.toggle('no-stroke-active')

    // Update button text
    if (strokeButton.classList.contains('no-stroke-active')) {
        strokeButton.innerText = "Box Stroke Off"
    } else {
        strokeButton.innerText = "Box Stroke On"
    }
    // rainbowColorButton.classList.toggle('no-stroke-active')
    // randomColorButton.classList.toggle('no-stroke-active')
    // invertColorButton.classList.toggle('no-stroke-active')
    // neighborButton.classList.toggle('no-stroke-active')
    // stableLifeButton.classList.toggle('no-stroke-active')
})


// Set up random color button
randomColorButton.addEventListener('click', () => {
    randomColorButton.classList.toggle('active')

    if (!randomColorButton.classList.contains('active')) {
        boxColorSelector.value = boxColor
    }
    if (!randomColorButton.classList.contains('active') && invertColorButton.classList.contains('active')) {
        canvasColorSelector.value = boxColor
        boxColorSelector.value = canvasColor
    }
})

// Set up invert color button
invertColorButton.addEventListener('click', () => {
    invertColorButton.classList.toggle('active')
    invertColorButton.classList.toggle('invert-on')

    if (!invertColorButton.classList.contains('active')) {
        canvasColorSelector.value = canvasColor
        boxColorSelector.value = boxColor
        neighborButton.classList.remove('active')
        stableLifeButton.classList.remove('active')

    } else {
        canvasColorSelector.value = boxColor
        boxColorSelector.value = canvasColor
    }

})

// Set up random generate board button
randomGenerateButton.addEventListener('click', () => {

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            // For random state
            currentBoard[i][j].alive = random() > 0.8 ? true : false;

        }
    }
    loop()
})

// Set up neighbor color button
neighborButton.addEventListener('click', () => {
    neighborButton.classList.toggle('active')

    if (neighborButton.classList.contains('active')) {
        stableLifeButton.classList.remove('active')
    }
})

// Set up stable color button
stableLifeButton.addEventListener('click', () => {
    stableLifeButton.classList.toggle('active')

    if (stableLifeButton.classList.contains('active')) {
        neighborButton.classList.remove('active')
    }
})

// Set up circle button
circleButton.addEventListener('click', () => {
    circleButton.classList.toggle('active')

})
// Set up star button
// starButton.addEventListener('click', () => {
//     starButton.classList.toggle('active')

// })

// Set up random box color button
randomBoxColorButton.addEventListener('click', () => {
    randomBoxColorButton.classList.toggle('active')

    const randomColor = randColor()
    boxColorSelector.value = randomColor
    boxColor = randomColor
})

// Set up random canvas color button
randomCanvasColorButton.addEventListener('click', () => {
    randomCanvasColorButton.classList.toggle('active')

    const randomColor = randColor()
    canvasColorSelector.value = randomColor
    canvasColor = randomColor
})

// Set up random stroke color button
randomStrokeColorButton.addEventListener('click', () => {
    randomStrokeColorButton.classList.toggle('active')

    const randomColor = randColor()
    strokeColorSelector.value = randomColor
    strokeColor = randomColor
})

// Set up input button
inputButton.addEventListener('click', () => {
    inputButton.classList.toggle('keyboard-active')

    if (inputButton.classList.contains('keyboard-active')) {
        inputButton.firstElementChild.innerHTML = '<i class="bi bi-keyboard"></i>'
        prev_x = null
        prev_y = null
        noLoop()
    } else {
        inputButton.firstElementChild.innerHTML = '<i class="bi bi-mouse"></i>'
        loop()
    }

})

// hex to rgba function (NOT IN USE)
function hexToRGBA(h) {
    let r = 0,
        g = 0,
        b = 0;

    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];

        // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }

    return "rgba(" + +r + "," + +g + "," + +b
}

// Convert hex color to darker or lighter based on amt, positive for lighter, negative for darker
function LightenDarkenColor(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

}

// Set up game button
gameButton.addEventListener('click', () => {
    gameButton.classList.toggle('active')
    scoreDisplay.classList.toggle('active')

    if (gameButton.classList.contains('active')) {


        // Initialize board with no live
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                // currentBoard[i][j] = 0;
                // nextBoard[i][j] = 0;

                currentBoard[i][j] = {
                    alive: false,
                    neighbors: 0,
                    rounds: 0,
                }

                nextBoard[i][j] = {
                    alive: false,
                    neighbors: 0,
                    rounds: 0,
                }

                // For blank board
                currentBoard[i][j].alive = false;

            }
        }



    }
})



// window.addEventListener('resize', () => {
//     if (window.innerWidth < 475) {
//         document.querySelector('#box-size').value = 10
//     }
//     resizeBox()
// })