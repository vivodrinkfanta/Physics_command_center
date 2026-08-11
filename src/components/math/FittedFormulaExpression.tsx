import { useLayoutEffect, useRef } from 'react'
import { FormulaExpression, type FormulaExpressionProps } from './FormulaExpression'

interface FittedFormulaExpressionProps extends FormulaExpressionProps {
  maximumFontSize?: number
  minimumFontSize?: number
}

export function calculateFittedFontSize(
  availableWidth: number,
  naturalWidth: number,
  minimumFontSize: number,
  maximumFontSize: number,
) {
  return Math.max(
    minimumFontSize,
    Math.min(maximumFontSize, maximumFontSize * (availableWidth / Math.max(naturalWidth, 1))),
  )
}

export function FittedFormulaExpression({
  maximumFontSize = 92,
  minimumFontSize = 18,
  ...expressionProps
}: FittedFormulaExpressionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const expression = container?.querySelector<HTMLElement>('.math-expression')
    if (!container || !expression) return

    const fitExpression = () => {
      expression.style.fontSize = `${maximumFontSize}px`
      const availableWidth = container.clientWidth
      const naturalWidth = expression.getBoundingClientRect().width
      const fittedSize = calculateFittedFontSize(
        availableWidth,
        naturalWidth,
        minimumFontSize,
        maximumFontSize,
      )
      expression.style.fontSize = `${fittedSize.toFixed(2)}px`
    }

    fitExpression()
    const observer = new ResizeObserver(fitExpression)
    observer.observe(container)
    void document.fonts?.ready.then(fitExpression)

    return () => observer.disconnect()
  }, [expressionProps.expression, maximumFontSize, minimumFontSize])

  return (
    <div className="fitted-formula" ref={containerRef}>
      <FormulaExpression {...expressionProps} />
    </div>
  )
}
