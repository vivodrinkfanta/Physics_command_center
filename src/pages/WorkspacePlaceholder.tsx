import { ArrowUpRight, Crosshair, MoveRight } from 'lucide-react'

interface WorkspacePlaceholderProps {
  section: string
}

export function WorkspacePlaceholder({ section }: WorkspacePlaceholderProps) {
  const isWorkspace = section === 'Workspace'

  return (
    <section className="foundation-view" aria-labelledby="foundation-title">
      <div className="foundation-view__grid" aria-hidden="true" />
      <div className="orbital-instrument" aria-hidden="true">
        <span className="orbital-instrument__axis orbital-instrument__axis--x" />
        <span className="orbital-instrument__axis orbital-instrument__axis--y" />
        <span className="orbital-instrument__ring orbital-instrument__ring--one" />
        <span className="orbital-instrument__ring orbital-instrument__ring--two" />
        <span className="orbital-instrument__body" />
        <span className="orbital-instrument__satellite" />
      </div>

      <div className="foundation-view__content">
        <p className="eyebrow">
          <Crosshair aria-hidden="true" size={14} />
          {isWorkspace ? 'Application shell' : `${section} module`}
        </p>
        <h1 id="foundation-title">
          {isWorkspace ? (
            <>
              Laboratory framework
              <br />
              <span>ready for instruments.</span>
            </>
          ) : (
            <>
              {section}
              <br />
              <span>awaiting module build.</span>
            </>
          )}
        </h1>
        <p className="foundation-view__description">
          {isWorkspace
            ? 'The responsive workspace, navigation, routes, and visual system are now in place. Scientific tools will be installed one focused module at a time.'
            : `This route is connected to the application shell. The dedicated ${section.toLowerCase()} experience belongs to a later build step.`}
        </p>

        <div className="foundation-readout" aria-label="Build status">
          <div>
            <span>Current phase</span>
            <strong>01 / Shell</strong>
          </div>
          <MoveRight aria-hidden="true" size={20} />
          <div>
            <span>Next instrument</span>
            <strong>Homepage</strong>
          </div>
          <div className="foundation-readout__state">
            <span>State</span>
            <strong>Nominal</strong>
          </div>
        </div>
      </div>

      <aside className="telemetry-card" aria-label="Application shell telemetry">
        <div className="telemetry-card__header">
          <span>Foundation telemetry</span>
          <ArrowUpRight aria-hidden="true" size={15} />
        </div>
        <dl>
          <div>
            <dt>Viewport</dt>
            <dd>Responsive</dd>
          </div>
          <div>
            <dt>Navigation</dt>
            <dd>05 routes</dd>
          </div>
          <div>
            <dt>Theme</dt>
            <dd>Dark lab</dd>
          </div>
          <div>
            <dt>Input</dt>
            <dd>Keyboard ready</dd>
          </div>
        </dl>
        <div className="telemetry-card__signal" aria-hidden="true">
          {[18, 34, 24, 52, 38, 67, 43, 74, 60, 84, 63, 92].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </aside>
    </section>
  )
}

