import React, { useRef, useState, useCallback, useEffect } from 'react'
import spider from '../assets/spider.png'
import portrait from '../assets/portfolio-removebg-preview.png'

interface Props {
  radius?: number
}

export default function PortraitReveal({ radius = 75 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spiderImg = useRef<HTMLImageElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const curRef = useRef({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const rafRef = useRef<number | null>(null)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    const img = new Image()
    img.src = spider
    img.onload = () => {
      spiderImg.current = img
      // Trigger initial draw
      const canvas = canvasRef.current
      const wrap = wrapRef.current
      if (canvas && wrap) {
        const r = wrap.getBoundingClientRect()
        canvas.width = r.width
        canvas.height = r.height
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.drawImage(img, 0, 0, r.width, r.height)
      }
    }
  }, [])

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const r = wrap.getBoundingClientRect()
    canvas.width = r.width
    canvas.height = r.height
    const ctx = canvas.getContext('2d')
    if (ctx && spiderImg.current) {
      ctx.drawImage(spiderImg.current, 0, 0, r.width, r.height)
    }
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  const animate = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current
      const wrap = wrapRef.current
      if (!canvas || !wrap || !spiderImg.current) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const w = canvas.width
      const h = canvas.height

      const mouse = mouseRef.current
      const cur = curRef.current

      // Smooth elastic follow (low latency, organic)
      const lerp = 0.28
      cur.x += (mouse.x - cur.x) * lerp
      cur.y += (mouse.y - cur.y) * lerp

      const vx = mouse.x - cur.x
      const vy = mouse.y - cur.y
      const speed = Math.hypot(vx, vy)
      const dir = Math.atan2(vy, vx)

      // Redraw spider
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(spiderImg.current, 0, 0, w, h)

      // Punch organic liquid hole
      ctx.globalCompositeOperation = 'destination-out'

      ctx.beginPath()
      const N = 16
      timeRef.current += 0.06
      const t = timeRef.current
      const amp = 2.5 + Math.min(speed * 0.4, 6)

      for (let i = 0; i <= N; i++) {
        const a = (i / N) * Math.PI * 2
        // Organic ripple wave along circumference
        const wave = Math.sin(a * 5 + t) * amp + Math.cos(a * 3 - t * 1.5) * (amp * 0.5)
        let r = radius + wave

        // Stretch along motion direction for liquid trailing
        if (speed > 1) {
          const stretch = Math.min(speed * 0.02, 0.35)
          const cosD = Math.cos(a - dir)
          if (cosD > 0) r *= 1 + cosD * stretch
        }

        const x = cur.x + Math.cos(a) * r
        const y = cur.y + Math.sin(a) * r
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()

      // Soft feathered radial gradient
      const grad = ctx.createRadialGradient(cur.x, cur.y, radius * 0.3, cur.x, cur.y, radius * 1.25)
      grad.addColorStop(0, 'rgba(0,0,0,1)')
      grad.addColorStop(0.7, 'rgba(0,0,0,0.95)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fill()

      ctx.globalCompositeOperation = 'source-over'

      rafRef.current = requestAnimationFrame(animate)
    },
    [radius]
  )

  useEffect(() => {
    if (active) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const canvas = canvasRef.current
      if (canvas && spiderImg.current) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.globalCompositeOperation = 'source-over'
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(spiderImg.current, 0, 0, canvas.width, canvas.height)
        }
      }
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active, animate])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const r = wrap.getBoundingClientRect()
    mouseRef.current = { x: clientX - r.left, y: clientY - r.top }
  }, [])

  const handleEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if ('touches' in e) {
        const t = e.touches[0]
        if (t) handleMove(t.clientX, t.clientY)
      } else {
        handleMove(e.clientX, e.clientY)
      }
    },
    [handleMove]
  )

  const coverStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  }

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        touchAction: 'none',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        handleEvent(e)
        const wrap = wrapRef.current
        if (wrap) {
          const r = wrap.getBoundingClientRect()
          const x = e.clientX - r.left
          const y = e.clientY - r.top
          curRef.current = { x, y }
          mouseRef.current = { x, y }
        }
        setActive(true)
      }}
      onMouseMove={handleEvent}
      onMouseLeave={() => setActive(false)}
      onTouchStart={(e) => { setActive(true); handleEvent(e) }}
      onTouchMove={handleEvent}
      onTouchEnd={() => setActive(false)}
    >
      <img src={portrait} alt="" style={coverStyle} />
      <canvas
        ref={canvasRef}
        style={{ ...coverStyle, pointerEvents: 'none' }}
      />
    </div>
  )
}
