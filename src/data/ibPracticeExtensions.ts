import { curriculumRelationships, getCurriculumRelationships } from './curriculumRelationships'
import { ibPhysicsTopics } from './ibPhysicsCurriculum'
import type { IbPracticeQuestion, PracticeAssessmentStyle, PracticeSkillFocus } from '../types/ibPractice'

function rotateChoices(correct: string, distractors: string[], correctIndex: number) {
  const labels = distractors.slice(0, 3)
  labels.splice(correctIndex, 0, correct)
  return {
    choices: labels.map((label, index) => ({ id: String.fromCharCode(97 + index), label })),
    correctChoiceId: String.fromCharCode(97 + correctIndex),
  }
}

function choiceQuestion(
  id: string,
  topicCode: (typeof ibPhysicsTopics)[number]['code'],
  level: 'sl' | 'hl',
  style: PracticeAssessmentStyle,
  title: string,
  scenario: string,
  prompt: string,
  correct: string,
  distractors: string[],
  correctIndex: number,
  relationshipIds: string[] = [],
  skillFocus: PracticeSkillFocus[] = ['conceptual', 'model-selection'],
): IbPracticeQuestion {
  const answerSet = rotateChoices(correct, distractors, correctIndex)
  return {
    id, topicCode, level, style, difficulty: 'standard', skillFocus, title, scenario, prompt,
    choices: answerSet.choices,
    answer: { kind: 'choice', correctChoiceId: answerSet.correctChoiceId }, marks: 1,
    hints: ['Identify which model state or assumption is actually described.', 'Eliminate options that contradict the stated evidence.'],
    markscheme: [`${answerSet.correctChoiceId.toUpperCase()}. ${correct}.`],
    formulaIds: [], relationshipIds, tags: [topicCode, 'model', 'evidence'],
  }
}

export const ibPracticeExtensions: readonly IbPracticeQuestion[] = ibPhysicsTopics.flatMap((topic, topicIndex) => {
  const level = topic.availability === 'hl-only' ? 'hl' : 'sl'
  const relationships = getCurriculumRelationships(topic.relationshipIds)
  const scenarioQuestions = topic.inquiry.scenarios.map((scenario, scenarioIndex) => {
    const distractors = topic.inquiry.scenarios
      .filter((candidate) => candidate.label !== scenario.label)
      .map((candidate) => candidate.observation)
    distractors.push('The model predicts no observable physical change in this setup.')
    return choiceQuestion(
      `${topic.slug}-scenario-${scenarioIndex + 1}`,
      topic.code,
      level,
      'paper-1a',
      `${topic.code} scenario: ${scenario.label}`,
      scenario.setup,
      'Which observation is consistent with this model state?',
      scenario.observation,
      distractors,
      (topicIndex + scenarioIndex) % 4,
      topic.relationshipIds,
    )
  })

  const relationshipQuestions = relationships.flatMap((relationship, relationshipIndex) => {
    const otherRelationships = curriculumRelationships.filter((candidate) => candidate.id !== relationship.id)
    const offset = (topicIndex * 3 + relationshipIndex * 5) % otherRelationships.length
    const distractorSet = [0, 1, 2].map((step) => otherRelationships[(offset + step * 7) % otherRelationships.length])
    return [
      choiceQuestion(
        `${topic.slug}-${relationship.id}-meaning`, topic.code, level, 'paper-1a',
        `Interpret ${relationship.name}`, `A student selects ${relationship.expression} for a ${topic.title.toLowerCase()} model.`,
        'What does this relationship state physically?', relationship.meaning,
        distractorSet.map((candidate) => candidate.meaning), (topicIndex + relationshipIndex + 1) % 4, [relationship.id],
      ),
      choiceQuestion(
        `${topic.slug}-${relationship.id}-assumption`, topic.code, level, 'paper-1a',
        `Check ${relationship.name}`, `The relationship ${relationship.expression} is proposed for an investigation.`,
        'Which condition must be checked before applying it as stated?', relationship.assumption,
        distractorSet.map((candidate) => candidate.assumption), (topicIndex + relationshipIndex + 2) % 4, [relationship.id], ['assumptions', 'model-selection'],
      ),
    ]
  })

  const conceptGroups = topic.concepts.slice(0, 3).map((concept) => {
    const parts = concept.toLowerCase().split(/\s+and\s+|,\s*/).filter((part) => part.length > 3)
    return [concept, ...parts]
  })
  const synthesisQuestion: IbPracticeQuestion = {
    id: `${topic.slug}-model-synthesis`, topicCode: topic.code, level, style: 'paper-2-short', difficulty: 'challenge', skillFocus: ['assumptions', 'evaluation'],
    title: `${topic.code} model synthesis`, scenario: topic.inquiry.prompt,
    prompt: `Use ${topic.concepts.slice(0, 3).join(', ')} to answer: ${topic.inquiry.analysisQuestion}`,
    answer: { kind: 'text', requiredGroups: conceptGroups }, marks: conceptGroups.length,
    hints: ['Define each named concept in this physical context.', 'Build one causal chain from the setup to the observation.'],
    markscheme: topic.concepts.slice(0, 3).map((concept) => `Uses ${concept} accurately in the explanation. [1]`),
    formulaIds: [], relationshipIds: topic.relationshipIds, tags: [topic.code, 'synthesis', 'reasoning'],
  }

  return [...scenarioQuestions, ...relationshipQuestions, synthesisQuestion]
})
