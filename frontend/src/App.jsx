import { useEffect, useState } from 'react'
import './index.css'
import './auth.css'
import { api } from './api'

const nav = [['dashboard', '⌂', 'Dashboard'], ['farm', '▦', 'My Farm'], ['advisory', '✦', 'Advisory'], ['disease', '⌁', 'Disease Check'], ['weather', '☼', 'Weather'], ['satellite', '◌', 'Satellite']]
const forecast = [['Today', '31°', 'Partly cloudy'], ['Sat', '30°', 'Light rain'], ['Sun', '29°', 'Cloudy'], ['Mon', '32°', 'Sunny'], ['Tue', '33°', 'Sunny']]

function Status({ children, tone = '' }) { return <span className={`status ${tone}`}><i />{children}</span> }
function Card({ children, className = '' }) { return <section className={`card ${className}`}>{children}</section> }

function LiveDataBanner() {
  const [live, setLive] = useState(null)
  useEffect(() => {
    Promise.all([api.farm(), api.weather()]).then(([farm, weather]) => setLive({ farm, weather })).catch(() => setLive(false))
  }, [])
  if (live === false) return <p className="api-warning">Backend unavailable: showing demo fallback</p>
  if (!live) return <p className="api-loading">Syncing latest field data...</p>
  return <div className="live-data"><span>LIVE API</span><b>{live.farm.name}</b><span>{live.farm.location}</span><span>{live.weather.temperature}°C · {live.weather.rainfall_probability}% rain probability</span></div>
}

function AuthScreen({ onSuccess }) {
  const [mode, setMode] = useState('register')
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    if (mode === 'register' && !name.trim()) return setError('Please enter your name.')
    if (!contact.trim()) return setError('Enter your mobile number or email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    setError('')
    try {
      const result = mode === 'register'
        ? await api.register(name.trim(), contact.trim(), password)
        : await api.login(contact.trim(), password)
      localStorage.setItem('fasalsence_user', JSON.stringify(result.user))
      onSuccess(result.user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }
  return <main className="auth-page"><div className="auth-intro"><div className="auth-brand"><span>🌱</span><b>fasalsence</b></div><p className="eyebrow">AGRICULTURE INTELLIGENCE</p><h1>Better decisions for every field.</h1><p>Understand your farm with simple weather, crop-health and advisory insights in one place.</p><div className="auth-points"><span>✓ Field-first recommendations</span><span>✓ Simple, farmer-friendly guidance</span><span>✓ Connected to your local API</span></div></div><section className="auth-card"><div className="auth-card-heading"><p className="eyebrow">WELCOME TO FASALSENCE</p><h2>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2><p>{mode === 'register' ? 'Start with your mobile number or email.' : 'Sign in to view your farm dashboard.'}</p></div><div className="auth-tabs"><button type="button" className={mode === 'register' ? 'selected' : ''} onClick={() => { setMode('register'); setError('') }}>Register</button><button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setError('') }}>Sign in</button></div><form onSubmit={submit}>{mode === 'register' && <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>}<label>Mobile number or email<input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="e.g. 9876543210 or you@example.com" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /></label>{mode === 'register' && <label className="terms"><input type="checkbox" required /> I agree to use this demo with sample data.</label>}{error && <p className="auth-error">{error}</p>}<button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Connecting...' : mode === 'register' ? 'Create account' : 'Sign in'} <span>→</span></button></form><p className="auth-demo">Connected to the local FastAPI backend. Demo data only.</p></section></main>
}

