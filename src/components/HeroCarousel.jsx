import { useEffect, useRef, useState } from 'react'

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

// Slides = images + a clone of the first image, so the carousel can slide
// past the "last" frame straight into a visual match of the first frame —
// then snap back to index 0 with transitions off, for a seamless loop.
const SLIDES = [...IMAGES, IMAGES[0]]

export default function HeroCarousel() {
  const [index, setIndex]     = useState(0)
  const [animate, setAnimate] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAnimate(true)
      setIndex((i) => i + 1)
    }, SLIDE_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [])

  function handleTransitionEnd() {
    if (index === SLIDES.length - 1) {
      setAnimate(false)
      setIndex(0)
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`flex h-full w-full ${animate ? 'transition-transform duration-1000 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
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
