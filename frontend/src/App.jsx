import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import SKUWorkflow from './components/SKUWorkflow'
import Reports from './components/Reports'
import { fetchAllRecords } from './services/api'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [wasteRecords, setWasteRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all records from the backend
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAllRecords()
      setWasteRecords(data)
    } catch (err) {
      console.error('Failed to fetch records:', err)
      setError('Could not connect to the server. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  // Called after a new record is successfully saved to the backend
  const handleRecordAdded = () => {
    loadRecords()
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard records={wasteRecords} loading={loading} error={error} onRetry={loadRecords} />
      case 'sku':
        return <SKUWorkflow onRecordAdded={handleRecordAdded} />
      case 'reports':
        return <Reports records={wasteRecords} loading={loading} />
      default:
        return <Dashboard records={wasteRecords} loading={loading} error={error} onRetry={loadRecords} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface-alt)]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1400px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App