function Dashboard({ go }) {
  const [why, setWhy] = useState(false)
  const [data, setData] = useState({})
  const [apiError, setApiError] = useState('')
  useEffect(() => {
    Promise.all([api.farm(), api.weather(), api.cropHealth(), api.advisory()])
      .then(([farm, weather, cropHealth, advisory]) => setData({ farm, weather, cropHealth, advisory }))
      .catch((error) => setApiError(error.message))
  }, [])
  const farm = data.farm || { location: 'Prayagraj, Uttar Pradesh', name: 'Ravi Farm', area: 1.5, crop: 'Wheat', crop_stage: 'Vegetative', soil_type: 'Loamy' }
  const weather = data.weather || { temperature: 31, humidity: 72, rainfall_probability: 65, wind_kmh: 14 }
  const cropHealth = data.cropHealth || { current_index: 0.78, status: 'Good with mild stress' }
  const advisory = data.advisory?.recommendations?.[0]
  return <>
    <LiveDataBanner />
    <div className="page-heading"><div><p className="eyebrow">FRIDAY, 18 SEPTEMBER 2026</p><h1>Good morning, Aryan</h1><p>Here is what is happening with your field today.</p>{apiError && <p className="api-warning">Backend unavailable: showing demo fallback</p>}</div><div className="location">⌖ <span>{farm.location}</span></div></div>
    <div className="stat-grid">
      <Card><div className="card-top"><span>Crop health</span><b className="icon green-icon">↗</b></div><strong>{Math.round(cropHealth.current_index * 100)}<span>/100</span></strong><Status>{cropHealth.status}</Status></Card>
      <Card><div className="card-top"><span>Soil moisture</span><b className="icon blue-icon">◒</b></div><strong>64<span>%</span></strong><Status>Enough for today</Status></Card>
      <Card><div className="card-top"><span>Weather risk</span><b className="icon amber-icon">!</b></div><strong className="text-value">Moderate</strong><Status tone="amber">Rain expected soon</Status></Card>
      <Card><div className="card-top"><span>Next rain</span><b className="icon blue-icon">☂</b></div><strong className="text-value">Tomorrow</strong><Status>{weather.rainfall_probability}% probability</Status></Card>
    </div>
    <div className="main-grid"><Card className="advisory-card"><div className="section-label"><span className="label-icon">✦</span><span>Today&apos;s advisory</span><Status tone="amber">Action needed</Status></div><h2>Rainfall is expected in the next 24–48 hours.</h2><p className="muted">What this means for your field:</p><ul className="check-list"><li>Avoid unnecessary irrigation today.</li><li>Check field drainage before rainfall.</li><li>Monitor leaves after the rainfall period.</li></ul><div className="card-actions"><button onClick={() => go('advisory')}>View full advisory →</button><button className="text-button" onClick={() => setWhy(!why)}>{why ? 'Hide explanation' : 'Why am I seeing this?'}</button></div>{why && <div className="why-box"><b>Based on</b><span>✓ Weather forecast</span><span>✓ Soil moisture</span><span>✓ Crop type</span><span>✓ Crop health signal</span></div>}</Card><Card><div className="section-label"><span className="label-icon">⌖</span><span>Your field</span><span className="demo-tag">DEMO DATA</span></div><div className="field-map"><div className="field-shape">WHEAT<br />FIELD</div><span className="map-pin">●</span><small>Ravi Farm · 1.5 ha</small></div><div className="field-details"><span>Crop <b>Wheat</b></span><span>Stage <b>Vegetative</b></span><span>Soil <b>Loamy</b></span></div><button className="outline-button" onClick={() => go('farm')}>View farm details</button></Card></div>
    <div className="main-grid second-grid"><Card><div className="section-label"><span className="label-icon">↗</span><span>Crop health</span><button className="small-link" onClick={() => go('satellite')}>Satellite insights →</button></div><div className="health-row"><div><strong className="score">78</strong><span>/100</span><Status>Good with mild stress</Status></div><div className="mini-chart"><div className="chart-line" /><div className="chart-days"><span>1 Sep</span><span>Today</span></div></div></div><p className="note">Your vegetation health signal is slightly below its recent baseline.</p></Card><Card><div className="section-label"><span className="label-icon">☼</span><span>Weather today</span><button className="small-link" onClick={() => go('weather')}>Detailed forecast →</button></div><div className="weather-now"><div><strong>31°</strong><span>Partly cloudy</span></div><div className="weather-meta"><span>Humidity <b>72%</b></span><span>Rain <b>20%</b></span><span>Wind <b>14 km/h</b></span></div></div><div className="forecast">{forecast.map(([day, temp, label]) => <div key={day}><b>{day}</b><strong>{temp}</strong><span>{label}</span></div>)}</div></Card></div>
    <h2 className="subheading">What would you like to do?</h2><div className="quick-actions"><button onClick={() => go('disease')}><span>⌁</span><b>Check my crop</b><small>Upload a leaf photo</small></button><button onClick={() => go('satellite')}><span>▦</span><b>Analyze my field</b><small>View satellite insights</small></button><button onClick={() => setWhy(true)}><span>✦</span><b>Ask fasalsence</b><small>Get farming guidance</small></button></div>
  </>
}

function DiseaseUpload() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const chooseFile = (event) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) return setError('Please choose a JPG, PNG, or WebP image.')
    if (selected.size > 10 * 1024 * 1024) return setError('Image must be smaller than 10 MB.')
    setError('')
    setResult(null)
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }
  const analyze = async () => {
    if (!file) return setError('Choose a crop image first.')
    setLoading(true)
    setError('')
    try { setResult(await api.analyzeDisease(file)) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }
  return <div className="upload-panel"><label className="upload-box">{preview ? <img src={preview} alt="Selected crop leaf preview" /> : <><span className="upload-icon">📷</span><b>Upload crop image</b><small>JPG, PNG or WebP up to 10 MB</small></>}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} /></label><div className="upload-actions"><label className="primary-button">{file ? 'Change image' : 'Choose image'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} /></label><button className="outline-button" type="button" onClick={() => setError('Camera access is not connected in this demo.')}>Use camera</button>{file && <button className="primary-button" type="button" onClick={analyze} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze crop'}</button>}</div>{error && <p className="auth-error">{error}</p>}{result && <div className="result-box"><div><p className="eyebrow">SCREENING RESULT</p><h3>{result.possible_issue}</h3><Status tone="amber">{result.risk} risk · {result.confidence}% confidence</Status></div><b>What you can do now</b>{result.next_steps.map((step) => <span key={step}>✓ {step}</span>)}<small>{result.notice}</small></div>}</div>
}

