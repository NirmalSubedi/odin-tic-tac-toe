# Tic-Tac-Toe
The classic game of Tic-Tac-Toe on the webpage and the console. 

[Play Now!](https://nirmalsubedi.github.io/odin-tic-tac-toe)

## How to play?
First, pick your opponent to play against. Once you have found your opponent, open the above link. There are two places you can play, first is the webpage and last is in the console panel.

**Play on webpage:**
- Pick player names by clicking/tabbing to player one and two text field.
- Interact with start button by clicking or tabbing to it and pressing enter.
- Pick a spot to mark (x/o), then either click it or tab to it and enter.
- Play your turns wisely to get your mark lined up vertically, horizontally, or diagonally 3-in-a-row and prevent your opponent from getting it first.
- At the end the match result gets announced (winning player / draw) at the top.
- To start a new match click or tab to and press enter on the restart button.

**Play on console:**
- Open the devtools in the browser and navigate to the console panel. 
- Enter `GameController.playRound(number)`, where number is any number between 1 and 9 and press enter to update the board.
- Repeat the step above to line up your mark(x/o) 3-in-a-row to win.
- Start a new match by entering `GameController.newMatch()` to get a fresh board. 

## Which skills were demonstrated?
- Creating multi object instances with factory functions.
- Wrapping factories in `()` and putting them at the end to immediately invoke the function expression i.e., a IIFE.
- Creating a single instance of an object from an function using IIFE. 
- Privatizing various variables and methods (functions) to restrict access from outside of function scope.
- Allowing access to select methods or variables by returning within the function.
- Levering closures to access function later in the code after they have been evaluated and closed over.

## Credits 
_Project from TOP (The Odin Project)._