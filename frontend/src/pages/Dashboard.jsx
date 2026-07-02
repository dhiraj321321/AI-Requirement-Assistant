import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000'

const ICONS = {
  overview: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-13Zm2 1v10h12v-10H6Zm2 2h4v2H8v-2Zm0 4h8v2H8v-2Z"/></svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a1 1 0 0 1 .7.29l4 4-1.4 1.42L13 6.41V16h-2V6.41L8.7 8.71 7.3 7.29l4-4A1 1 0 0 1 12 3Zm-7 13h2v2h10v-2h2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3Z"/></svg>
  ),
  workflow: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10a2 2 0 0 1 2 2v3h2v2h-2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H3V9h2V6a2 2 0 0 1 2-2Zm0 2v10h10V6H7Zm2 2h6v2H9V8Zm0 4h8v2H9v-2Z"/></svg>
  ),
  requirements: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 1.5V9h4.5L14 4.5ZM7 13h10v2H7v-2Zm0 4h10v2H7v-2Z"/></svg>
  ),
  'user-stories': (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Zm7-5h2v2h2v2h-2v2h-2v-2h-2v-2h2V9Z"/></svg>
  ),
  acceptance: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19.1 21 7.1l-1.4-1.4L9 16.2Z"/></svg>
  ),
  testcases: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm1 4h10V5H7v2Zm0 4h10V9H7v2Zm0 4h6v-2H7v2Z"/></svg>
  ),
  quality: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 11 4.16-.26 8-5.45 8-11V5l-8-3Zm0 4.15 5 1.87V11c0 3.89-2.53 7.94-5 8.94-2.47-1-5-5.05-5-8.94V8.02l5-1.87Zm-1 3.85h2v6h-2v-6Zm0 7h2v2h-2v-2Z"/></svg>
  ),
  traceability: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3a4 4 0 1 1-2.83 6.83l2.12-2.12A2 2 0 1 0 8 7a1.98 1.98 0 0 0-.58-1.41L5.3 4.49A4 4 0 0 1 7 3Zm10 0a4 4 0 0 1 2.83 6.83l-2.12-2.12A2 2 0 1 0 16 7a1.98 1.98 0 0 0 .58-1.41l2.12-2.12A4 4 0 0 1 17 3ZM12 10a4 4 0 0 1 4 4v1h2v6h-2v1h-8v-1H6v-6h2v-1a4 4 0 0 1 4-4Zm-2 5h4v-1a2 2 0 1 0-4 0v1Z"/></svg>
  ),
  export: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 7 8h3v5h2V8h3l-5-5Zm-7 14h14v2H5v-2Zm0-4h14v2H5v-2Z"/></svg>
  ),
  assistant: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a4 4 0 0 1 4 4v1h1.5A2.5 2.5 0 0 1 20 9.5V17a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9.5A2.5 2.5 0 0 1 6.5 7H8V6a4 4 0 0 1 4-4Zm-2 5h4V6a2 2 0 0 0-4 0v1Zm1 4h2v2h-2v-2Zm-3 4h8v2H8v-2Z"/></svg>
  )
}

const STAT_STYLE_MAP = {
  requirements: 'var(--accent-gold)',
  'user stories': 'var(--accent-cyan)',
  'acceptance criteria': 'var(--accent-lime)',
  'test cases': 'var(--accent-violet)',
  'quality findings': 'var(--accent-rose)',
  'traceability links': 'var(--accent-blue)'
}

const menuItems = [
  { id: 'overview', label: 'Overview', description: 'Check backend status and navigate to the main modules.' },
  { id: 'upload', label: 'Upload', description: 'Add a document to the assistant for analysis.' },
  { id: 'workflow', label: 'Full Workflow', description: 'Run complete pipeline from requirements to traceability.' },
  { id: 'requirements', label: 'Requirements', description: 'Extract structured requirements from your text.' },
  { id: 'user-stories', label: 'User Stories', description: 'Generate user stories from requirements.' },
  { id: 'acceptance', label: 'Acceptance Criteria', description: 'Create acceptance criteria for user stories.' },
  { id: 'testcases', label: 'Test Cases', description: 'Generate test cases from requirements.' },
  { id: 'quality', label: 'Quality Report', description: 'Evaluate quality and identify gaps.' },
  { id: 'traceability', label: 'Traceability', description: 'Build traceability matrix across all artifacts.' },
  { id: 'export', label: 'Export', description: 'Download all artifacts in JSON format.' }
]

