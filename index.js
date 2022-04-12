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
        }else{
            cell.style.backgroundColor = getBgColor(attempt,i)
        }


    }
}

function handleKeyDown(e){
    if(e.ctrlKey || e.metaKey || e.altKey){
        return
    }
    let letter  = e.key.toLowerCase()
    if(letter === 'enter'){
       if(currentAttempt.length < 5){
           return
       }
       if(!wordList.includes(currentAttempt)){
           alert('not in my thesaurus')
           return
       }
       history.push(currentAttempt )
        currentAttempt  = ''
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

function buildKeyboardRow(letters){
    let row = document.createElement('div')
    for(let letter of letters){
        let button = document.createElement('button')
        button.className = 'button'
        button.textContent = letter
        button.style.backgroundColor = LIGHTGREY
        button.onclick = () => {

        };
        row.appendChild(button)
    }
    keyboard.appendChild(row)
}



let grid = document.getElementById('grid')
let keyboard = document.getElementById('keyboard')
buildGrid()
buildKeyboard()
updateGrid()
window.addEventListener('keydown',handleKeyDown)






