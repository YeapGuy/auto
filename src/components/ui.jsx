import React, { useId } from 'react'
import { fmtNum } from '../calc.js'

export function NumField({ label, value, onChange, suffix, step = 1, min = 0, max, note }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="inputwrap">
        <input
          id={id}
          type="number"
          value={Number.isFinite(value) ? value : ''}
          step={step}
          min={min}
          max={max}
          onChange={(e) => {
            const v = e.target.value === '' ? 0 : Number(e.target.value)
            onChange(Number.isFinite(v) ? v : 0)
          }}
        />
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
      {note && <div className="note">{note}</div>}
    </div>
  )
}

export function SelectField({ label, value, onChange, options, note }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="inputwrap">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {note && <div className="note">{note}</div>}
    </div>
  )
}

/** Číslo upraviteľné priamo vo vete, bez odskoku do pokročilých parametrov. */
export function InlineNum({ value, onChange, suffix, label, step = 1, min = 1, max }) {
  return (
    <span className="inlinenum">
      <input
        type="number"
        aria-label={label}
        value={Number.isFinite(value) ? value : ''}
        step={step}
        min={min}
        max={max}
        onChange={(e) => {
          const v = e.target.value === '' ? min : Number(e.target.value)
          onChange(Number.isFinite(v) ? Math.max(min, max ? Math.min(max, v) : v) : min)
        }}
      />
      {suffix && <span>{suffix}</span>}
    </span>
  )
}

export function Slider({ label, value, onChange, min, max, step, format }) {
  const id = useId()
  return (
    <div className="slider">
      <label htmlFor={id}>
        <span>{label}</span>
        <b>{format ? format(value) : fmtNum(value)}</b>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

export function Advanced({ title, hint, children, open = false }) {
  return (
    <details className="adv" open={open}>
      <summary>
        <span>
          {title} {hint && <small>— {hint}</small>}
        </span>
      </summary>
      <div className="fields">{children}</div>
    </details>
  )
}
