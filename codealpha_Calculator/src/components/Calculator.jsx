import { useCallback, useEffect, useState } from 'react'
import Display from './Display'
import CalculatorButton from './CalculatorButton'

const buttons = [
  { label: 'AC', variant: 'accent' },
  { label: 'DEL', variant: 'accent' },
  { label: '%', variant: 'accent' },
  { label: '÷', variant: 'operator' },
  { label: '7' },
  { label: '8' },
  { label: '9' },
  { label: '×', variant: 'operator' },
  { label: '4' },
  { label: '5' },
  { label: '6' },
  { label: '−', variant: 'operator' },
  { label: '1' },
  { label: '2' },
  { label: '3' },
  { label: '+', variant: 'operator' },
  { label: '+/−', variant: 'accent' },
  { label: '0', wide: true },
  { label: '.', variant: 'accent' },
  { label: '=', variant: 'operator' },
]

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '0'
  }

  const text = String(value)
  if (text === '-0') {
    return '0'
  }

  return text
}

function calculateResult(firstValue, operatorSymbol, secondValue) {
  const firstNumber = Number(firstValue)
  const secondNumber = Number(secondValue)

  if (operatorSymbol === '÷' && secondNumber === 0) {
    throw new Error('Cannot divide by zero')
  }

  switch (operatorSymbol) {
    case '+':
      return firstNumber + secondNumber
    case '−':
      return firstNumber - secondNumber
    case '×':
      return firstNumber * secondNumber
    case '÷':
      return firstNumber / secondNumber
    default:
      throw new Error('Invalid operator')
  }
}

