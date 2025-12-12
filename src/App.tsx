import { useState } from 'react'
import './App.css'

type FilterItem = {
  name: string
  count: number
  active?: boolean
  muted?: boolean
  disabled?: boolean
}

type Candidate = {
  id: number
  name: string
  role: string
  company: string
  tenure: string
  tenureBadge: string
  countryFlag?: string
  city?: string
  status?: string
  experience?: string
  keywords?: number
  tags?: string[]
  metrics?: string
}

type EmploymentItem = {
  title: string
  company: string
  dates: string
  order: string
  verified?: boolean
  markedWords?: string[]
}

const companies: FilterItem[] = [
  { name: 'Greystar Real Estate Partners, LLC', count: 43, active: true },
  { name: 'Hines Global Income Trust, Inc.', count: 3 },
  { name: 'JLL Digital Solutions', count: 1 },
  { name: 'Prologis, L.P.', count: 0, muted: true },
]

const titles: FilterItem[] = [
  { name: 'Business development', count: 233 },
  { name: 'C-Level', count: 0, muted: true },
  { name: 'Commercial', count: 88 },
  { name: 'Manager', count: 748, active: true },
]

const keywords: FilterItem[] = [
  { name: 'backbone model', count: 0 },
  { name: 'centralize', count: 87 },
  { name: 'offshore', count: 473, active: true },
  { name: 'local activity', count: 0, muted: true },
]

const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Robert Little',
    role: 'Owner & Director',
    company: 'FusionGrowth Consulting',
    tenure: '02/2025 - Current (0 years)',
    tenureBadge: '3m',
    status: '13/13',
    experience: '0',
    keywords: 2,
    tags: ['3m', 'E', 'N', 'B', 'V'],
  },
  {
    id: 2,
    name: 'Gerald Attia',
    role: 'Executive Chairman, Board Member',
    company: 'Cprime, Inc.',
    tenure: '01/2023 - Current (2 years)',
    tenureBadge: '6m',
    countryFlag: '🇫🇷',
    metrics: '7/7',
    experience: '0',
    keywords: 3,
    tags: ['7/7', 'V', 'N', 'B'],
  },
  {
    id: 3,
    name: 'Richard Lloyd',
    role: 'Chief Executive Officer',
    company: 'Verdance.ai',
    tenure: '08/2022 - Current (3 years)',
    tenureBadge: '3m',
    countryFlag: '🇺🇸',
    metrics: '75/75',
    experience: '0',
    keywords: 5,
    tags: ['75/75', '3m', 'V', 'N', 'B'],
  },
  {
    id: 4,
    name: 'Sandeep Sabharwal',
    role: 'Managing Partner and Board Member',
    company: 'Impact Advisors LLC',
    tenure: '02/2022 - Current (3 years)',
    tenureBadge: '3m',
    countryFlag: '🇺🇸',
    metrics: '59/59',
    experience: '0',
    keywords: 3,
    tags: ['59/59', '3m', 'V', 'N', 'B'],
  },
  {
    id: 5,
    name: 'Roy Nasr',
    role: 'Founding Partner & Chief Executive Officer',
    company: 'RGN Group',
    tenure: '01/2021 - Current (4 years)',
    tenureBadge: '3m',
    countryFlag: '🇦🇪',
    metrics: '20/20',
    experience: '0',
    keywords: 4,
    tags: ['20/20', '3m', 'V', 'N', 'B'],
  },
]

const employment: EmploymentItem[] = [
  {
    title: 'Owner',
    company: 'Digital Transformation Solutions, LLC',
    dates: '05/2014 - Current (11 years)',
    order: '1',
    verified: true,
  },
  {
    title: 'Principal Consultant',
    company: 'AG Consulting',
    dates: '05/2014 - Current (11 years)',
    order: '2',
    markedWords: ['Principal Consultant'],
  },
  {
    title: 'Chief Technology Officer',
    company: 'CSC ServiceWorks, Inc.',
    dates: '09/2024 - Current (1 years)',
    order: '3',
  },
  {
    title: 'Senior Managing Director, Chief Technology Officer',
    company: 'AG Consulting',
    dates: '09/2020 - 06/2023 (2 years)',
    order: '4',
  },
  {
    title: 'EVP Chief Technology Officer',
    company: 'SuperValu, Inc.',
    dates: '05/2016 - 09/2020 (4 years)',
    order: '5',
  },
]