const details = { farm: ['My Farm', 'Keep your basic field information ready for personalized guidance.', 'Ravi Farm', ['Location|Prayagraj, Uttar Pradesh', 'Crop|Wheat', 'Area|1.5 hectares', 'Crop stage|Vegetative', 'Soil type|Loamy', 'Irrigation|Canal']], advisory: ['Personalized Agro-Advisory', 'Simple recommendations based on your field, weather and crop-health signal.', 'Rain expected tomorrow', ['Weather|Delay non-essential irrigation.', 'Crop health|Inspect areas showing weaker growth.', 'Soil|Moisture is adequate for now.', 'Disease monitoring|Check leaves after rainfall.']], disease: ['Check Crop Health', 'Upload a clear photo of the affected leaf or plant.', 'AI-assisted screening', ['Choose image|JPG, PNG up to 10 MB', 'Possible issue|Wheat Leaf Rust', 'Confidence|87% · Moderate risk', 'What to do|Inspect nearby plants and monitor spread.']], weather: ['Weather & Forecast', 'A simple view of conditions that may affect your field.', '31° · Partly cloudy', ['Humidity|72%', 'Rain probability|65% tomorrow', 'Wind|14 km/h', 'Agricultural impact|Rain may reduce the need for irrigation.']], satellite: ['Satellite Crop Health', 'Understand the crop-health signal without treating it as a diagnosis.', 'Possible vegetation stress', ['Current signal|0.58', 'Recent baseline|0.71', 'Change|-18%', 'Possible reasons|Water stress, nutrient stress or crop-stage variation.']] }

function Detail({ type, go }) { const [title, intro, highlight, rows] = details[type]; return <><div className="page-heading"><div><p className="eyebrow">FASALSENCE · DEMO DATA</p><h1>{title}</h1><p>{intro}</p></div><button className="outline-button" onClick={() => go('dashboard')}>← Dashboard</button></div><Card className="detail-page"><div className="detail-highlight"><span className="label-icon">✦</span><div><p className="eyebrow">CURRENT VIEW</p><h2>{highlight}</h2></div></div>{type === 'disease' ? <DiseaseUpload /> : <div className="detail-list">{rows.map((row) => { const [label, value] = row.split('|'); return <div key={label}><span>{label}</span><b>{value}</b></div> })}</div>}{type === 'advisory' && <div className="why-box"><b>Why this recommendation?</b><span>Weather → rain expected</span><span>Soil → moisture adequate</span><span>Crop → wheat in vegetative stage</span><span>Recommendation → delay irrigation and inspect after rainfall</span></div>}{type === 'satellite' && <div className="fake-map"><span>FIELD HEALTH SIGNAL</span><b>LOW</b><b>MODERATE</b><b>HEALTHY</b></div>}</Card></> }

export default function App() { const [authenticated, setAuthenticated] = useState(() => Boolean(localStorage.getItem('fasalsence_user'))); const [page, setPage] = useState('dashboard'); const [language, setLanguage] = useState('English'); const go = (next) => setPage(next); if (!authenticated) return <AuthScreen onSuccess={() => setAuthenticated(true)} />; return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">🌱</span><span>fasal<b>sence</b><small>AGRICULTURE INTELLIGENCE</small></span></div><nav>{nav.map(([id, icon, label]) => <button className={page === id ? 'active' : ''} key={id} onClick={() => go(id)}><span>{icon}</span>{label}</button>)}</nav><div className="sidebar-note"><b>Field intelligence, made clear.</b><span>All insights are demo data until connected to live services.</span></div></aside><main className="content"><header><button className="mobile-brand" onClick={() => go('dashboard')}>fasal<b>sence</b></button><div className="header-actions"><select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language"><option>English</option><option>हिंदी</option></select><button className="notification" aria-label="Notifications">♧<i /></button><div className="profile"><span>AS</span><b>Aryan Singh<small>Farmer</small></b></div></div></header><div className="page-content">{page === 'dashboard' ? <Dashboard go={go} /> : <Detail type={page} go={go} />}</div></main><div className="mobile-nav">{nav.slice(0, 4).map(([id, icon, label]) => <button className={page === id ? 'active' : ''} key={id} onClick={() => go(id)}><span>{icon}</span>{label.split(' ')[0]}</button>)}</div></div> }
