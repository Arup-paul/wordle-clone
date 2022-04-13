"use strict"

let wordList = [
    'piano',
    'patio',
    'women',
    'darts',
    'horse'
]

let randomIndex = Math.floor(Math.random() * wordList.length)
let secret = wordList[randomIndex]

let currentAttempt = ''
let history = []

let GREY = '#212121'
let LIGHTGREY = '#888'
let MIDDLEGREY = '#666'
let GREEN = '#538d4e'
let YELLOW = '#b59f3b'
let BLACK = '#111'




function buildGrid(){
    for(let i = 0; i <6; i++){
        let row = document.createElement('div')
        for(let j= 0; j < 5; j++){
            let cell = document.createElement('div')
            cell.className = 'cell'
            row.appendChild(cell)
        }
        grid.appendChild(row)
    }

}

function updateGrid(){
    let row = grid.firstChild
   for(let attempt of history){
       drawAttempt(row,attempt,false)
       row = row.nextSibling
   }
    drawAttempt(row,currentAttempt,true)
}

function drawAttempt(row,attempt,isCurrent){
    for(let i = 0; i< 5; i++){
        let cell = row.children[i]
        if(attempt[i] !== undefined){
            cell.textContent = attempt[i]
        }else{
            cell.innerHTML = '<div style="opacity: 0">X</div>'
        }
        if(isCurrent){
            cell.style.backgroundColor = BLACK
            cell.style.borderColor = ''
            if(attempt[i] !== undefined){
                cell.style.borderColor = MIDDLEGREY
            }
        }else{
            cell.style.backgroundColor = getBgColor(attempt,i)
            cell.style.borderColor = getBgColor(attempt,i)
        }


    }
}

function handleKeyDown(e){
    if(e.ctrlKey || e.metaKey || e.altKey){
        return
    }
    handleKey(e.key)
}


function handleKey(key){
    if(history.length === 6){
        return
    }
    let letter  = key.toLowerCase()
    if(letter === 'enter'){
        if(currentAttempt.length < 5){
            return
        }
        if(!wordList.includes(currentAttempt)){
            alert('not in my thesaurus')
            return
        }
        if(history.length ===  5 && currentAttempt !== secret ){
            alert(secret)
        }
        history.push(currentAttempt )
        currentAttempt  = ''
        updateKeyBoard()
        saveGame()

    }else if(letter === 'backspace'){
        currentAttempt = currentAttempt.slice(0,currentAttempt.length -1)
    }else if(/[a-z]$/.test(letter)){
        if(currentAttempt.length < 5) {
            currentAttempt += letter
        }
    }
    updateGrid()

}


function getBgColor(attempt,i){
    let correctLetter = secret[i]
    let attemptLetter = attempt[i]
    if(attemptLetter === undefined || secret.indexOf(attemptLetter) === -1){
        return GREY
    }
    if(correctLetter === attemptLetter){
        return GREEN
    }

    return YELLOW
}

function buildKeyboard(){
    buildKeyboardRow('qwertyuiop',false)
    buildKeyboardRow('asdfghjkl',false)
    buildKeyboardRow('zxcvbnm',true)
}

function buildKeyboardRow(letters,isLastRow){
    let row = document.createElement('div')
    if(isLastRow){
        let button =  document.createElement('button')
        button.className = 'button'
        button.textContent = 'Enter'
        button.style.backgroundColor = LIGHTGREY
        button.onclick = () => {
              handleKey('enter')
        };
        row.appendChild(button)
    }
    for(let letter of letters){
        let button = document.createElement('button')
        button.className = 'button'
        button.textContent = letter
        button.style.backgroundColor = LIGHTGREY
        button.onclick = () => {
            handleKey(letter)
        };
        keyboardButtons.set(letter,button)
        row.appendChild(button)
    }
    if(isLastRow){
        let button =  document.createElement('button')
        button.className = 'button'
        button.textContent = 'Backspace'
        button.style.backgroundColor = LIGHTGREY
        button.onclick = () => {
            handleKey('backspace')
        };
        row.appendChild(button)
    }
    keyboard.appendChild(row)
}

function getBetterColor(a,b){
    if(a === GREEN || b === GREEN){
        return GREEN
    }
    if(a === YELLOW || b === YELLOW){
        return YELLOW
    }
    return GREY;
}


function updateKeyBoard(){
    let bestColors = new Map()
    for(let attempt of history){
        for(let i = 0; i< attempt.length; i++){
            let color = getBgColor(attempt,i)
            let key = attempt[i]
            let bestColor = bestColors.get(key)
            bestColors.set(key,getBetterColor(color,bestColor));
        }
    }
   for(let [key,button] of keyboardButtons){
       button.style.backgroundColor = bestColors.get(key)
       button.style.borderColor = bestColors.get(key)
   }
}

function loadGame(){
   let data
    try {
       data = JSON.parse(localStorage.getItem('data'))
    }catch {}
    if(data != null){
        if(data.secret === secret){
            history = data.history
        }
    }
}

function saveGame(){
   let data = JSON.stringify({
       secret,
       history
   })
    try{
       localStorage.setItem('data',data)
    }catch {

    }
}

let grid = document.getElementById('grid')
let keyboard = document.getElementById('keyboard')
let keyboardButtons = new Map()
loadGame()
buildGrid()
buildKeyboard()
updateGrid()
updateKeyBoard()
window.addEventListener('keydown',handleKeyDown)