const renderTitleWithMarkedWords = (title: string, markedWords?: string[]) => {
  if (!markedWords || markedWords.length === 0) {
    return <span>{title}</span>
  }

  const parts: (string | JSX.Element)[] = []
  let lastIndex = 0
  let currentText = title

  markedWords.forEach((marked, idx) => {
    const index = currentText.indexOf(marked)
    if (index !== -1) {
      // Add text before marked word
      if (index > lastIndex) {
        parts.push(<span key={`before-${idx}`}>{currentText.substring(lastIndex, index)}</span>)
      }
      // Add marked word in bold
      parts.push(
        <strong key={`marked-${idx}`} className="employment-highlight">
          {marked}
        </strong>,
      )
      lastIndex = index + marked.length
    }
  })

  // Add remaining text after last marked word
  if (lastIndex < currentText.length) {
    parts.push(<span key="after">{currentText.substring(lastIndex)}</span>)
  }

  return <>{parts.length > 0 ? parts : <span>{title}</span>}</>
}

const statusFilters = [
  { label: 'Top', count: 19, tone: 'green', active: true },
  { label: 'Mid', count: 176, tone: 'blue' },
  { label: 'Low', count: 242, tone: 'gray' },
  { label: 'N/A', count: 69, tone: 'gray' },
]

const statusIcons = [
  { icon: 'calendar_today', count: 491 },
  { icon: 'sports_soccer', count: 16 },
  { icon: 'stacked_line_chart', count: 40 },
  { icon: 'science', count: 0 },
  { icon: 'shield', count: 894, accent: 'amber' },
  { icon: 'mail', count: 0 },
  { icon: 'bookmark_border', count: 0 },
  { icon: 'edit_square', count: 0 },
]

const Icon = ({ name, tone = 'default' }: { name: string; tone?: 'default' | 'muted' }) => (
  <span className={`icon material-symbols-rounded ${tone === 'muted' ? 'icon-muted' : ''}`}>{name}</span>
)

const Badge = ({ label, tone = 'gray' }: { label: string; tone?: 'green' | 'blue' | 'gray' | 'orange' }) => (
  <span className={`badge badge-${tone}`}>{label}</span>
)

const tenureTone = (badge?: string) => {
  if (!badge) return 'blue'
  const value = parseInt(badge, 10)
  if (Number.isNaN(value)) return 'blue'
  if (value <= 3) return 'green'
  if (value <= 6) return 'teal'
  return 'orange'
}

const FilterList = ({ title, items }: { title: string; items: FilterItem[] }) => (
  <div className="filter-section">
    <div className="filter-title-row">
      <span className="section-label">{title}</span>
      <span className="preset-tag">Presets</span>
    </div>
    <div className="filter-items">
      {items.map((item) => (
        <div
          key={item.name}
          className={`filter-chip ${item.active ? 'active' : ''} ${item.muted ? 'muted' : ''} ${item.disabled ? 'disabled' : ''}`}
        >
          <span className="indicator-dot" />
          <span>{item.name}</span>
          <span className="chip-count">({item.count})</span>
        </div>
      ))}
    </div>
  </div>
)

const CandidateCard = ({
  person,
  selected,
  onSelect,
}: {
  person: Candidate
  selected: boolean
  onSelect: (id: number) => void
}) => (
  <div className={`candidate-card ${selected ? 'selected' : ''}`}>
    <div className="candidate-main">
      <div className={`avatar avatar-${tenureTone(person.tenureBadge)}`}>{person.tenureBadge || person.name.split(' ')[0][0]}</div>
      <div className="candidate-info">
        <div className="candidate-name-row">
          <div className="name-role">
            <div className="name-line">
              <span className="candidate-name">{person.name}</span>
              {person.tenureBadge && <Badge label={person.tenureBadge} tone="green" />}
              {person.countryFlag && <span className="flag">{person.countryFlag}</span>}
            </div>
            <div className="role-line">{person.role}</div>
          </div>
          <div className="score-group">
            {person.metrics && <Badge label={person.metrics} tone="blue" />}
            {person.status && <Badge label={person.status} tone="blue" />}
          </div>
        </div>
        <div className="candidate-sub">
          <span className="company">{person.company}</span>
          <span className="muted-text">{person.tenure}</span>
        </div>
        <div className="candidate-tags">
          {(person.tags || []).map((tag) => (
            <Badge key={tag} label={tag} tone={tag.includes('/') ? 'blue' : 'green'} />
          ))}
          {typeof person.experience !== 'undefined' && (
            <span className="metric muted-text">Exp: {person.experience}</span>
          )}
          {typeof person.keywords !== 'undefined' && <span className="metric muted-text">Kwd: {person.keywords}</span>}
        </div>
      </div>
    </div>
    <div className="card-actions">
      <button className={`action-icon ${selected ? 'active' : ''}`} type="button" onClick={() => onSelect(person.id)} aria-label="Select">
        <Icon name={selected ? 'check_circle' : 'radio_button_unchecked'} />
      </button>
      <button className="action-icon" type="button" aria-label="Bookmark">
        <Icon name="bookmark_add" />
      </button>
      <button className="action-icon" type="button" aria-label="Message">
        <Icon name="mail" />
      </button>
    </div>
  </div>
)

