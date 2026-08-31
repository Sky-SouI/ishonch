import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Button, SectionLabel } from '../components/ui'
import { DemoMark, useDemoNotice } from '../components/Demo'
import { wizardDocs } from '../data/seed'
import type { DocState } from '../data/seed'
import { fill, t } from '../i18n/ru'
import s from './CreateScreen.module.css'

const TOTAL = t.create.steps.length

/*
 * Шестишаговый мастер. В макете детально прорисован шаг 5 «Документы и
 * проверка» — остальные шаги достроены в том же языке: одна мысль на экран,
 * подводка объясняет, зачем это донору, а не «заполните поля».
 */
export function CreateScreen() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const notice = useDemoNotice()

  const [form, setForm] = useState({
    who: 0,
    beneficiary: '',
    age: '',
    relation: '',
    title: '',
    story: '',
    goal: '',
    basis: '',
    deadline: '',
    ifNotCollected: 0,
    payee: 0,
    consent: false,
  })

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  if (done) {
    return (
      <main className={s.screen}>
        <div className={s.doneBox}>
          <SectionLabel>{t.create.steps[5].toLowerCase()}</SectionLabel>
          <h1 className={s.doneTitle}>{t.create.step6.done}</h1>
          <p className={s.doneBody}>
            <DemoMark /> {t.create.step6.doneBody}
          </p>
          <Button to="/" variant="outline" size="md">
            Вернуться в каталог
          </Button>
        </div>
      </main>
    )
  }

  const isLast = step === TOTAL - 1

  return (
    <main className={s.screen}>
      <header className={s.header}>
        <div className={s.headerTop}>
          <span className={s.stepTitle}>{t.create.steps[step]}</span>
          <span className={`mono ${s.counter}`}>
            {fill(t.create.counter, { step: step + 1, total: TOTAL })}
          </span>
        </div>
        <div className={s.progress} aria-hidden="true">
          {t.create.steps.map((_, i) => (
            <span
              key={i}
              className={[s.seg, i < step ? s.segDone : '', i === step ? s.segOn : '']
                .filter(Boolean)
                .join(' ')}
            />
          ))}
        </div>
      </header>

      <div className={s.body}>
        {step === 0 && <Step1 form={form} set={set} />}
        {step === 1 && <Step2 form={form} set={set} onAttach={() => notice()} />}
        {step === 2 && <Step3 form={form} set={set} />}
        {step === 3 && <Step4 form={form} set={set} />}
        {step === 4 && <Step5 form={form} set={set} onMyId={() => notice()} onAttach={() => notice()} />}
        {step === 5 && <Step6 form={form} set={set} />}
      </div>

      <footer className={s.footer}>
        <Button
          full
          onClick={() => (isLast ? setDone(true) : setStep((v) => v + 1))}
          disabled={isLast && !form.consent}
        >
          {isLast ? t.create.publish : fill(t.create.nextTo, { step: t.create.steps[step + 1].toLowerCase() })}
        </Button>
        <div className={s.footerRow}>
          {step > 0 ? (
            <button type="button" className={s.footerLink} onClick={() => setStep((v) => v - 1)}>
              ← {t.common.back}
            </button>
          ) : (
            <Link to="/" className={s.footerLink}>
              {t.common.saveAndReturn}
            </Link>
          )}
          <span className={s.footerLink}>{t.common.needHelp}</span>
        </div>
      </footer>
    </main>
  )
}

/* ------------------------------------------------------------- примитивы */

type Form = {
  who: number
  beneficiary: string
  age: string
  relation: string
  title: string
  story: string
  goal: string
  basis: string
  deadline: string
  ifNotCollected: number
  payee: number
  consent: boolean
}

type Setter = <K extends keyof Form>(key: K, value: Form[K]) => void

