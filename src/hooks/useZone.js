import { useState } from 'react'
export function useZone() { const [zone, setZone] = useState(null); return { zone, setZone } }
