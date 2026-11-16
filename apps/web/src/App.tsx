import { useState } from "react";
import {
  Activity, AudioLines, Bot, BrainCircuit, ChevronDown, CircleHelp,
  Command, Database, FileText, Github, Globe2, Mail, Menu, Plus,
  Search, Send, Settings2, ShieldCheck, Sparkles, Youtube,
} from "lucide-react";

const modules = [
  { name: "AI Core", detail: "Model intelligence", icon: BrainCircuit, status: "Foundation" },
  { name: "Memory", detail: "User-controlled context", icon: Database, status: "Planned" },
  { name: "Gmail", detail: "Email workspace", icon: Mail, status: "Connect later" },
  { name: "YouTube", detail: "Video discovery", icon: Youtube, status: "Planned" },
  { name: "Browser", detail: "Web research", icon: Globe2, status: "Planned" },
  { name: "Developer", detail: "Code intelligence", icon: Github, status: "Planned" },
  { name: "Files", detail: "Document intelligence", icon: FileText, status: "Planned" },
  { name: "Voice", detail: "Arabic & English audio", icon: AudioLines, status: "Planned" },
];

export default function App() {
  const [message, setMessage] = useState("");
  const [active, setActive] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);

  function submitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    // Chat transport will be wired to the authenticated API in the AI Core phase.
    setMessage("");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <a className="brand" href="#" aria-label="SENTRA home">
          <span className="brand-mark"><Activity size={21} /></span>
          <span><strong>SENTRA</strong><small>PERSONAL INTELLIGENCE</small></span>
        </a>
        <button className="new-chat" onClick={() => setActive("Overview")}><Plus size={16} /> New workspace</button>
        <div className="nav-label">WORKSPACE</div>
        {["Overview", "Conversations", "Memory Center", "Integrations", "Files"].map((item) => (
          <button key={item} className={`nav-item ${active === item ? "active" : ""}`} onClick={() => { setActive(item); setMenuOpen(false); }}>
            {item === "Overview" ? <Command /> : item === "Memory Center" ? <Database /> : item === "Integrations" ? <Sparkles /> : item === "Files" ? <FileText /> : <Bot />}
            {item}
          </button>
        ))}
        <div className="nav-label modules-label">SYSTEM MODULES</div>
        <div className="module-mini-list">
          {modules.slice(0, 5).map(({ name, icon: Icon }) => <div className="module-mini" key={name}><Icon size={15} />{name}</div>)}
        </div>
        <div className="sidebar-bottom">
          <div className="secure-note"><ShieldCheck size={16} /><span><b>Privacy by design</b><small>Actions require permission</small></span></div>
          <button className="nav-item"><Settings2 /> Settings</button>
          <div className="profile"><div className="avatar">S</div><span><b>Project Founder</b><small>SENTRA workspace</small></span><ChevronDown size={15} /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><Menu /></button>
          <div className="breadcrumbs">SENTRA <span>/</span> {active}</div>
          <div className="topbar-right"><span className="system-state"><i /> CORE INITIALIZING</span><button className="icon-button" aria-label="Help"><CircleHelp /></button></div>
        </header>

        <section className="content">
          <div className="hero-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> PERSONAL AI SYSTEM <span className="version">BUILD 0.1</span></div>
              <h1>Your intelligence.<br /><em>One connected space.</em></h1>
              <p className="hero-copy">A personal AI workspace designed around your tools, your context, and your control.</p>
            </div>
            <div className="core-orb" aria-label="SENTRA core visual">
              <div className="orb-ring ring-one" /><div className="orb-ring ring-two" /><div className="orb-core"><Activity size={34} /></div>
              <span className="orb-label">SENTRA CORE</span>
            </div>
          </div>

          <div className="section-heading"><div><span className="section-kicker">SYSTEM OVERVIEW</span><h2>Core capabilities</h2></div><span className="muted-tag"><i /> ARCHITECTURE FOUNDATION</span></div>
          <div className="module-grid">
            {modules.map(({ name, detail, icon: Icon, status }, index) => (
              <article className="module-card" key={name}>
                <div className="module-top"><span className="module-icon"><Icon size={19} /></span><span className={`module-index ${index === 0 ? "index-live" : ""}`}>{String(index + 1).padStart(2, "0")}</span></div>
                <h3>{name}</h3><p>{detail}</p><div className="module-status"><span />{status}</div>
              </article>
            ))}
          </div>

          <section className="workspace-panel">
            <div className="workspace-title"><div className="assistant-icon"><Bot size={18} /></div><div><b>SENTRA Assistant</b><small>Conversation interface preview</small></div><span className="preview-chip">PREVIEW</span></div>
            <div className="empty-state"><div className="empty-symbol"><Sparkles size={21} /></div><h3>Ready when you are.</h3><p>The conversation engine will connect here during the AI Core phase. No model is connected yet.</p></div>
            <form className="composer" onSubmit={submitMessage}>
              <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask SENTRA anything..." aria-label="Message SENTRA" />
              <button type="button" className="composer-tool" aria-label="Search"><Search size={17} /></button>
              <button type="submit" className="send-button" aria-label="Send message"><Send size={17} /></button>
            </form>
            <div className="composer-foot"><span><ShieldCheck size={13} /> Your data stays under your control</span><span>AI responses not yet connected</span></div>
          </section>

          <footer><span>© 2026 SENTRA PROJECT</span><span>BUILT WITH INTENTION <b>◆</b></span></footer>
        </section>
      </main>
    </div>
  );
}
