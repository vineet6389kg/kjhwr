import { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)

export function DecisionHourProvider({ children }) {
  const [hour, setHour] = useState(12) // assumed decision time (UTC) on the day before delivery
  return <Ctx.Provider value={{ hour, setHour }}>{children}</Ctx.Provider>
}

export const useDecisionHour = () => useContext(Ctx)