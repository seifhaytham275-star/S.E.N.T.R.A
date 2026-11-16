import { useEffect, useMemo, useState } from "react";
import {
  Activity, AudioLines, Bot, BrainCircuit, ChevronDown, CircleHelp,
  Command, Database, FileText, Github, Globe2, Mail, Menu, Plus, Send,
  Settings2, ShieldCheck, Sparkles, Youtube, X,
} from "lucide-react";

type Message = { id: string; role: "user" | "assistant"; content: string; time: number };
const STORAGE_KEY = "sentra.mvp.conversations.v1";
const API_BASE = (import.meta.env.VITE_API_BASE_URL || localStorage.getItem("sentra.localApiUrl") || "http://127.0.0.1:8000").replace(/\/$/, "");
const modules = [
  { name: "AI Core", detail: "Model-powered conversations", icon: BrainCircuit, state: "Three local Ollama models" },
  { name: "Memory Center", detail: "User-controlled memory", icon: Database, state: "Coming next" },
  { name: "Gmail", detail: "Email workspace", icon: Mail, state: "Not connected" },
  { name: "YouTube", detail: "Video discovery & insights", icon: Youtube, state: "Coming next" },
  { name: "Browser", detail: "Web research tools", icon: Globe2, state: "Coming next" },
  { name: "Developer", detail: "Code & GitHub tools", icon: Github, state: "Coming next" },
  { name: "Files", detail: "Documents & data", icon: FileText, state: "Coming next" },
  { name: "Voice", detail: "Arabic & English voice", icon: AudioLines, state: "Coming next" },
];
const starterPrompts = [
  "Help me plan a software project",
  "Explain a programming concept",
  "Summarize a document I provide",
];

