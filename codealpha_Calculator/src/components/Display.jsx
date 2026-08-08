function Display({ expression, result, error }) {
  const displayExpression = expression || '0'
  const displayText = error ? 'Error' : displayExpression
  const resultText = error ? error : result

  const getResultFontSize = (text) => {
    const length = String(text).length

    if (length <= 8) {
      return '2.4rem'
    }

    if (length <= 10) {
      return '2rem'
    }

    if (length <= 12) {
      return '1.7rem'
    }

    if (length <= 15) {
      return '1.35rem'
    }

    return '1.1rem'
  }

  return (
    <section className="display-card" aria-label="Calculator display" aria-live="polite" aria-atomic="true">
      <div className="display-expression" aria-label="Current expression">
        {displayText}
      </div>
      <div
        className={`display-result ${error ? 'error' : ''}`}
        aria-label="Current result"
        style={{ fontSize: getResultFontSize(resultText) }}
      >
        {resultText}
      </div>
    </section>
  )
}

export default Display
