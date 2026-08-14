import type { IbPracticeQuestion } from '../types/ibPractice'

export interface QuestionCoachingStep {
  label: string
  instruction: string
}

export interface QuestionCoaching {
  commandTerm: string
  commandMeaning: string
  notices: string[]
  steps: QuestionCoachingStep[]
}

const commandRules: Array<{ pattern: RegExp; term: string; meaning: string }> = [
  { pattern: /\bevaluate\b/i, term: 'Evaluate', meaning: 'Weigh evidence and limitations before reaching a qualified conclusion.' },
  { pattern: /\bexplain\b|\bwhy\b|\bhow\b/i, term: 'Explain', meaning: 'Link a physics cause or model to the stated outcome.' },
  { pattern: /\bcalculate\b|\bdetermine\b|\bestimate\b/i, term: 'Calculate', meaning: 'Show a suitable relationship, substitution, result, and unit.' },
  { pattern: /\bwhich\b|\bwhat\b/i, term: 'Select', meaning: 'Choose the response supported by the physics model and evidence.' },
  { pattern: /\buse\b/i, term: 'Use and connect', meaning: 'Extract the supplied evidence and connect it explicitly to a physics model.' },
]

function responseInstruction(question: IbPracticeQuestion) {
  if (question.answer.kind === 'choice') return 'Predict the physics outcome before reading every option, then eliminate choices that contradict the model.'
  if (question.answer.kind === 'numeric') return 'Substitute with signs and SI prefixes visible; keep extra digits until the final reported value.'
  return `Build at least ${question.marks} distinct physics points: claim, supporting evidence, and model or limitation.`
}

export function buildQuestionCoaching(question: IbPracticeQuestion): QuestionCoaching {
  const command = commandRules.find((rule) => rule.pattern.test(question.prompt)) ?? {
    term: 'Respond',
    meaning: 'Address exactly what is requested and make each physics step visible.',
  }
  const notices: string[] = []

  if (question.data?.length) notices.push('Read every data label and unit before calculating; decide which values are relevant and which are controls.')
  if (question.answer.kind === 'numeric') notices.push(`Name the unknown and its target unit${question.answer.unit ? ` (${question.answer.unit})` : ''} before choosing an equation.`)
  if (question.answer.kind === 'choice') notices.push('Predict first, then compare options; distractors often use a nearby but inapplicable model.')
  if (question.answer.kind === 'text') notices.push(`${question.marks} marks usually require ${question.marks} separately stated, connected ideas.`)
  if (question.skillFocus.includes('graph-interpretation')) notices.push('For a graph, identify both axes and ask whether gradient, area, intercept, or shape carries the physics meaning.')
  if (question.skillFocus.includes('data-analysis')) notices.push('Look for trend, proportionality, anomalous data, precision, and whether uncertainty supports the claimed pattern.')
  if (question.skillFocus.includes('experimental')) notices.push('Separate the independent and dependent variables; notice controls, repeatability, resolution, and dominant uncertainty.')
  if (question.skillFocus.includes('assumptions')) notices.push('State the model boundary and check whether each simplifying assumption is justified by the scenario.')
  if (question.skillFocus.includes('evaluation')) notices.push('Use evidence on both sides, identify a limitation, then give a qualified conclusion rather than an absolute claim.')

  return {
    commandTerm: command.term,
    commandMeaning: command.meaning,
    notices: notices.slice(0, 4),
    steps: [
      { label: 'Decode', instruction: `Underline the command term “${command.term}” and translate it into the required response: ${command.meaning}` },
      { label: 'Extract', instruction: 'List the givens, the unknown or claim, units, signs, evidence, and any condition that limits the model.' },
      { label: 'Model', instruction: 'Choose one governing relationship or principle and say why its assumptions fit this situation.' },
      { label: 'Execute', instruction: responseInstruction(question) },
      { label: 'Check', instruction: 'Check units, sign, magnitude, significant figures, mark coverage, and whether the result answers the exact question.' },
    ],
  }
}
