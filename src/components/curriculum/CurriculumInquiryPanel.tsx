import { Activity, ChevronRight } from 'lucide-react'
import { useId, useState } from 'react'
import type { CurriculumInquiry } from '../../types/curriculum'

interface CurriculumInquiryPanelProps {
  inquiry: CurriculumInquiry
}

export function CurriculumInquiryPanel({ inquiry }: CurriculumInquiryPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const titleId = useId()
  const scenario = inquiry.scenarios[activeIndex]

  return (
    <section className="module-inquiry" aria-labelledby={titleId}>
      <header>
        <Activity aria-hidden="true" size={18} />
        <div><span>Interactive evidence inquiry</span><h2 id={titleId}>{inquiry.title}</h2></div>
      </header>
      <p className="module-inquiry__prompt">{inquiry.prompt}</p>
      <div className="module-inquiry__workspace">
        <div className="module-inquiry__controls" aria-label="Choose a physical scenario" role="group">
          {inquiry.scenarios.map((item, index) => (
            <button
              aria-pressed={activeIndex === index}
              className={activeIndex === index ? 'is-active' : ''}
              key={item.label}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
              <ChevronRight aria-hidden="true" size={14} />
            </button>
          ))}
        </div>
        <div className="module-inquiry__result" aria-live="polite">
          <span>Selected model state</span>
          <h3>{scenario.label}</h3>
          <dl><div><dt>Setup</dt><dd>{scenario.setup}</dd></div><div><dt>Observation</dt><dd>{scenario.observation}</dd></div></dl>
          <p><strong>Analyze:</strong> {inquiry.analysisQuestion}</p>
        </div>
      </div>
    </section>
  )
}
