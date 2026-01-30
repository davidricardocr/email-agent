import { useState, useEffect } from 'react'

function App() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    // Check backend connection
    fetch('http://localhost:8000/health')
      .then(res => res.json())
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('disconnected'))
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <h1 className="text-lg font-semibold">Email Agent</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-2 w-2 rounded-full ${
                backendStatus === 'connected' ? 'bg-green-500' :
                backendStatus === 'disconnected' ? 'bg-red-500' :
                'bg-yellow-500'
              }`} />
              <span className="text-muted-foreground">
                {backendStatus === 'connected' ? 'Connected' :
                 backendStatus === 'disconnected' ? 'Disconnected' :
                 'Checking...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-bold">Welcome to Email Agent</h2>
          <p className="mb-4 text-muted-foreground">
            Your AI-powered email assistant built with LangChain and Electron.
          </p>

          {backendStatus === 'disconnected' && (
            <div className="rounded-md border border-red-500/50 bg-red-500/10 p-4 text-red-500">
              <p className="font-semibold">Backend Not Connected</p>
              <p className="text-sm">
                Make sure the Python backend is running on http://localhost:8000
              </p>
              <code className="mt-2 block text-xs">
                cd backend && uvicorn app.main:app --reload
              </code>
            </div>
          )}

          {backendStatus === 'connected' && (
            <div className="rounded-md border border-green-500/50 bg-green-500/10 p-4 text-green-500">
              <p className="font-semibold">Backend Connected</p>
              <p className="text-sm">
                Ready to process emails with AI
              </p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-2 font-semibold">Next Steps:</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Configure your email account in settings</li>
              <li>Start monitoring your inbox</li>
              <li>Generate AI-powered email responses</li>
              <li>Refine responses with interactive chat</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