export default function Dashboard(){
  const [activeMenu, setActiveMenu] = useState('overview')
  const [health, setHealth] = useState('Checking...')
  const [file, setFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadedText, setUploadedText] = useState('')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [requirements, setRequirements] = useState([])
  const [userStories, setUserStories] = useState([])
  const [acceptanceCriteria, setAcceptanceCriteria] = useState([])
  const [testCases, setTestCases] = useState([])
  const [qualityFindings, setQualityFindings] = useState([])
  const [traceabilityMatrix, setTraceabilityMatrix] = useState([])
  const [workflowResult, setWorkflowResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [analysisBusy, setAnalysisBusy] = useState(false)

  useEffect(() => {
    axios.get(`${API_BASE}/api/health`)
      .then(res => setHealth(JSON.stringify(res.data)))
      .catch(() => setHealth('Backend unavailable'))
  }, [])

  const logout = () => {
    localStorage.removeItem('access_token')
    window.location.href = '/'
  }

  const submitUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadStatus(`Uploaded ${res.data.filename} (${res.data.size} bytes)`)
      setUploadedFileName(res.data.filename)
      setUploadedText(res.data.parsed_text || '')
    } catch (err) {
      setUploadStatus(err?.response?.data?.detail || 'Upload failed')
      setUploadedFileName('')
      setUploadedText('')
    } finally {
      setBusy(false)
    }
  }

  const generateAnalysisFromUpload = async () => {
    if (!uploadedText.trim()) return
    setAnalysisBusy(true)
    try {
      const text = uploadedText.trim()
      const res = await axios.post(`${API_BASE}/api/features/full-workflow`, { text })
      setWorkflowResult(res.data)
      setRequirements(res.data.requirements || [])
      setUserStories(res.data.user_stories || [])
      setAcceptanceCriteria(res.data.acceptance_criteria || [])
      setTestCases(res.data.testcases || [])
      setQualityFindings(res.data.quality_findings || [])
      setTraceabilityMatrix(res.data.traceability_matrix || [])
      setUploadStatus(`Analysis complete! Generated ${res.data.requirements?.length || 0} requirement(s)`)
    } catch (err) {
      setUploadStatus(err?.response?.data?.detail || 'Analysis generation failed')
    } finally {
      setAnalysisBusy(false)
    }
  }

  const submitPrompt = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/api/llm/query`, { prompt, context: 'Use this to draft a user story or requirement summary.' })
      setResponse(res.data.response || 'No response received')
    } catch (err) {
      setResponse(err?.response?.data?.detail || 'Prompt request failed')
    } finally {
      setBusy(false)
    }
  }

  const extractRequirements = async () => {
    if (!prompt.trim()) return
    setBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/api/requirements/extract`, { text: prompt })
      setRequirements(res.data.requirements || [])
    } catch (err) {
      setRequirements([])
      setResponse(err?.response?.data?.detail || 'Requirement extraction failed')
    } finally {
      setBusy(false)
    }
  }

  const generateUserStories = async () => {
    if (!prompt.trim()) return
    setBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/api/features/user-stories`, { text: prompt })
      setUserStories(res.data.user_stories || [])
      setRequirements(res.data.requirements || [])
    } catch (err) {
      setResponse(err?.response?.data?.detail || 'User story generation failed')
    } finally {
      setBusy(false)
    }
  }

  const generateAcceptanceCriteria = async () => {
    if (!prompt.trim()) return
    setBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/api/features/acceptance-criteria`, { text: prompt })
      setAcceptanceCriteria(res.data.acceptance_criteria || [])
      setUserStories(res.data.user_stories || [])
      setRequirements(res.data.requirements || [])
    } catch (err) {
      setResponse(err?.response?.data?.detail || 'Acceptance criteria generation failed')
    } finally {
      setBusy(false)
    }
  }

  const generateTestCases = async () => {
    if (!prompt.trim()) return
    setBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/api/features/test-cases`, { text: prompt })
      setTestCases(res.data.testcases || [])
      setRequirements(res.data.requirements || [])
    } catch (err) {
      setResponse(err?.response?.data?.detail || 'Test case generation failed')
    } finally {
      setBusy(false)
    }
  }

  const evaluateQuality = async () => {
    if (!prompt.trim()) return
    setBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/api/features/quality`, { text: prompt })
      setQualityFindings(res.data.quality_findings || [])
      setRequirements(res.data.requirements || [])
    } catch (err) {
      setResponse(err?.response?.data?.detail || 'Quality evaluation failed')
    } finally {
      setBusy(false)
    }
  }

  const buildTraceability = async () => {
    if (!prompt.trim()) return
    setBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/api/features/traceability`, { text: prompt })
      setTraceabilityMatrix(res.data.traceability_matrix || [])
      setRequirements(res.data.requirements || [])
      setUserStories(res.data.user_stories || [])
      setTestCases(res.data.testcases || [])
    } catch (err) {
      setResponse(err?.response?.data?.detail || 'Traceability building failed')
    } finally {
      setBusy(false)
    }
  }

  const runFullWorkflow = async () => {
    if (!prompt.trim()) return
    setBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/api/features/full-workflow`, { text: prompt })
      setWorkflowResult(res.data)
      setRequirements(res.data.requirements || [])
      setUserStories(res.data.user_stories || [])
      setAcceptanceCriteria(res.data.acceptance_criteria || [])
      setTestCases(res.data.testcases || [])
      setQualityFindings(res.data.quality_findings || [])
      setTraceabilityMatrix(res.data.traceability_matrix || [])
    } catch (err) {
      setResponse(err?.response?.data?.detail || 'Full workflow failed')
    } finally {
      setBusy(false)
    }
  }

  const downloadJSON = () => {
    const data = {
      requirements,
      user_stories: userStories,
      acceptance_criteria: acceptanceCriteria,
      testcases: testCases,
      quality_findings: qualityFindings,
      traceability_matrix: traceabilityMatrix,
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'requirements-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const currentMenu = menuItems.find(item => item.id === activeMenu) || menuItems[0]
  const summaryCards = workflowResult ? [
    { label: 'Requirements', value: workflowResult.requirements?.length || 0 },
    { label: 'User Stories', value: workflowResult.user_stories?.length || 0 },
    { label: 'Acceptance Criteria', value: workflowResult.acceptance_criteria?.length || 0 },
    { label: 'Test Cases', value: workflowResult.testcases?.length || 0 },
    { label: 'Quality Findings', value: workflowResult.quality_findings?.length || 0 },
    { label: 'Traceability Links', value: workflowResult.traceability_matrix?.length || 0 },
  ] : []

  const renderMenuIcon = (id) => ICONS[id] || ICONS.overview

  return (
    <div className="dashboard-shell dashboard-shell--rich">
      <aside className="sidebar">
        <div className="brand-block brand-block--hero">
          <div className="brand-mark">AR</div>
          <div>
            <h2>AI Requirement Assistant</h2>
            <p>Menu-driven workspace</p>
          </div>
        </div>
        <nav className="nav-list">
          {menuItems.map(item => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="nav-icon">{renderMenuIcon(item.id)}</span>
              <span className="nav-copy">
                <span className="nav-title">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </span>
            </button>
          ))}
        </nav>
        <button className="ghost-button secondary logout-button" onClick={logout}>
          <span className="button-icon">{ICONS.export}</span>
          Logout
        </button>
      </aside>

      <main className="main-panel">
        <div className="dashboard-hero">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>{currentMenu.label}</h1>
            <p className="subtitle">{currentMenu.description}</p>
          </div>
          <div className="hero-badges">
            <span className="badge badge--glow">FastAPI</span>
            <span className="badge">React</span>
            <span className="badge badge--soft">AI Pipeline</span>
          </div>
        </div>

        <div className="status-card status-card--featured">
          <div className="status-dot" />
          <div>
            <strong>API health</strong>
            <p>{health}</p>
          </div>
        </div>

        {summaryCards.length > 0 && (
          <div className="metric-grid">
            {summaryCards.map(card => (
              <div className="metric-card" key={card.label}>
                <span className="metric-label">{card.label}</span>
                <strong className="metric-value" style={{ color: STAT_STYLE_MAP[card.label.toLowerCase()] || 'var(--accent-cyan)' }}>{card.value}</strong>
              </div>
            ))}
          </div>
        )}

        {activeMenu === 'overview' && (
          <div className="panel-grid">
            <div className="panel-card panel-card--feature">
              <div className="panel-head">
                <span className="panel-icon">{ICONS.workflow}</span>
                <h3>Quick start</h3>
              </div>
              <p>Choose a menu item from the left to upload a document, ask the assistant, or extract requirements.</p>
            </div>
            <div className="panel-card panel-card--feature">
              <div className="panel-head">
                <span className="panel-icon">{ICONS.overview}</span>
                <h3>Available actions</h3>
              </div>
              <ul>
                <li>Upload documents</li>
                <li>Generate requirement summaries</li>
                <li>Extract structured requirements</li>
              </ul>
            </div>
          </div>
        )}

        {activeMenu === 'upload' && (
          <form className="panel-card" onSubmit={submitUpload}>
            <div className="panel-head">
              <span className="panel-icon">{ICONS.upload}</span>
              <h3>Upload document</h3>
            </div>
            <div className="upload-dropzone">
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
              <p>Drop or select a document to start the analysis flow.</p>
            </div>
            <button type="submit" disabled={busy} className="primary-button">Upload</button>
            {uploadStatus && <p className="helper-text">{uploadStatus}</p>}
            {uploadedText && (
              <button type="button" onClick={generateAnalysisFromUpload} disabled={analysisBusy} className="secondary-button secondary-button--analysis">
                {analysisBusy ? <span className="spinner" aria-hidden="true" /> : <span className="button-icon">{ICONS.workflow}</span>}
                <span>{analysisBusy ? 'Generating Analysis...' : 'Generate Analysis'}</span>
              </button>
            )}
            {workflowResult && (
              <div className="response-box response-box--success">
                <strong>Analysis Complete</strong>
                <p>Your uploaded document has been processed into the full artifact set.</p>
              </div>
            )}
          </form>
        )}

        {activeMenu === 'assistant' && (
          <form className="panel-card" onSubmit={submitPrompt}>
            <div className="panel-head">
              <span className="panel-icon">{ICONS.assistant}</span>
              <h3>Ask the assistant</h3>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the requirement you want to generate..." />
            <button type="submit" disabled={busy} className="primary-button">Run</button>
            {response && <pre className="response-box">{response}</pre>}
          </form>
        )}

        {activeMenu === 'workflow' && (
          <div className="panel-card">
            <div className="panel-head">
              <span className="panel-icon">{ICONS.workflow}</span>
              <h3>Full Workflow Pipeline</h3>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Paste your document text or requirement description here..." />
            <button type="button" onClick={runFullWorkflow} disabled={busy} className="primary-button">
              {busy ? <span className="spinner" aria-hidden="true" /> : null}
              <span>{busy ? 'Running...' : 'Run Full Workflow'}</span>
            </button>
            {workflowResult && (
              <div className="response-box response-box--success">
                <strong>✓ Workflow Complete</strong>
                <p>Requirements: {workflowResult.requirements?.length || 0}</p>
                <p>User Stories: {workflowResult.user_stories?.length || 0}</p>
                <p>Acceptance Criteria: {workflowResult.acceptance_criteria?.length || 0}</p>
                <p>Test Cases: {workflowResult.testcases?.length || 0}</p>
                <p>Quality Findings: {workflowResult.quality_findings?.length || 0}</p>
                <p>Traceability Links: {workflowResult.traceability_matrix?.length || 0}</p>
              </div>
            )}
          </div>
        )}

        {activeMenu === 'requirements' && (
          <div className="panel-card">
            <div className="panel-head">
              <span className="panel-icon">{ICONS.requirements}</span>
              <h3>Extract requirements</h3>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Paste your document text or request here..." />
            <button type="button" onClick={extractRequirements} disabled={busy} className="primary-button">Extract requirements</button>
            {requirements.length > 0 && (
              <div className="response-box response-box--list">
                <strong>Structured requirements</strong>
                <ul>{requirements.map(item => <li key={item.id || item.title}>{item.title || item.description}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {activeMenu === 'user-stories' && (
          <div className="panel-card">
            <div className="panel-head">
              <span className="panel-icon">{ICONS['user-stories']}</span>
              <h3>Generate User Stories</h3>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Paste requirements here..." />
            <button type="button" onClick={generateUserStories} disabled={busy} className="primary-button">Generate User Stories</button>
            {userStories.length > 0 && (
              <div className="response-box response-box--list">
                <strong>User Stories</strong>
                <ul>{userStories.map(item => <li key={item.id}>{item.as_a} - {item.i_want}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {activeMenu === 'acceptance' && (
          <div className="panel-card">
            <div className="panel-head">
              <span className="panel-icon">{ICONS.acceptance}</span>
              <h3>Generate Acceptance Criteria</h3>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Paste requirements here..." />
            <button type="button" onClick={generateAcceptanceCriteria} disabled={busy} className="primary-button">Generate Acceptance Criteria</button>
            {acceptanceCriteria.length > 0 && (
              <div className="response-box response-box--list">
                <strong>Acceptance Criteria</strong>
                <ul>{acceptanceCriteria.map(item => <li key={item.id}>{item.criteria}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {activeMenu === 'testcases' && (
          <div className="panel-card">
            <div className="panel-head">
              <span className="panel-icon">{ICONS.testcases}</span>
              <h3>Generate Test Cases</h3>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Paste requirements here..." />
            <button type="button" onClick={generateTestCases} disabled={busy} className="primary-button">Generate Test Cases</button>
            {testCases.length > 0 && (
              <div className="response-box response-box--list">
                <strong>Test Cases</strong>
                <ul>{testCases.map(item => <li key={item.id}>{item.description}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {activeMenu === 'quality' && (
          <div className="panel-card">
            <div className="panel-head">
              <span className="panel-icon">{ICONS.quality}</span>
              <h3>Quality Evaluation</h3>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Paste requirements here..." />
            <button type="button" onClick={evaluateQuality} disabled={busy} className="primary-button">Evaluate Quality</button>
            {qualityFindings.length > 0 && (
              <div className="response-box response-box--list">
                <strong>Quality Findings</strong>
                <ul>{qualityFindings.map(item => <li key={item.id}>[{item.issue_type}] {item.detail}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {activeMenu === 'traceability' && (
          <div className="panel-card">
            <div className="panel-head">
              <span className="panel-icon">{ICONS.traceability}</span>
              <h3>Traceability Matrix</h3>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Paste requirements here..." />
            <button type="button" onClick={buildTraceability} disabled={busy} className="primary-button">Build Traceability</button>
            {traceabilityMatrix.length > 0 && (
              <div className="response-box response-box--list">
                <strong>Traceability Links</strong>
                <ul>{traceabilityMatrix.map((item, idx) => <li key={idx}>{item.requirement_id} → {item.user_story_id} → {item.testcase_id}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {activeMenu === 'export' && (
          <div className="panel-card">
            <div className="panel-head">
              <span className="panel-icon">{ICONS.export}</span>
              <h3>Export Artifacts</h3>
            </div>
            <p>Download all generated artifacts as JSON</p>
            <button type="button" onClick={downloadJSON} disabled={!requirements.length && !userStories.length} className="primary-button">Download JSON</button>
            {(requirements.length || userStories.length) && (
              <div className="response-box response-box--list">
                <strong>Export Summary</strong>
                <p>Requirements: {requirements.length}</p>
                <p>User Stories: {userStories.length}</p>
                <p>Acceptance Criteria: {acceptanceCriteria.length}</p>
                <p>Test Cases: {testCases.length}</p>
                <p>Quality Findings: {qualityFindings.length}</p>
                <p>Traceability Links: {traceabilityMatrix.length}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