function readMessages(): Message[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) as Message[] : [];
  } catch { return []; }
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>(readMessages);
  const [draft, setDraft] = useState("");
  const [active, setActive] = useState("Workspace");
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [apiReady, setApiReady] = useState(false);\n  const [modelMode, setModelMode] = useState<"general" | "coding" | "reasoning">("general");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    let alive = true;
    if (!API_BASE) { setApiStatus("offline"); return; }
    fetch(`${API_BASE}/api/v1/status`)
      .then(async (response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then((data) => {
        if (!alive) return;
        setApiStatus("online");
        setApiReady(Boolean(data.ai_ready));
      })
      .catch(() => { if (alive) setApiStatus("offline"); });
    return () => { alive = false; };
  }, []);

  const pageTitle = useMemo(() => active === "Workspace" ? "Your intelligence space" : active, [active]);

  async function sendMessage(value = draft) {
    const content = value.trim();
    if (!content || busy) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content, time: Date.now() };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setBusy(true);
    try {
      if (!API_BASE) throw new Error("The SENTRA API has not been deployed or connected yet.");
      const response = await fetch(`${API_BASE}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, mode: modelMode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "The AI service is not ready.");
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: data.reply, time: Date.now() }]);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Could not reach the AI service.";
      setMessages((current) => [...current, {
        id: crypto.randomUUID(), role: "assistant",
        content: `I received your message, but the AI Core is not available yet. ${detail} Your conversation remains saved in this browser.`,
        time: Date.now(),
      }]);
    } finally { setBusy(false); }
  }

  function startNewChat() {
    setMessages([]);
    setActive("Workspace");
    setMenuOpen(false);
  }

  return <div className="app-shell">
    {menuOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
      <div className="brand">
        <span className="brand-mark"><Activity size={21}/></span>
        <span><strong>SENTRA</strong><small>PERSONAL AI SYSTEM</small></span>
        <button className="icon-button close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={17}/></button>
      </div>
      <button className="new-chat" onClick={startNewChat}><Plus size={16}/> New conversation <kbd>⌘ K</kbd></button>
      <div className="nav-label">WORKSPACE</div>
      {["Workspace", "Memory Center", "Integrations", "Files", "Settings"].map((item) => (
        <button key={item} className={`nav-item ${active === item ? "active" : ""}`} onClick={() => { setActive(item); setMenuOpen(false); }}>
          {item === "Workspace" ? <Command/> : item === "Memory Center" ? <Database/> : item === "Integrations" ? <Sparkles/> : item === "Files" ? <FileText/> : <Settings2/>}
          {item}
        </button>
      ))}
      <div className="nav-label modules-label">SYSTEM MODULES</div>
      <div className="module-mini-list">
        {modules.slice(0, 5).map(({ name, icon: Icon }) => <div className="module-mini" key={name}><Icon size={15}/>{name}</div>)}
      </div>
      <div className="sidebar-bottom">
        <div className="secure-note"><ShieldCheck size={16}/><span><b>Privacy by design</b><small>Connected actions require permission</small></span></div>
        <div className="profile"><div className="avatar">S</div><span><b>Project Founder</b><small>SENTRA workspace</small><ChevronDown size={14}/></span></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu/></button>
        <div className="breadcrumbs">SENTRA <span>/</span> {active}</div>
        <div className="topbar-right">
          <span className={`system-state ${apiStatus}`}><i/>{apiStatus === "online" ? "API ONLINE" : apiStatus === "checking" ? "CHECKING CORE" : "DEMO MODE"}</span>
          <button className="icon-button" aria-label="Help" title="SENTRA MVP v0.1"><CircleHelp/></button>
        </div>
      </header>

      {active === "Workspace" ? <section className="content workspace-content">
        <div className="hero-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-line"/> PERSONAL AI SYSTEM <span className="version">MVP 0.1</span></div>
            <h1>Think clearly.<br/><em>Move with intent.</em></h1>
            <p className="hero-copy">One personal workspace for your ideas, knowledge, and tools. Built around your control.</p>
          </div>
          <div className="core-orb" aria-label="SENTRA identity"><div className="orb-ring ring-one"/><div className="orb-ring ring-two"/><div className="orb-core"><Activity size={32}/></div><span className="orb-label">SENTRA CORE</span></div>
        </div>

        <div className="section-heading"><div><span className="section-kicker">SYSTEM OVERVIEW</span><h2>Core capabilities</h2></div><span className="muted-tag"><i/> MVP FOUNDATION</span></div>
        <div className="module-grid">
          {modules.map(({ name, detail, icon: Icon, state }, index) => <article className="module-card" key={name}>
            <div className="module-top"><span className="module-icon"><Icon size={19}/></span><span className={`module-index ${index === 0 ? "index-live" : ""}`}>{String(index + 1).padStart(2, "0")}</span></div>
            <h3>{name}</h3><p>{detail}</p><div className="module-status"><span/>{state}</div>
          </article>)}
        </div>

        <section className="workspace-panel">
          <div className="workspace-title"><div className="assistant-icon"><Bot size={18}/></div><div><b>SENTRA Assistant</b><small>{apiReady ? "Three local models ready" : "Connect the local Windows AI Core"}</small></div><span className={`preview-chip ${apiReady ? "connected" : ""}`}>{apiReady ? "CONNECTED" : "EARLY ACCESS"}</span></div>
          {messages.length === 0 ? <div className="empty-state"><div className="empty-symbol"><Sparkles size={21}/></div><h3>What would you like to work on?</h3><p>Start a conversation. Messages are saved locally in this browser.</p><div className="starter-prompts">{starterPrompts.map((prompt) => <button key={prompt} onClick={() => void sendMessage(prompt)}>{prompt}<span>↗</span></button>)}</div></div> : <div className="message-list">
            {messages.map((item) => <article className={`message ${item.role}`} key={item.id}><div className="message-avatar">{item.role === "assistant" ? <Sparkles size={15}/> : "S"}</div><div className="message-body"><div className="message-label">{item.role === "assistant" ? "SENTRA" : "YOU"} <time>{new Date(item.time).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</time></div><p>{item.content}</p></div></article>)}
            {busy && <div className="typing"><i/><i/><i/> SENTRA is working…</div>}
          </div>}
          <form className="composer" onSubmit={(event) => { event.preventDefault(); void sendMessage(); }}>
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Message SENTRA…" rows={1} aria-label="Message SENTRA"/>
            <button type="submit" className="send-button" disabled={!draft.trim() || busy} aria-label="Send message"><Send size={17}/></button>
          </form>
          <div className="composer-foot"><span><ShieldCheck size={13}/> Conversation saved on this device</span><span>{apiReady ? "Local AI Core ready · no API keys" : "Waiting for local Ollama models"}</span></div>
        </section>
        <footer><span>© 2026 SENTRA PROJECT</span><span>BUILT WITH INTENTION <b>◆</b></span></footer>
      </section> : <section className="content subpage">
        <div className="eyebrow"><span className="eyebrow-line"/> SENTRA MODULE</div>
        <h1>{pageTitle}</h1>
        {active === "Integrations" ? <div className="integration-grid">{modules.slice(2, 6).map(({name,detail,icon:Icon,state}) => <article className="module-card" key={name}><span className="module-icon"><Icon size={19}/></span><h3>{name}</h3><p>{detail}</p><div className="module-status"><span/>{state}</div></article>)}</div> :
          active === "Settings" ? <div className="settings-card"><h3>Runtime status</h3><p>Web client: ready</p><p>API: {apiStatus === "online" ? "reachable" : "not connected"}</p><p>Local AI Core: {apiReady ? "three local models ready" : "not ready"}</p><p>Conversation storage: this browser only</p><small>API keys must be configured on the backend server. Never paste secret keys into this page.</small></div> :
          <div className="settings-card"><div className="empty-symbol"><Bot size={21}/></div><h3>{active} is on the roadmap</h3><p>This module is not active in MVP v0.1 yet. It will be added in a later, tested release.</p><button className="back-button" onClick={() => setActive("Workspace")}>Back to workspace</button></div>}
        <footer><span>© 2026 SENTRA PROJECT</span><span>MVP 0.1</span></footer>
      </section>}
    </main>
  </div>;
}
