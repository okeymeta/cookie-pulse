type Props = {
  data: number[]
  width?: number
  height?: number
  stroke?: string
  fill?: string
}

export function Sparkline({
  data,
  width = 160,
  height = 40,
  stroke = '#38bdf8',
  fill = 'rgba(56, 189, 248, 0.15)',
}: Props) {
  if (!data.length) {
    return (
      <svg width={width} height={height} aria-hidden>
        <text x={8} y={height / 2 + 4} fill="#64748b" fontSize="11">
          waiting for slots…
        </text>
      </svg>
    )
  }
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = Math.max(max - min, 1)
  const pts = data.map((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * (width - 4) + 2
    const y = height - 4 - ((v - min) / range) * (height - 8)
    return [x, y] as const
  })
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${height - 2} L${pts[0][0].toFixed(1)},${height - 2} Z`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Slot sparkline">
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
