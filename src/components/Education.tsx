import { GraduationCapIcon } from '@phosphor-icons/react'
import { education, interests, languages, skills } from '../data/profile'
import { chip, heading, sectionY, wrap } from '../lib/ui'
import { Reveal } from './Reveal'

export function Education() {
  return (
    <section id="formacao" className={sectionY}>
      <div className={wrap}>
        <Reveal>
          <h2 className={heading}>Formação e competências</h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="grid gap-10 rounded-3xl bg-surface p-6 sm:p-10 md:grid-cols-3 md:gap-8">
            <div>
              <GraduationCapIcon size={32} className="text-accent" aria-hidden />
              <p className="mt-4 text-xl font-semibold leading-snug">{education.school}</p>
              <p className="mt-2 text-muted">{education.place}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{education.note}</p>
            </div>

            <ul className="grid content-start gap-6">
              {education.courses.map((c) => (
                <li key={c.name}>
                  <p className="font-semibold">{c.name}</p>
                  <p className="mt-1 text-sm text-muted">{c.when}</p>
                </li>
              ))}
            </ul>

            <div className="grid content-start gap-6">
              <div>
                <p className="font-semibold">Idiomas</p>
                <ul className="mt-2 grid gap-1 text-muted">
                  {languages.map((l) => (
                    <li key={l.name}>
                      {l.name}: {l.level}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Fora do trabalho</p>
                <p className="mt-2 leading-relaxed text-muted">{interests}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal
              key={group.group}
              delay={i * 0.05}
              className={group.group === 'Tecnologia' ? 'sm:col-span-2 lg:col-span-2' : ''}
            >
              <h3 className="text-lg font-semibold">{group.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className={chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
