/**
 * Extracts up to 2 initials from a name string.
 * "Trident Academy of Technology" → "TT"  (first word + last word)
 * "Sitesh"                       → "S"   (single word → 1 letter)
 * "John Doe"                     → "JD"  (first + last)
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return '?'
  const words = name.trim().split(/\s+/)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