const DetailTag = ({ label }: { label: string }) => <span className="detail-tag">{label}</span>

const App = () => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  return (
    <div className="app-shell">
      <aside className="nav-rail">
        <div className="nav-logo">A</div>
        <div className="nav-app">ERM Staff App</div>
        <div className="nav-items">
          {['view_cozy', 'search', 'folder', 'notifications', 'mail', 'settings'].map((icon) => (
            <span key={icon} className="nav-icon">
              <Icon name={icon} />
            </span>
          ))}
        </div>
      </aside>

      <main className="workspace">
        <header className="page-header">
          <div>
            <div className="page-title">Real Estate Efficiency Diagnostic</div>
            <div className="page-meta">
              <Badge label="10190387" tone="green" />
              <Badge label="1" tone="blue" />
              <Badge label="0" tone="gray" />
              <span className="link">Dummy Contact</span>
            </div>
          </div>
          <div className="header-actions">
            <span className="small-link">View</span>
            <span className="small-link">Evaluate</span>
            <button className="primary-btn">
              <Icon name="add" />
            </button>
          </div>
        </header>

        <div className="panels">
          <aside className="filters-panel">
            <div className="filters-header">
              <div className="section-label">Developments</div>
              <div className="muted-text">Companies (4)</div>
            </div>
            <div className="search-row">
              <span className="section-label">Search &amp; Filtering</span>
              <span className="muted-text">Clear filters</span>
            </div>

            <FilterList title="Companies" items={companies} />
            <FilterList title="Title" items={titles} />
            <FilterList title="Keywords" items={keywords} />
          </aside>

          <section className="list-panel">
            <div className="status-strip">
              <div className="status-toggle">
                <div className="toggle-thumb" />
              </div>
              <div className="status-icons">
                {statusIcons.map((item) => (
                  <div key={item.icon} className={`status-icon ${item.accent === 'amber' ? 'accent-amber' : ''}`}>
                    <Icon name={item.icon} />
                    <span className="status-count">{item.count}</span>
                    <span className="status-underline" />
                  </div>
                ))}
              </div>
              <Icon name="more_vert" tone="muted" />
            </div>

            <div className="list-header">
              <div className="list-tabs">
                <Badge label="20 – 219 – 727" tone="blue" />
                {statusFilters.map((f) => (
                  <div key={f.label} className={`pill ${f.active ? 'pill-active' : ''} tone-${f.tone}`}>
                    <span className="pill-label">{f.label}</span>
                    <span className="pill-count">{f.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="candidate-list">
              {candidates.map((person) => (
                <CandidateCard
                  key={person.id}
                  person={person}
                  selected={selectedIds.has(person.id)}
                  onSelect={(id) => {
                    setSelectedIds((prev) => {
                      const next = new Set(prev)
                      if (next.has(id)) {
                        next.delete(id)
                      } else {
                        next.add(id)
                      }
                      return next
                    })
                  }}
                />
              ))}
            </div>
          </section>

          <aside className="detail-panel">
            <div className="profile-header">
              <div>
                <div className="profile-name">Andrei Girenkov</div>
                <div className="muted-text">$475/h • 23 • Id 2347178</div>
              </div>
              <div className="profile-actions">
                <button className="icon-btn">
                  <Icon name="link" />
                </button>
                <button className="icon-btn">
                  <Icon name="mail" />
                </button>
                <button className="icon-btn">
                  <Icon name="more_vert" />
                </button>
              </div>
            </div>
            <div className="muted-text">Digital Transformation Solutions, LLC</div>

            <div className="detail-section">
              <div className="section-label">Matched</div>
              <div className="detail-tags">
                <DetailTag label="Employment (1)" />
                <DetailTag label="Greystar Real Estate Partners, LLC" />
              </div>
              <div className="detail-tags">
                {['Keywords (3)', 'support', 'structure', 'offshore'].map((tag) => (
                  <DetailTag key={tag} label={tag} />
                ))}
              </div>
              <div className="detail-tags muted-text">
                {['Emp.', 'MNotes', 'VQAs', 'Bio', 'Tags', 'Notes', 'INotes'].map((tag) => (
                  <DetailTag key={tag} label={tag} />
                ))}
              </div>
            </div>

            <div className="detail-section">
              <div className="section-label">Employment</div>
              <div className="verified-row muted-text">Confirmed on Sep 24, 2025</div>
              <div className="employment-list">
                {employment.map((item) => (
                  <div key={item.order} className="employment-item">
                    <div className="employment-order">{item.order}</div>
                    <div>
                      <div className="employment-title">{renderTitleWithMarkedWords(item.title, item.markedWords)}</div>
                      <div className="employment-company">{item.company}</div>
                      <div className="muted-text">{item.dates}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default App
