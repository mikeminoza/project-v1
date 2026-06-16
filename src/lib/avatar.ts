const AVATAR_COLORS = [
  'bg-blue-500/15 text-blue-400',
  'bg-violet-500/15 text-violet-400',
  'bg-emerald-500/15 text-emerald-400',
  'bg-orange-500/15 text-orange-400',
  'bg-pink-500/15 text-pink-400',
  'bg-cyan-500/15 text-cyan-400',
  'bg-yellow-500/15 text-yellow-400',
]

export function getAvatar(name: string) {
  const trimmed = name.trim()
  const initials = trimmed
    ? trimmed
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'
  const color = trimmed
    ? AVATAR_COLORS[trimmed.charCodeAt(0) % AVATAR_COLORS.length]
    : 'bg-muted text-muted-foreground'
  return { initials, color }
}
