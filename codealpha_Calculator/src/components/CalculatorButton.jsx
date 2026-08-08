function CalculatorButton({ label, onClick, variant = 'default', wide = false }) {
  const actionLabel = {
    AC: 'Clear all',
    DEL: 'Delete last character',
    '%': 'Percent',
    '÷': 'Divide',
    '×': 'Multiply',
    '−': 'Subtract',
    '+': 'Add',
    '=': 'Calculate result',
    '.': 'Decimal point',
    '+/−': 'Toggle sign',
  }[label] || `Number ${label}`

  return (
    <button
      type="button"
      className={`calculator-button ${variant} ${wide ? 'wide' : ''}`}
      onClick={onClick}
      aria-label={actionLabel}
      title={actionLabel}
    >
      {label}
    </button>
  )
}

export default CalculatorButton
