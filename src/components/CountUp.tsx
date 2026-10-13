import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'

type Props = {
  value: number
  prefix?: string
  className?: string
}

const format = (n: number, prefix: string) => prefix + Math.round(n).toLocaleString('pt-BR')

/** Conta de 0 até o valor quando entra na tela. Reserva a largura final para o layout não pular. */
export function CountUp({ value, prefix = '', className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const count = useMotionValue(reduce ? value : 0)
  const text = useTransform(count, (n) => format(n, prefix))

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, reduce, value, count])

  return (
    <span className={`relative inline-block ${className}`}>
      <span aria-hidden className="invisible">
        {format(value, prefix)}
      </span>
      <motion.span ref={ref} aria-hidden className="absolute inset-0">
        {text}
      </motion.span>
      <span className="sr-only">{format(value, prefix)}</span>
    </span>
  )
}
