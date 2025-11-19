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
                board[i].push({ value: ++cellCount });
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

    // Make Array of win conditions (rows, columns, diagonals) 
    // Fill cells with empty string
    // Check for available cells (are cells empty string?)
    // Reject placement of filled cell
    let validTarget = false;

    const targetCell = (cellNumber, player) => {
        validTarget = false;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j].value === cellNumber) {
                    board[i][j].value = player;
                    validTarget = true;
                    return;
                }
            }
        }
        if (validTarget === false) {
            printBoard();
            console.log('Invalid! Pick an available space from "1-9"');
        };
    }
    const validateTarget = () => validTarget;

    const getBoard = () => board;

    const getWinConditions = () => winConditions;

    const resetBoard = () => {
        cellCount = 0;
        winConditions.rows = [];
        winConditions.columns = [[],[],[]];
        winConditions.diagonals = [[],[]];
        board.forEach((row) => row.forEach((cell) => cell.value = cellCount));
        board.forEach((row) => row.pop());
        fillBoard();
    };

    return { getBoard, printBoard, getWinConditions, targetCell, validateTarget, resetBoard };

})();

function Players(playerOneName = 'Player One', playerTwoName = 'Player Two') {
    // Create players' name and mark
    const players = [
        { name: playerOneName, mark: 'x' },
        { name: playerTwoName, mark: 'o' },
    ];
    // Determine current player
    let currentPlayer = players[0];

    // Switch current Player
    let switchCurrentPlayer = () => currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    const getCurrentPlayer = () => currentPlayer;

    const getPlayers = () => players;

    return { switchCurrentPlayer, getCurrentPlayer, getPlayers };
};

const GameController = (function () {
    let board = GameBoard;
    const players = Players();
    let winner = '';
    let currentTurn = 1;

    // Activate game round
    let gameIsActive = true;


    const printNewRound = () => {
        board.printBoard();
        console.log(`${players.getCurrentPlayer().name}'s turn...`)
    };

    const playRound = (cell) => {
        console.clear();
        board.targetCell(cell, players.getCurrentPlayer().mark);

        if (board.validateTarget() === false) return;

        const checkWinner = () => {
            Object.entries(board.getWinConditions())
                .forEach(([key, keyValue]) => keyValue
                    .some((winLine) => (winLine
                        .every((cell) => cell.value === players.getCurrentPlayer().mark))) ? gameIsActive = false : 'no win');
            if (gameIsActive === false) {
                winner = players.getCurrentPlayer().name;
                console.log(`${winner} wins!!!`)
            }
        }

        const checkDraw = () => {
            if (winner === '' && currentTurn === 9) {
                gameIsActive = false;
                board.printBoard();
                console.log('DRAW! No winners...');
            }
        };

        checkWinner();
        checkDraw();

        if (gameIsActive) {
            console.log(`Marking cell ${cell} with ${players.getCurrentPlayer().name}'s "${players.getCurrentPlayer().mark}!"`);
            players.switchCurrentPlayer();
            printNewRound();
            currentTurn++;
        };
    };

    const newMatch = () => {
        board.resetBoard();
        gameIsActive = true;
        winner = '';
        currentTurn = 1;
        players.switchCurrentPlayer();
        console.clear();
        printNewRound();
    }
    printNewRound();

    return { playRound, newMatch }
})();