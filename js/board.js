var numSelected = null;
var titleSelected = null;

var errors = 0;

var board = [
    [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
    ],
    [
        "4-78-5--9",
        "--37-1-5-",
        "-1--4-786",
        "1-2----74",
        "---43----",
        "---91-8-5",
        "-------4-",
        "3-9--86--",
        "2--3-4-18"
    ],
    [
        "2----4---",
        "-45--81-6",
        "13--9--4-",
        "---84---9",
        "--------4",
        "489---731",
        "62-----17",
        "-----169-",
        "7-1-36---"
    ],
    [   "21-9-3---",
        "----718--",
        "-----2--6",
        "--7----13",
        "6------57",
        "--1------",
        "-62-5----",
        "---6--4--",
        "3-4------"
    ],
    [   "98--64--1",
        "--5-----8",
        "-768---2-",
        "-----218-",
        "218736---",
        "-----8---",
        "6-3----74",
        "---24---6",
        "-546-3---"
        ]

]

window.onload = function() {
    setGame();
}

function setGame() {
    let board_selected = board[Math.floor(Math.random() * board.length)];
    for (let i=0; i<9;i++) {
        for (let j=0; j<9; j++) {
            let tile = document.createElement("div");
            if (board_selected[i][j] !== "-"){
                tile.innerText = board_selected[i][j];
                tile.classList.add("tile__value");
            }
            if (i===2 || i===5){
                tile.classList.add("horizontal-line");
            }
            if (j===2 || j===5){
                tile.classList.add("vertical-line");
            }
            tile.contentEditable = true;
            tile.id = "x_"+ i + "_" + j
            tile.addEventListener("DOMSubtreeModified", function (event) {
                let num = Number(this.innerText);
                let  reg = /^\d+$/;
                if (isNaN(num) || this.innerText.length > 1) {
                    if(this.innerText.length > 1 && this.innerText[1].match(reg)) {
                        if (this.innerText[1] !== 0) {
                        this.innerText = this.innerText[1]
                            }
                        else{
                            this.innerText = ""
                        }
                    }
                    else if (this.innerText.length > 0 && this.innerText[0].match(reg)) {
                        if (this.innerText[1] !== 0) {
                            this.innerText = this.innerText[0]
                        }
                        else {
                            this.innerText = ""
                        }
                    }
                    else {
                        this.innerText = ""
                    }
                    return;
                }
                if(num===0){
                    this.innerText = "";
                }
                if(this.innerText !== ""){
                    this.classList.add("tile__value");
                }
                else {
                    this.classList.remove("tile__value");
                }
            });

            tile.addEventListener("keydown", function (event) {
                if (event === 8) {
                    console.log("Deleting")
                        this.classList.remove("tile__value");
                }
            });
            tile.classList.add("tile");
            document.getElementById("sudoku").append(tile);
        }
    }
}

// clearBoard
function clearBoard() {
    let sudoku = document.getElementsByClassName("tile")
    for(let i=0;i<sudoku.length;i++){
        sudoku[i].innerText = "";
    }
}

// reset to default
function ResetBoard() {
    document.getElementById("error").innerHTML = "";
    let board_selected = board[Math.floor(Math.random() * board.length)];
    let sudoku = document.getElementsByClassName("tile");
    for(let i=0;i<9;i++) {
        for (let j = 0; j < 9; j++) {
            sudoku[(i*10-i*1) + j].innerText = board_selected[i][j];
        }
    }
}