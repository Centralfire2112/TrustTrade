import { useState, useEffect } from 'react'

const KEY = 'tt_history_v1'

export function useHistory(logsEnabled = true) {
  const [history, setHistory] = useState(() => {
    if (!logsEnabled) return []
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    if (!logsEnabled) return
    localStorage.setItem(KEY, JSON.stringify(history))
  }, [history, logsEnabled])

  const addEntry = (form, result) => {
    if (!logsEnabled) return
    setHistory(prev => [{
      id: Date.now(),
      date: new Date().toISOString(),
      amount: parseFloat(form.amount) || 0,
      contactType: form.contactType,
      channel: form.channel,
      urgency: form.urgency,
      prepayment: parseFloat(form.prepayment) || 0,
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      recommendation: result.recommendation,
      reasons: result.reasons,
    }, ...prev].slice(0, 100))
  }

  const removeEntry = (id) => {
    if (!logsEnabled) return
    setHistory(prev => prev.filter(e => e.id !== id))
  }
  const clearHistory = () => {
    if (!logsEnabled) return
    setHistory([])
  }

  return { history, addEntry, removeEntry, clearHistory }
}
