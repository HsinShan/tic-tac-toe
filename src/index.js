import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={()=> this.props.onClick(i)}/>
    }
    
    render() {
        const list = [0,1,2]
        const listItems = list.map((li,i)=>{
            return (
                <div className="board-row">
                    {this.renderSquare(list[0] + 3*i)}
                    {this.renderSquare(list[1] + 3*i)}
                    {this.renderSquare(list[2] + 3*i)}
                </div>
            )
        })
        return (
            <div>
                {listItems}
            </div>
        )
        
    }
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )

}

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    for (let i = 0; i<lines.length; i++){
        const [a,b,c] = lines[i]
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

class Game extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            history :[{
                squares: Array(9).fill(null), 
                target:null
            }],
            xIsNext: true,
            stepNumber: 0
        }
    }
    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        if (calculateWinner(squares) || squares[i]){
            return
        }
        squares[i] = this.state.xIsNext ? 'X': 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                target: [ i%3 , parseInt(i/3)]
            }]),
            squares: squares,
            xIsNext: !this.state.xIsNext,
            stepNumber: this.state.stepNumber + 1
        })
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0 
        })
    }
    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        let btnActiveClass = ''

        const moves = history.map((step,move)=>{
            const desc = move ? 
                'Go to move #'+ move + '->' + '(' + step.target[0] +','+ step.target[1]+')' 
                : 'Go to game start'
            if ( move === this.state.stepNumber) {
                btnActiveClass = 'btn-active'
            } else {
                btnActiveClass = ''
            }
            return (
                <li key ={move}>
                    <button onClick={()=> this.jumpTo(move)} className={btnActiveClass}>{desc}</button>
                </li>
            )
        })
        let status

        if (winner) {
            status = 'Winner: ' + winner
        } else {
            status = 'Next Player: '+  (this.state.xIsNext ? 'X': 'O')
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick = {(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    {moves}
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
