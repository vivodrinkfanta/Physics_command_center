import type { FormulaExpression as FormulaExpressionValue } from '../../types/formula'

interface FormulaExpressionProps {
  className?: string
  expression: FormulaExpressionValue
}

export function FormulaExpression({ className = '', expression }: FormulaExpressionProps) {
  return (
    <span
      aria-label={expression.plainText}
      className={`math-expression${className ? ` ${className}` : ''}`}
      data-expression={expression.plainText}
    >
      {expression.tokens.map((token, index) =>
        token.kind === 'variable' ? (
          <var
            className="math-expression__variable"
            data-variable-id={token.variableId}
            key={`${token.text}-${index}`}
          >
            {token.text}
          </var>
        ) : (
          <span className={`math-expression__${token.kind}`} key={`${token.text}-${index}`}>
            {token.text}
          </span>
        ),
      )}
    </span>
  )
}
