import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"


export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPPERTAION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type){

    case ACTIONS.ADD_DIGIT:
      if (state.overwrite){
        return{
          ...state,
          curOperand: payload.digit,
          overwrite: false,
        }
      }

      if (payload.digit === '0' && state.curOperand === '0'){
        return state
      }
      if (payload.digit === '.' && state.curOperand.includes('.')){
        return state
      }
      return{
          ...state,
          curOperand: `${state.curOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPPERTAION:
      if (state.prevOperand == null && state.curOperand == null){
        return state
      }
      if(state.curOperand == null){
        return {
          ...state,
          operation: payload.operation, 
        }
      }

      if (state.prevOperand == null){
        return{
          ...state,
          prevOperand: state.curOperand,
          curOperand: null,
          operation: payload.operation,
        }
      }
        return {
          ...state,
          prevOperand: evaluate(state),
          curOperand: null,
          operation: payload.operation,
        }
            

    case ACTIONS.EVALUATE:
      if (state.curOperand == null ||
          state.prevOperand == null ||
          state.operation == null){
        return state
      }
      return {
        ...state,
        prevOperand: null,
        curOperand: evaluate(state),
        operation: null,
        overwrite: true,
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          curOperand: null,
          ovverwrite: null,
        }
      }

      if (state.curOperand.length == 1){
        return {
          ...state,
          curOperand: null
        }
      }
      
      return {
        ...state,
        curOperand: state.curOperand.slice(0,-1)
      }

    case ACTIONS.CLEAR:
      return {}
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-in", {maximumFractionDigits: 0})

function formatOperand(operand){
  if (operand == null) return
  
  const [integer, decimal] = operand.split('.')

  if(decimal == null) return INTEGER_FORMATTER.format(integer)

  else{
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
  }
}

function evaluate({curOperand, prevOperand, operation}){
  const prev = parseFloat(prevOperand)
  const current = parseFloat(curOperand)
  let results = ""
  if (isNaN(prev) || isNaN(current)) return ""
  switch(operation){
    case '+':
      results = prev + current
      break
    case '-':
      results = prev - current
      break
    case '*':
      results = prev * current
      break
    case '÷':
      results = prev / current
      break
  }
  return results.toString()
}

function App() {

  const [{curOperand, prevOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <>
    <div className="calculator-grid">
      <div className="output">
        <div className="previous">{formatOperand(prevOperand)} {operation}</div>
        <div className="current">{formatOperand(curOperand)}</div>
      </div>
      <button className="span-two" onClick={() => {dispatch({type: ACTIONS.CLEAR})}}>AC</button>
      <button>DEL</button>
      <OperationButton dispatch={dispatch} operation = '÷' />
      <DigitButton dispatch = {dispatch} digit='1'/>
      <DigitButton dispatch = {dispatch} digit='2'/>
      <DigitButton dispatch = {dispatch} digit='3'/>
      <OperationButton dispatch={dispatch} operation = '*' />
      <DigitButton dispatch = {dispatch} digit='4'/>
      <DigitButton dispatch = {dispatch} digit='5'/>
      <DigitButton dispatch = {dispatch} digit='6'/>
      <OperationButton dispatch={dispatch} operation = '+' />
      <DigitButton dispatch = {dispatch} digit='7'/>
      <DigitButton dispatch = {dispatch} digit='8'/>
      <DigitButton dispatch = {dispatch} digit='9'/>
      <OperationButton dispatch={dispatch} operation = '-' />
      <DigitButton dispatch = {dispatch} digit='.'/>
      <DigitButton dispatch = {dispatch} digit='0'/>
      <button
       className='span-two'
       onClick={() => {
        dispatch({type: ACTIONS.EVALUATE})
       }}>
        =
       </button>
    </div>
    </>
  )
}

export default App
