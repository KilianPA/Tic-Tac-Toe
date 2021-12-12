let currentPlayer = null;
let gameStatus = 0;
let arrayGame = Array.apply(null, Array(9)).map(function () {})

const rows = [
    [0,1,2],
    [3,4,5],
    [6,7,8]
]

const cols = [
    [0,3,6],
    [1,4,7],
    [2,5,8]
]
const diagonal = [
    [0,4,8],
    [2,4,6]
]

const priorityPos = [
    4,0,2,6,8
]


init()
function init () {
    let index = 0
    gameStatus = 1
    let gameBoard = document.getElementById('game')
    for (let i = 0; i < 3; i++) {
        let div = document.createElement('div');
        for (let y = 0; y < 3; y++) {
            let button = document.createElement('button');
            button.id = index
            button.className = 'btn btn-secondary'
            div.appendChild(button);
            index++
        }
        gameBoard.appendChild(div)
    }
    let buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click',  function () {
                setShape(this.id)
        })
    })
}

function setShape (id) {
    if (gameStatus) {
        if (arrayGame[this.id] === undefined) {
            arrayGame[id] = currentPlayer === 'O' ? 'X' : 'O'
            currentPlayer = currentPlayer === 'O' ? 'X' : 'O'
            renderShape()
            if (currentPlayer === 'O') {
                computePlay()
            }
        }
    }
}

function renderShape () {
    arrayGame.forEach((element, index) => {
        if (element) {
            let btn = document.getElementById(index)
            btn.innerHTML = element
        }
    })
    checkVictory()
}

function checkVictory () {
    checkPos(rows)
    checkPos(cols)
    checkPos(diagonal)
}

function computePlay () {
    let nextArrPos = []
    let nextPos = null
    nextArrPos = nextArrPos.concat(calculateNextPos(rows)).concat(calculateNextPos(cols)).concat(calculateNextPos(diagonal))
    if (nextArrPos.length) {
        nextPos = nextArrPos[0].pos
        let loosePos = nextArrPos.filter(pos => pos.loose);
        if (loosePos.length) {
            nextPos = loosePos[0].pos
        }
        let winPos = nextArrPos.filter(pos => pos.win);
        if (winPos.length) {
            nextPos = winPos[0].pos
        }

    } else {
        nextArrPos = priorityPos
        let availablePos = getAvailablePos()
        nextArrPos = nextArrPos.filter(e => availablePos.indexOf(e) !== -1);
        if (nextArrPos.length) {
            nextPos = nextArrPos[0]
        }
    }
    if (!nextPos) {
        nextPos = getAvailablePos()[0]
    }
    setTimeout(() => {
        setShape(nextPos)
    }, 1000)
}

function getAvailablePos () {
    let arrPos = []
    arrayGame.forEach((element, index) => {
        if (element === undefined) {
            arrPos.push(index)
        }
    })
    return arrPos
}

function checkPos (rows) {
    rows.forEach(row => {
        let playerInit = arrayGame[row[0]]
        let samePlayer = true
        for (let pos in row) {
            let player = arrayGame[row[pos]]
            if (player === undefined) {
                samePlayer = false
                continue;
            }
            if (player !== playerInit) {
                samePlayer = false
            }
        }
        if (samePlayer) {
            gameStatus = 0
            document.getElementById('gameStatus').innerHTML = 'Joueur ' + playerInit + ' a gagné'
            setTimeout(() => {
                resetGame()
            }, 2000)
        }
    })
}

function calculateNextPos (rows) {
    let playerTarget = 'O'
    let iaPlayer = 'X'
    let nextArrPos = []
    rows.forEach(row => {
        let playerPosCount = 0;
        let playerIaPosCount = 0;
        let nextPos;
        for (let pos in row) {
            let player = arrayGame[row[pos]]
            if (player === undefined) {
                nextPos = row[pos]
            }
            if (player === iaPlayer) {
                playerIaPosCount++
            }
            if (player === playerTarget) {
                playerPosCount++
            }
            if (playerIaPosCount === 2 && nextPos) {
                nextArrPos.push({win: true, pos: nextPos})
            }
            if (playerPosCount === 2 && nextPos) {
                nextArrPos.push({loose:true, pos: nextPos})
            }
            if (playerIaPosCount > 0 && nextPos) {
                nextArrPos.push({win:false, pos: nextPos})
            }
        }
    })
    return nextArrPos
}


document.getElementById('restart').addEventListener('click', function () {
    resetGame()
})

function  resetGame() {
    arrayGame = Array.apply(null, Array(9)).map(function () {})
    document.getElementById('game').innerHTML = ''
    currentPlayer =  null
    init()
}
