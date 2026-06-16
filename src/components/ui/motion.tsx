'use client'

import { motion, type HTMLMotionProps } from 'motion/react'

const springTransition = { type: 'spring', stiffness: 80, damping: 20 } as const

// Above-the-fold: triggers on mount
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ ...springTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Below-the-fold: triggers when entering viewport
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...springTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container — staggers direct children on scroll
export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Item inside a Stagger — spring fade-up with subtle scale
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, filter: 'blur(6px)', scale: 0.97 },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
      }}
      transition={springTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
