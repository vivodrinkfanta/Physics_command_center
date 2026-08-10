import type {
  FormulaExpression,
  FormulaExpressionToken,
  PhysicsVariableId,
} from '../../types/formula'

export const expression = (
  plainText: string,
  tokens: FormulaExpressionToken[],
): FormulaExpression => ({ plainText, tokens })

export const variable = (
  text: string,
  variableId: PhysicsVariableId,
): FormulaExpressionToken => ({ kind: 'variable', text, variableId })

export const operator = (text: string): FormulaExpressionToken => ({ kind: 'operator', text })
export const number = (text: string): FormulaExpressionToken => ({ kind: 'number', text })
export const grouping = (text: string): FormulaExpressionToken => ({ kind: 'grouping', text })
export const formulaFunction = (text: string): FormulaExpressionToken => ({ kind: 'function', text })