function Lead({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className={s.lead}>
      <h1 className={s.heading}>{heading}</h1>
      <p className={s.leadText}>{children}</p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  mono = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  multiline?: boolean
  mono?: boolean
}) {
  return (
    <label className={s.field}>
      <span className={s.fieldLabel}>{label}</span>
      {multiline ? (
        <textarea
          className={s.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
        />
      ) : (
        <input
          className={mono ? `${s.input} mono` : s.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  )
}

function RadioGroup({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { name: string; hint: string }[]
  value: number
  onChange: (i: number) => void
  label?: string
}) {
  return (
    <div className={s.radioBlock}>
      {label && <SectionLabel>{label}</SectionLabel>}
      <div className={s.radios} role="radiogroup" aria-label={label ?? 'Выбор'}>
        {options.map((option, i) => (
          <button
            key={option.name}
            type="button"
            role="radio"
            aria-checked={value === i}
            className={s.radio}
            onClick={() => onChange(i)}
          >
            <span className={s.radioText}>
              <span className={s.radioName}>{option.name}</span>
              <span className={s.radioHint}>{option.hint}</span>
            </span>
            <span className={value === i ? `${s.dot} ${s.dotOn}` : s.dot} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- шаги */

function Step1({ form, set }: { form: Form; set: Setter }) {
  const c = t.create.step1
  return (
    <>
      <Lead heading={c.heading}>{c.lead}</Lead>
      <RadioGroup options={c.options} value={form.who} onChange={(i) => set('who', i)} label={c.whoLabel} />
      <Field label={c.nameLabel} value={form.beneficiary} onChange={(v) => set('beneficiary', v)} placeholder={c.namePlaceholder} />
      <div className={s.fieldRow}>
        <Field label={c.ageLabel} value={form.age} onChange={(v) => set('age', v)} placeholder={c.agePlaceholder} mono />
        <Field label={c.relationLabel} value={form.relation} onChange={(v) => set('relation', v)} placeholder={c.relationPlaceholder} />
      </div>
    </>
  )
}

function Step2({ form, set, onAttach }: { form: Form; set: Setter; onAttach: () => void }) {
  const c = t.create.step2
  return (
    <>
      <Lead heading={c.heading}>{c.lead}</Lead>
      <Field label={c.titleLabel} value={form.title} onChange={(v) => set('title', v)} placeholder={c.titlePlaceholder} />
      <Field label={c.storyLabel} value={form.story} onChange={(v) => set('story', v)} placeholder={c.storyPlaceholder} multiline />
      <div className={s.photoBox}>
        <SectionLabel right={<DemoMark />}>{c.photoLabel}</SectionLabel>
        <p className={s.hint}>{c.photoHint}</p>
        <Button variant="quiet" size="sm" onClick={onAttach}>
          {c.photoAction}
        </Button>
      </div>
    </>
  )
}

function Step3({ form, set }: { form: Form; set: Setter }) {
  const c = t.create.step3
  return (
    <>
      <Lead heading={c.heading}>{c.lead}</Lead>
      <Field label={c.goalLabel} value={form.goal} onChange={(v) => set('goal', v)} placeholder={c.goalPlaceholder} mono />
      <Field label={c.basisLabel} value={form.basis} onChange={(v) => set('basis', v)} placeholder={c.basisPlaceholder} />
      <p className={s.calloutNote}>{c.note}</p>
    </>
  )
}

function Step4({ form, set }: { form: Form; set: Setter }) {
  const c = t.create.step4
  return (
    <>
      <Lead heading={c.heading}>{c.lead}</Lead>
      <Field label={c.deadlineLabel} value={form.deadline} onChange={(v) => set('deadline', v)} placeholder={c.deadlinePlaceholder} mono />
      <RadioGroup
        options={c.options}
        value={form.ifNotCollected}
        onChange={(i) => set('ifNotCollected', i)}
        label={c.ifNotCollected}
      />
    </>
  )
}

function Step5({
  form,
  set,
  onMyId,
  onAttach,
}: {
  form: Form
  set: Setter
  onMyId: () => void
  onAttach: () => void
}) {
  const c = t.create.step5
  const badge = (state: DocState) =>
    state === 'готово' ? c.badges.ready : state === 'нужно' ? c.badges.need : c.badges.checking

  return (
    <>
      <Lead heading={c.heading}>{c.lead}</Lead>

      <div className={s.docs}>
        {wizardDocs.map((doc) => (
          <button
            key={doc.name}
            type="button"
            className={doc.state === 'нужно' ? `${s.doc} ${s.docNeed}` : doc.state === 'готово' ? `${s.doc} ${s.docDone}` : s.doc}
            onClick={onAttach}
          >
            <span className={s.docText}>
              <span className={s.docName}>{doc.name}</span>
              <span className={s.docHint}>{doc.hint}</span>
            </span>
            <span
              className={[
                s.badge,
                doc.state === 'нужно' ? s.badgeNeed : '',
                doc.state === 'готово' ? s.badgeDone : s.badgeChecking,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {badge(doc.state)}
            </span>
          </button>
        ))}
      </div>

      <div className={s.myid}>
        <span className={s.myidTitle}>
          {c.myidTitle} <DemoMark />
        </span>
        <p className={s.myidBody}>{c.myidBody}</p>
        <Button variant="ink" size="sm" full onClick={onMyId}>
          {c.myidAction}
        </Button>
      </div>

      <RadioGroup
        options={c.payeeOptions}
        value={form.payee}
        onChange={(i) => set('payee', i)}
        label={c.payeeLabel}
      />
    </>
  )
}

function Step6({ form, set }: { form: Form; set: Setter }) {
  const c = t.create.step6
  return (
    <>
      <Lead heading={c.heading}>{c.lead}</Lead>

      <div className={s.checklist}>
        <SectionLabel>{c.checklistLabel}</SectionLabel>
        <ul className={s.checkItems}>
          {c.checklist.map((item) => (
            <li key={item} className={s.checkItem}>
              <span className={s.checkGlyph} aria-hidden="true">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className={s.consent}
        onClick={() => set('consent', !form.consent)}
        aria-pressed={form.consent}
      >
        <span className={form.consent ? `${s.box} ${s.boxOn}` : s.box} aria-hidden="true">
          {form.consent ? '✓' : ''}
        </span>
        <span className={s.consentText}>{c.consentLabel}</span>
      </button>

      <div className={s.after}>
        <SectionLabel>{c.afterLabel}</SectionLabel>
        <ol className={s.afterList}>
          {c.after.map((item, i) => (
            <li key={item} className={s.afterItem}>
              <span className={`mono ${s.afterNum}`}>{i + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
