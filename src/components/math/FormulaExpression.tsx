import type {
  FormulaExpression as FormulaExpressionValue,
  PhysicsVariableId,
} from '../../types/formula'
import { getVariableDefinition } from '../../data/variables'

export interface FormulaExpressionProps {
  className?: string
  expression: FormulaExpressionValue
  highlightVariableId?: PhysicsVariableId | null
  onVariableHighlight?: (variableId: PhysicsVariableId | null) => void
}

export function FormulaExpression({
  className = '',
  expression,
  highlightVariableId = null,
  onVariableHighlight,
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
            aria-label={
              token.variableId
                ? `${getVariableDefinition(token.variableId).name}, ${token.text}`
                : undefined
            }
            className={`math-expression__variable${
              highlightVariableId
                ? token.variableId === highlightVariableId
                  ? ' math-expression__variable--active'
                  : ' math-expression__variable--muted'
                : ''
            }`}
            data-variable-id={token.variableId}
            key={`${token.text}-${index}`}
            onBlur={() => onVariableHighlight?.(null)}
            onFocus={() => token.variableId && onVariableHighlight?.(token.variableId)}
            onMouseEnter={() => token.variableId && onVariableHighlight?.(token.variableId)}
            onMouseLeave={() => onVariableHighlight?.(null)}
            tabIndex={onVariableHighlight ? 0 : undefined}
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
