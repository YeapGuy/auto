import React from 'react'

// Jednoduché linkové ikony, 20×20, dedia farbu textu.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function IconBus(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3" width="13" height="11" rx="1.6" />
      <path d="M3.5 8.5h13M10 3v5.5" />
      <path d="M6 14v1.8M14 14v1.8" />
      <circle cx="6.6" cy="11.4" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="13.4" cy="11.4" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconTrain(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 13V6.2C5 4.4 7.2 3.4 10 3.4s5 1 5 2.8V13a1.6 1.6 0 0 1-1.6 1.6H6.6A1.6 1.6 0 0 1 5 13Z" />
      <path d="M5 8.4h10" />
      <circle cx="7.4" cy="11.6" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="12.6" cy="11.6" r="0.75" fill="currentColor" stroke="none" />
      <path d="M7.4 14.6 5.8 17M12.6 14.6 14.2 17" />
    </svg>
  )
}

// Prímestský autobus. Od mestského ho odlišuje otvorená cesta pod kolesami,
// od diaľkového to, že je to stále linkový autobus so zastávkami.
export function IconRegBus(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.2" y="2.8" width="13.6" height="9.8" rx="2" />
      <path d="M3.2 6.8h13.6" />
      <path d="M6.4 12.6v1.5M13.6 12.6v1.5" />
      <circle cx="6.4" cy="10" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="13.6" cy="10" r="0.7" fill="currentColor" stroke="none" />
      <path d="M2 16.6h4.4M8.8 16.6h2.4M13.6 16.6H18" />
    </svg>
  )
}

export function IconCoach(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12.4V7.2c0-.8.6-1.4 1.4-1.4h9.3l3.4 3v3.6" />
      <path d="M2.5 9.2h11.6M8.4 5.8v3.4" />
      <circle cx="6" cy="13.6" r="1.5" />
      <circle cx="14" cy="13.6" r="1.5" />
      <path d="M7.5 13.6h5" />
    </svg>
  )
}

export function IconBike(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="5" cy="13" r="3.2" />
      <circle cx="15" cy="13" r="3.2" />
      <path d="m5 13 3.4-5.6h4.2L15 13M8.4 7.4h3.4M11.4 7.4 12.9 4.6h1.6" />
    </svg>
  )
}

export function IconTaxi(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2.6 13.2v-2.4l1.7-3.6h11.4l1.7 3.6v2.4" />
      <path d="M2.6 10.8h14.8" />
      <circle cx="6" cy="13.4" r="1.4" />
      <circle cx="14" cy="13.4" r="1.4" />
      <path d="M8 4.2h4v3H8z" />
    </svg>
  )
}

export function IconCar(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2.6 13.2v-2.4l2-4.2h10.8l2 4.2v2.4" />
      <path d="M4.2 10.8h11.6" />
      <circle cx="6.2" cy="13.4" r="1.4" />
      <circle cx="13.8" cy="13.4" r="1.4" />
    </svg>
  )
}
