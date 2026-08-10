import type {
  FormulaExpression as FormulaExpressionValue,
  PhysicsVariableId,
} from '../../types/formula'

interface FormulaExpressionProps {
  className?: string
  expression: FormulaExpressionValue
  highlightVariableId?: PhysicsVariableId | null
}

export function FormulaExpression({
  className = '',
  expression,
  highlightVariableId = null,
}: FormulaExpressionProps) {
  return (
    <span
      aria-label={expression.plainText}
      className={`math-expression${className ? ` ${className}` : ''}`}
      data-expression={expression.plainText}
    >
      {expression.tokens.map((token, index) =>
        token.kind === 'variable' ? (
          <var
            className={`math-expression__variable${
              highlightVariableId
                ? token.variableId === highlightVariableId
                  ? ' math-expression__variable--active'
                  : ' math-expression__variable--muted'
                : ''
            }`}
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