function Calculator() {
  const [displayValue, setDisplayValue] = useState('0')
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    const saved = window.localStorage.getItem('calculator-theme')
    return saved || 'dark'
  })

  const isOperator = (value) => ['+', '−', '×', '÷'].includes(value)

  const appendValue = useCallback((value) => {
    setError('')

    if (value === 'AC') {
      setDisplayValue('0')
      setExpression('')
      setResult('0')
      setPreviousValue(null)
      setOperator(null)
      setWaitingForSecondOperand(false)
      return
    }

    if (value === 'DEL') {
      if (displayValue === '0' || displayValue === 'Error') {
        setDisplayValue('0')
        setResult('0')
        return
      }

      const nextValue = displayValue.length <= 1 ? '0' : displayValue.slice(0, -1)
      setDisplayValue(nextValue)
      setResult(nextValue)
      return
    }

    if (value === '+/−') {
      const numericValue = Number(displayValue)
      const nextValue = formatValue(numericValue * -1)
      setDisplayValue(nextValue)
      setResult(nextValue)
      return
    }

    if (value === '%') {
      const numericValue = Number(displayValue)
      const nextValue = formatValue(numericValue / 100)
      setDisplayValue(nextValue)
      setResult(nextValue)
      setExpression(nextValue)
      return
    }

    if (value === '=') {
      if (!operator || previousValue === null) {
        return
      }

      if (waitingForSecondOperand) {
        return
      }

      try {
        const nextValue = formatValue(calculateResult(previousValue, operator, displayValue))
        const fullExpression = `${previousValue} ${operator} ${displayValue}`
        setDisplayValue(nextValue)
        setResult(nextValue)
        setExpression(fullExpression)
        setPreviousValue(nextValue)
        setOperator(null)
        setWaitingForSecondOperand(true)
        setHistory((previousHistory) => {
          const isDuplicate = previousHistory[0]?.expression === fullExpression && previousHistory[0]?.result === nextValue
          if (isDuplicate) {
            return previousHistory
          }

          return [{ expression: fullExpression, result: nextValue }, ...previousHistory].slice(0, 8)
        })
      } catch (err) {
        setError(err.message)
        setDisplayValue('0')
        setResult('0')
        setExpression('')
        setPreviousValue(null)
        setOperator(null)
        setWaitingForSecondOperand(false)
      }
      return
    }

    if (isOperator(value)) {
      if (!previousValue && previousValue !== '0') {
        setPreviousValue(displayValue)
        setOperator(value)
        setWaitingForSecondOperand(true)
        setExpression(`${displayValue} ${value}`)
        setResult(displayValue)
        return
      }

      if (waitingForSecondOperand) {
        setOperator(value)
        setExpression(`${previousValue} ${value}`)
        return
      }

      try {
        const nextValue = formatValue(calculateResult(previousValue, operator, displayValue))
        setDisplayValue(nextValue)
        setResult(nextValue)
        setPreviousValue(nextValue)
        setOperator(value)
        setWaitingForSecondOperand(true)
        setExpression(`${nextValue} ${value}`)
      } catch (err) {
        setError(err.message)
        setDisplayValue('0')
        setResult('0')
        setExpression('')
        setPreviousValue(null)
        setOperator(null)
        setWaitingForSecondOperand(false)
      }
      return
    }

    if (value === '.') {
      if (waitingForSecondOperand) {
        setDisplayValue('0.')
        setResult('0.')
        setWaitingForSecondOperand(false)
        return
      }

      if (displayValue.includes('.')) {
        return
      }

      const nextValue = displayValue === '0' ? '0.' : `${displayValue}.`
      setDisplayValue(nextValue)
      setResult(nextValue)
      if (operator && previousValue !== null) {
        setExpression(`${previousValue} ${operator} ${nextValue}`)
      } else {
        setExpression(nextValue)
      }
      return
    }

    if (waitingForSecondOperand) {
      setDisplayValue(value)
      setResult(value)
      setWaitingForSecondOperand(false)
      setExpression(operator && previousValue !== null ? `${previousValue} ${operator} ${value}` : value)
      return
    }

    const nextValue = displayValue === '0' ? value : `${displayValue}${value}`
    setDisplayValue(nextValue)
    setResult(nextValue)
    if (operator && previousValue !== null) {
      setExpression(`${previousValue} ${operator} ${nextValue}`)
    } else {
      setExpression(nextValue)
    }
  }, [displayValue, operator, previousValue, waitingForSecondOperand])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.body.classList.toggle('light-theme', theme === 'light')
    document.body.classList.toggle('dark-theme', theme === 'dark')

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('calculator-theme', theme)
    }
  }, [theme])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key

      if (/^[0-9]$/.test(key)) {
        event.preventDefault()
        appendValue(key)
        return
      }

      if (key === '.') {
        event.preventDefault()
        appendValue('.')
        return
      }

      if (key === '+') {
        event.preventDefault()
        appendValue('+')
        return
      }

      if (key === '-') {
        event.preventDefault()
        appendValue('−')
        return
      }

      if (key === '*') {
        event.preventDefault()
        appendValue('×')
        return
      }

      if (key === '/') {
        event.preventDefault()
        appendValue('÷')
        return
      }

      if (key === 'Enter' || key === '=') {
        event.preventDefault()
        appendValue('=')
        return
      }

      if (key === 'Backspace') {
        event.preventDefault()
        appendValue('DEL')
        return
      }

      if (key === 'Escape') {
        event.preventDefault()
        appendValue('AC')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [appendValue])

  const handleHistoryClear = () => {
    setHistory([])
  }

  const handleHistoryReuse = (item) => {
    setDisplayValue(item.result)
    setResult(item.result)
    setExpression(item.expression)
    setPreviousValue(item.result)
    setOperator(null)
    setWaitingForSecondOperand(true)
    setError('')
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <main className="calculator-shell">
      <div className="calculator-wrapper">
        <section className="calculator-card" aria-label="Calculator app">
          <div className="calculator-header">
            <h2>Calculator</h2>
            <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          <Display expression={expression} result={result} error={error} />
          <div className="button-grid" role="group" aria-label="Calculator buttons">
            {buttons.map((button) => (
              <CalculatorButton
                key={button.label}
                label={button.label}
                variant={button.variant}
                wide={button.wide}
                onClick={() => appendValue(button.label)}
              />
            ))}
          </div>
        </section>

        <aside className="history-panel" aria-label="Calculation history">
          <div className="history-header">
            <h3>History</h3>
            <button type="button" className="history-clear" onClick={handleHistoryClear}>
              Clear History
            </button>
          </div>

          {history.length === 0 ? (
            <p className="history-empty">No calculation history yet.</p>
          ) : (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <button type="button" className="history-item" onClick={() => handleHistoryReuse(item)} aria-label={`Reuse calculation ${item.expression} equals ${item.result}`}>
                    <span className="history-expression">{item.expression}</span>
                    <span className="history-result">{item.result}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </main>
  )
}

export default Calculator
