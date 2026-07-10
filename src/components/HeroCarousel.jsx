import { useEffect, useState } from 'react'

const IMAGES = [
  '/beach plot.jpg',
  '/hero.jpg',
  '/hh.jpg',
  '/house.jpg',
  '/villa.jpg',
  '/villa2.jpg',
  '/runda.jpg',
  '/beach house.jpg',
  '/farm land.jpg',
  '/ranch land.jpg',
  '/american stylre.jpg',
].map(encodeURI)

const SLIDE_INTERVAL = 4500
const TRANSITION_MS  = 1000

// Slides = images + a clone of the first image, so the carousel can slide
// past the "last" frame straight into a visual match of the first frame —
// then snap back to index 0 with transitions off, for a seamless loop.
const SLIDES = [...IMAGES, IMAGES[0]]

export default function HeroCarousel() {
  const [index, setIndex]     = useState(0)
  const [animate, setAnimate] = useState(true)

  // Advance one slide every SLIDE_INTERVAL, forever.
  useEffect(() => {
    const id = setInterval(() => {
      setAnimate(true)
      setIndex((i) => i + 1)
    }, SLIDE_INTERVAL)
    return () => clearInterval(id)
  }, [])

  // Once we've slid onto the cloned final frame, snap back to index 0
  // (transitions off) after the slide transition has had time to finish.
  // Driven by a plain timer rather than the CSS transitionend event so the
  // loop can't get stuck if transitions are disabled/reduced or the tab
  // was backgrounded when the transition would have completed.
  useEffect(() => {
    if (index !== SLIDES.length - 1) return
    const id = setTimeout(() => {
      setAnimate(false)
      setIndex(0)
    }, TRANSITION_MS)
    return () => clearTimeout(id)
  }, [index])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`flex h-full w-full ${animate ? 'transition-transform duration-1000 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((src, i) => (
          <div
            key={i}
            className="w-full h-full shrink-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>
    </div>
  )
}
