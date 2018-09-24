import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
          <button className="square" onClick={props.onClick}>
            {props.value}
          </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let skey = i;
        return (
           <Square 
            key={skey}
            value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                />
        );
    }
    createBoard = () => {
        let rows = [];
        for (let i=0;i<3;i++) {
            let cols = [];
            for (let j=0;j<3;j++) {
                let skey = (i * 3) + j;
                cols.push(this.renderSquare(skey));
            }
            rows.push(<div key={i} className="board-row">{cols}</div>);
        }
        return rows;
    }
    render() {
        return (
                <div>{this.createBoard()}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                location: null,
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        let loc = getLocationText(i);
        console.log("User clicked: " + loc);
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                location: loc,
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step,move) => {
            const location = move ? (move % 2 ? "X plays " : "O plays ") + history[move].location : '';
            const desc = move ? 
                'Go to move #' + move :
                'Go to game start';
            const cn = this.state.stepNumber === move ? "selected" : "";
            return (
                    <li key={move} className={cn}>

                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    &nbsp;<span>{location}</span>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
                />
        </div>
        <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
        </div>
      </div>
        );
    }
}

// ========================================

ReactDOM.render(
        <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function getLocationText(step) {
    let txt;
    switch(step) {
    case 0: txt = "top left"; break
    case 1: txt = "top middle"; break
    case 2: txt = "top right"; break;
    case 3: txt = "middle left"; break;
    case 4: txt = "center"; break;
    case 5: txt = "middle right"; break;
    case 6: txt = "bottom left"; break;
    case 7: txt = "bottom middle"; break;
    case 8: txt = "bottom right"; break;
    default: txt = "";
    }
    return txt;
}