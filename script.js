const GameBoard = (function () {
    const board = [];
    let cellCount = 0;

    const winConditions = {
        rows: [],
        columns: [[], [], []],
        diagonals: [[], []],
    };

    const fillBoard = () => {
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i].push({ value: ++cellCount, mark: '' });
                winConditions.columns[j].push(board[i][j]);
            }
            winConditions.rows.push(board[i]);
        }

        for (let i = 0; i < 3; i++) {
            winConditions.diagonals[0].push(board[i][i]);
            winConditions.diagonals[1].push(board.at(i).at(2 - i));
        }
    }

    fillBoard();

    const printBoard = () => {
        const displayBoard = [[], [], []];
        for (let i = 0; i < board.length; i++) {
            const displayRow = displayBoard[i];
            for (let j = 0; j < board[i].length; j++) {
                displayRow.push(board[i][j].value)
            }
        }
        console.table(displayBoard);
    };

    let validTarget = false;

    const targetCell = (cellNumber, player) => {
        validTarget = false;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j].value === cellNumber) {
                    board[i][j].value = player;
                    board[i][j].mark = player;
                    validTarget = true;
                    return;
                }
            }
        }
        if (validTarget === false) {
            printBoard();
            console.log('Invalid! Pick an available space from "1-9"');
        };
    };

    const validateTarget = () => validTarget;

    const getBoard = () => board;

    const getWinConditions = () => winConditions;

    const resetBoard = () => {
        cellCount = 0;
        winConditions.rows = [];
        winConditions.columns = [[], [], []];
        winConditions.diagonals = [[], []];
        board.forEach((row) => row.forEach((cell) => cell.value = cellCount));
        board.forEach((row) => row.pop());
        fillBoard();
    };

    return { getBoard, printBoard, getWinConditions, targetCell, validateTarget, resetBoard };
})();

const players = (function (playerOneName = 'Player One', playerTwoName = 'Player Two') {
    const players = [
        {
            name: playerOneName,
            mark: 'X'
        },
        {
            name: playerTwoName,
            mark: 'O'
        },
    ];

    let currentPlayer = players[0];

    let switchCurrentPlayer = () => currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    const getCurrentPlayer = () => currentPlayer;

    const getPlayers = () => players;

    return { switchCurrentPlayer, getCurrentPlayer, getPlayers };
})();

const GameController = (function () {
    let board = GameBoard;
    let winner = '';
    let turnsPlayed = 0;
    let activeGame = true;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${players.getCurrentPlayer().name}'s turn...`)
    };

    const playRound = (cell) => {
        if (activeGame === false) return;
        console.clear();

        board.targetCell(cell, players.getCurrentPlayer().mark);

        if (board.validateTarget() === false) return;

        const checkWinner = () => {
            Object.entries(board.getWinConditions())
                .forEach(([key, keyValue]) => keyValue
                    .some((winLine) => (winLine
                        .every((cell) => cell.value === players.getCurrentPlayer().mark))) ? activeGame = false: 'no win');
            if (activeGame === false) {
                winner = players.getCurrentPlayer().name;
                board.printBoard();
                console.log(`${winner} wins!!!`)
            }
        }

        const checkDraw = () => {
            if (winner === '' && turnsPlayed === 9) {
                activeGame = false;
                board.printBoard();
                console.log('DRAW! No winners...');
            }
        };

        turnsPlayed++;
        checkWinner();
        checkDraw();

        if (activeGame) {
            console.log(`Marking cell ${cell} with ${players.getCurrentPlayer().name}'s "${players.getCurrentPlayer().mark}!"`);
            players.switchCurrentPlayer();
            printNewRound();
        };
    };

    const newMatch = () => {
        board.resetBoard();
        activeGame = true;
        winner = '';
        turnsPlayed = 0;
        players.switchCurrentPlayer();
        console.clear();
        printNewRound();
    }

    const getWinner = () => winner;
    const isGameActive = () => activeGame;
    const getTurnsPlayed = () => turnsPlayed;

    printNewRound();

    return { playRound, newMatch, getWinner, isGameActive, getTurnsPlayed }
})();

const DisplayController = (function () {
    const messageH1 = document.querySelector('.message');
    const boardDiv = document.querySelector('.board');
    const startButton = document.querySelector('.start-btn');
    const restartButton = document.querySelector('.restart-btn');
    const playerInputs = document.querySelectorAll('.player-name');
    const playerOneDiv = document.querySelector('.player-1');
    const playerTwoDiv = document.querySelector('.player-2');

    const board = GameBoard;
    const game = GameController;

    const removeCurrentPlayerRender = () => {
        playerOneDiv.classList.remove('current-player');
        playerTwoDiv.classList.remove('current-player');
    };

    const updateScreen = () => {
        boardDiv.textContent = "";

        const toggleCurrentPlayer = () => {
            messageH1.textContent = `${players.getCurrentPlayer().name}'s turn...`
            const isPlayerOneTurn = players.getCurrentPlayer().name === playerOneDiv.firstElementChild.value ||
                players.getCurrentPlayer().name === playerOneDiv.firstElementChild.placeholder;

            if (isPlayerOneTurn) {
                playerOneDiv.classList.add('current-player');
                playerTwoDiv.classList.remove('current-player');
            } else {
                playerTwoDiv.classList.add('current-player');
                playerOneDiv.classList.remove('current-player');
            }
        };
        toggleCurrentPlayer();

        const renderBoard = () => {
            board.getBoard().forEach((row) => {
                row.forEach((cell) => {
                    const cellButton = document.createElement("button");
                    cellButton.classList.add("cell");
                    cellButton.dataset.cellNumber = cell.value;
                    cellButton.textContent = cell.mark;
                    boardDiv.appendChild(cellButton);
                })
            });
            boardDiv.appendChild(startButton);
            boardDiv.appendChild(restartButton);
        };
        renderBoard();

        const renderGameResults = () => {
            // Win
            if (game.isGameActive() === false && game.getWinner() !== '') {
                messageH1.textContent = `${game.getWinner()} wins!`;
                removeCurrentPlayerRender();
            };
            // Draw
            if (game.getWinner() === '' && game.getTurnsPlayed() === 9) {
                messageH1.textContent = `DRAW!`;
                removeCurrentPlayerRender();
            }

        };
        renderGameResults();

    };

    // Event Listeners and Handlers
    const changePlayerNameHandler = (event) => {
        const target = event.target;
        const parent = target.parentElement;
        const newName = target.value;
        const playerNumber = Number(parent.getAttribute('class').at(-1));
        players.getPlayers()[playerNumber - 1].name = newName === '' ? target.placeholder : newName;
        updateScreen();
    };
    playerInputs.forEach((input) => input.addEventListener("change", changePlayerNameHandler));

    const clickBoardHandler = (event) => {
        const selectedCell = Number(event.target.dataset.cellNumber);
        game.playRound(selectedCell);
        updateScreen();
    };

    const clickStartHandler = () => {
        boardDiv.addEventListener("click", clickBoardHandler);
        startButton.classList.add('hide');
        restartButton.classList.remove('hide');
        updateScreen();
    }
    startButton.addEventListener('click', clickStartHandler);

    const clickRestartHandler = (event) => {
        event.stopPropagation();
        game.newMatch();
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => cell.remove());
        startButton.classList.toggle('hide');
        restartButton.classList.toggle('hide');
        messageH1.textContent = "Tic-Tac-Toe";
        removeCurrentPlayerRender();
        boardDiv.removeEventListener('click', clickBoardHandler);
    }
    restartButton.addEventListener('click', clickRestartHandler);

})();