import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Backpack,
  BadgeCheck,
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Droplets,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Filter,
  Headphones,
  ImagePlus,
  Inbox,
  KeyRound,
  Laptop,
  LayoutDashboard,
  LogOut,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PackageSearch,
  Plus,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Users,
  WalletCards,
  Watch,
  X,
} from 'lucide-react';

const campusImage = '/images/Screenshot_2026-11-22_062955.png';
const campusAerialImage = '/images/Screenshot_2026-11-22_063013.png';
const locations = ['NYB', 'VIB', 'KIB', 'KAB', 'Cafeteria', 'Mess', 'Sports Complex', 'Cricket Ground', 'Football Ground', 'Other / Specific Location'];
const categories = ['All categories', 'Electronics', 'Cards & IDs', 'Bags', 'Stationery', 'Personal items', 'Keys', 'Books'];
type View = 'home' | 'auth' | 'lost' | 'found' | 'browse' | 'detail' | 'dashboard' | 'matching' | 'admin';
type ReportType = 'lost' | 'found';
type ReportStatus = 'Submitted' | 'Under Review' | 'Potential Match' | 'Claim Pending' | 'Verified' | 'Resolved' | 'Rejected';
type IconKey = 'wallet' | 'card' | 'bottle' | 'book' | 'laptop' | 'earbuds' | 'backpack' | 'calculator' | 'keys' | 'watch' | 'phone';

type Report = {
  id: string;
  type: ReportType;
  name: string;
  category: string;
  description: string;
  location: string;
  exactLocation: string;
  date: string;
  time: string;
  status: ReportStatus;
  icon: IconKey;
  reporter: string;
  createdAt: number;
  additional?: string;
};

type Claim = {
  id: string;
  reportId: string;
  reportName: string;
  claimant: string;
  submitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  note: string;
};

type ToastTone = 'success' | 'info';
type Toast = { message: string; tone: ToastTone } | null;

const iconMap: Record<IconKey, typeof WalletCards> = {
  wallet: WalletCards,
  card: CreditCard,
  bottle: Droplets,
  book: BookOpen,
  laptop: Laptop,
  earbuds: Headphones,
  backpack: Backpack,
  calculator: Calculator,
  keys: KeyRound,
  watch: Watch,
  phone: Smartphone,
};

const initialReports: Report[] = [
  { id: 'JF-24091', type: 'lost', name: 'Black leather wallet', category: 'Personal items', description: 'Slim black wallet with a small silver stitch on the front. Contains two cards.', location: 'VIB', exactLocation: 'Outside the ground floor seminar rooms', date: '2024-11-18', time: '13:30', status: 'Under Review', icon: 'wallet', reporter: 'Aarav Mehta', createdAt: 15 },
  { id: 'JF-24090', type: 'found', name: 'Black leather wallet', category: 'Personal items', description: 'Black wallet found near the water cooler. Kept safely at the reception desk.', location: 'VIB', exactLocation: 'Ground floor water cooler', date: '2024-11-18', time: '14:10', status: 'Potential Match', icon: 'wallet', reporter: 'Neha Sharma', createdAt: 14 },
  { id: 'JF-24089', type: 'lost', name: 'Student ID card', category: 'Cards & IDs', description: 'JECRC student ID card in a clear sleeve. Please keep the details private.', location: 'Cafeteria', exactLocation: 'Near the north entrance tables', date: '2024-11-18', time: '12:15', status: 'Submitted', icon: 'card', reporter: 'Riya Kapoor', createdAt: 13 },
  { id: 'JF-24088', type: 'found', name: 'Blue steel water bottle', category: 'Personal items', description: 'Matte blue insulated bottle with a white loop cap.', location: 'Sports Complex', exactLocation: 'Bench beside indoor court 2', date: '2024-11-17', time: '17:20', status: 'Submitted', icon: 'bottle', reporter: 'Kabir Jain', createdAt: 12 },
  { id: 'JF-24087', type: 'lost', name: 'Calculus notebook', category: 'Stationery', description: 'A5 ruled notebook with a green cover and handwritten initials on the first page.', location: 'KIB', exactLocation: 'Library study zone, second row', date: '2024-11-17', time: '10:45', status: 'Submitted', icon: 'book', reporter: 'Ishita Rao', createdAt: 11 },
  { id: 'JF-24086', type: 'found', name: 'USB-C laptop charger', category: 'Electronics', description: '65W USB-C charger with a short braided cable.', location: 'NYB', exactLocation: 'Innovation lab charging shelf', date: '2024-11-16', time: '16:05', status: 'Under Review', icon: 'laptop', reporter: 'Dev Malhotra', createdAt: 10 },
  { id: 'JF-24085', type: 'lost', name: 'White wireless earbuds', category: 'Electronics', description: 'White earbuds in a matte case, one small blue mark on the lid.', location: 'Mess', exactLocation: 'Table 18 near the beverage counter', date: '2024-11-16', time: '14:25', status: 'Claim Pending', icon: 'earbuds', reporter: 'Meera Singh', createdAt: 9 },
  { id: 'JF-24084', type: 'found', name: 'Navy student backpack', category: 'Bags', description: 'Navy backpack with a red keychain. No personal documents visible.', location: 'KAB', exactLocation: 'Auditorium foyer seating', date: '2024-11-15', time: '18:00', status: 'Verified', icon: 'backpack', reporter: 'Arjun Verma', createdAt: 8 },
  { id: 'JF-24083', type: 'lost', name: 'Casio scientific calculator', category: 'Stationery', description: 'Black calculator with a faded white name label on the back.', location: 'NYB', exactLocation: 'Room 204, left-side desk', date: '2024-11-15', time: '09:20', status: 'Submitted', icon: 'calculator', reporter: 'Sana Khan', createdAt: 7 },
  { id: 'JF-24082', type: 'found', name: 'Set of brass keys', category: 'Keys', description: 'Three keys on a plain circular ring, found on a concrete step.', location: 'Cricket Ground', exactLocation: 'West side spectator steps', date: '2024-11-14', time: '16:40', status: 'Submitted', icon: 'keys', reporter: 'Yuvraj Beniwal', createdAt: 6 },
  { id: 'JF-24081', type: 'lost', name: 'Silver wristwatch', category: 'Personal items', description: 'Silver mesh strap watch with a small round black dial.', location: 'Football Ground', exactLocation: 'Changing room corridor', date: '2024-11-14', time: '17:05', status: 'Under Review', icon: 'watch', reporter: 'Ananya Joshi', createdAt: 5 },
  { id: 'JF-24080', type: 'found', name: 'Android mobile phone', category: 'Electronics', description: 'Dark blue phone in a transparent case. Screen is locked and intact.', location: 'Mess', exactLocation: 'Handed to the mess supervisor', date: '2024-11-13', time: '13:15', status: 'Claim Pending', icon: 'phone', reporter: 'Faculty desk', createdAt: 4 },
  { id: 'JF-24079', type: 'lost', name: 'Marketing textbook', category: 'Books', description: 'Blue and white textbook with sticky tabs throughout the first half.', location: 'KAB', exactLocation: 'Second floor reading lounge', date: '2024-11-13', time: '11:00', status: 'Resolved', icon: 'book', reporter: 'Rahul Tiwari', createdAt: 3 },
  { id: 'JF-24078', type: 'found', name: 'Black calculator', category: 'Stationery', description: 'Scientific calculator found after the afternoon examination.', location: 'VIB', exactLocation: 'Exam hall B, invigilator desk', date: '2024-11-12', time: '15:30', status: 'Submitted', icon: 'calculator', reporter: 'Exam office', createdAt: 2 },
  { id: 'JF-24077', type: 'lost', name: 'Compact black backpack', category: 'Bags', description: 'Compact black backpack with a grey front pocket and blue zipper pull.', location: 'Other / Specific Location', exactLocation: 'Shuttle stop near main gate', date: '2024-11-12', time: '08:10', status: 'Rejected', icon: 'backpack', reporter: 'Nikhil Saini', createdAt: 1 },
];

const initialClaims: Claim[] = [
  { id: 'CL-1008', reportId: 'JF-24080', reportName: 'Android mobile phone', claimant: 'Riya Kapoor', submitted: 'Today, 09:42', status: 'Pending', note: 'Provided lock-screen detail for administrator review.' },
  { id: 'CL-1007', reportId: 'JF-24085', reportName: 'White wireless earbuds', claimant: 'Meera Singh', submitted: 'Yesterday, 18:15', status: 'Pending', note: 'Described the blue mark on the case lid.' },
  { id: 'CL-1006', reportId: 'JF-24079', reportName: 'Marketing textbook', claimant: 'Rahul Tiwari', submitted: '14 Nov, 12:20', status: 'Approved', note: 'Ownership detail verified by admin.' },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

function getIcon(icon: IconKey, size = 24) {
  const Icon = iconMap[icon];
  return <Icon size={size} strokeWidth={1.8} />;
}

function App() {
  const [view, setView] = useState<View>('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('ju-findit-auth') === 'true');
  const [selectedReportId, setSelectedReportId] = useState('JF-24090');
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('ju-findit-reports');
    return saved ? JSON.parse(saved) as Report[] : initialReports;
  });
  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem('ju-findit-claims');
    return saved ? JSON.parse(saved) as Claim[] : initialClaims;
  });
  const [savedItems, setSavedItems] = useState<string[]>(() => JSON.parse(localStorage.getItem('ju-findit-saved') || '[]') as string[]);
  const [toast, setToast] = useState<Toast>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => { localStorage.setItem('ju-findit-reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('ju-findit-claims', JSON.stringify(claims)); }, [claims]);
  useEffect(() => { localStorage.setItem('ju-findit-saved', JSON.stringify(savedItems)); }, [savedItems]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = (nextView: View, id?: string) => {
    if (id) setSelectedReportId(id);
    setView(nextView);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, tone: ToastTone = 'success') => setToast({ message, tone });
  const openAuth = (mode: 'login' | 'register') => { setAuthMode(mode); navigate('auth'); };
  const handleAuthSuccess = () => { setIsLoggedIn(true); localStorage.setItem('ju-findit-auth', 'true'); navigate('dashboard'); };
  const handleLogout = () => { setIsLoggedIn(false); localStorage.removeItem('ju-findit-auth'); showToast('You have been signed out of the demo account.', 'info'); navigate('home'); };
  const selectedReport = reports.find((report) => report.id === selectedReportId) || reports[0];

  const toggleSaved = (id: string) => {
    setSavedItems((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    showToast(savedItems.includes(id) ? 'Removed from saved items.' : 'Item saved to your dashboard.', 'info');
  };

  const addReport = (report: Report) => {
    setReports((current) => [report, ...current]);
    showToast(`${report.type === 'lost' ? 'Lost' : 'Found'} report ${report.id} submitted successfully.`);
    navigate('dashboard');
  };

  const submitClaim = (report: Report, note: string) => {
    const claim: Claim = { id: `CL-${1009 + claims.length}`, reportId: report.id, reportName: report.name, claimant: 'Demo Student', submitted: 'Just now', status: 'Pending', note };
    setClaims((current) => [claim, ...current]);
    setReports((current) => current.map((item) => item.id === report.id ? { ...item, status: 'Claim Pending' } : item));
    showToast('Claim request sent for administrator review.');
  };

  const updateClaim = (claimId: string, status: Claim['status']) => {
    setClaims((current) => current.map((claim) => claim.id === claimId ? { ...claim, status } : claim));
    const claim = claims.find((item) => item.id === claimId);
    if (claim && status === 'Approved') setReports((current) => current.map((report) => report.id === claim.reportId ? { ...report, status: 'Verified' } : report));
    showToast(`Claim ${status.toLowerCase()}.`);
  };

  return (
    <div className="app-shell">
      <Header view={view} navigate={navigate} mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} isLoggedIn={isLoggedIn} onOpenAuth={openAuth} onLogout={handleLogout} />
      <main>
        {view === 'home' && <Home reports={reports} navigate={navigate} />}
        {view === 'auth' && <Auth navigate={navigate} showToast={showToast} initialMode={authMode} onAuthSuccess={handleAuthSuccess} />}
        {view === 'lost' && <ReportForm type="lost" addReport={addReport} navigate={navigate} />}
        {view === 'found' && <ReportForm type="found" addReport={addReport} navigate={navigate} />}
        {view === 'browse' && <Browse reports={reports} navigate={navigate} savedItems={savedItems} toggleSaved={toggleSaved} />}
        {view === 'detail' && <Detail report={selectedReport} navigate={navigate} isSaved={savedItems.includes(selectedReport.id)} toggleSaved={toggleSaved} submitClaim={submitClaim} />}
        {view === 'dashboard' && <Dashboard reports={reports} claims={claims} savedItems={savedItems} navigate={navigate} />}
        {view === 'matching' && <Matching reports={reports} navigate={navigate} submitClaim={submitClaim} />}
        {view === 'admin' && <Admin reports={reports} claims={claims} navigate={navigate} updateClaim={updateClaim} setReports={setReports} />}
      </main>
      <Footer navigate={navigate} />
      <Chatbot open={chatOpen} setOpen={setChatOpen} reports={reports} navigate={navigate} />
      {toast && <div className={`toast toast-${toast.tone}`}><CheckCircle2 size={18} />{toast.message}<button onClick={() => setToast(null)} aria-label="Dismiss"><X size={15} /></button></div>}
    </div>
  );
}

function Header({ view, navigate, mobileNavOpen, setMobileNavOpen, isLoggedIn, onOpenAuth, onLogout }: { view: View; navigate: (view: View) => void; mobileNavOpen: boolean; setMobileNavOpen: (open: boolean) => void; isLoggedIn: boolean; onOpenAuth: (mode: 'login' | 'register') => void; onLogout: () => void }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navItems: { label: string; view: View }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Browse Items', view: 'browse' },
    { label: 'Smart Match', view: 'matching' },
    { label: 'My Dashboard', view: 'dashboard' },
  ];
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={() => navigate('home')} aria-label="JU FindIt home">
          <span className="brand-mark"><ShieldCheck size={21} /></span>
          <span><strong>JU <em>FindIt</em></strong><small>JECRC UNIVERSITY</small></span>
        </button>
        <nav className={`main-nav ${mobileNavOpen ? 'nav-open' : ''}`}>
          {navItems.map((item) => <button key={item.view} className={view === item.view ? 'active' : ''} onClick={() => navigate(item.view)}>{item.label}</button>)}
          <button className="nav-admin" onClick={() => navigate('admin')}><LayoutDashboard size={15} /> Admin</button>
          {!isLoggedIn && <div className="auth-nav"><button onClick={() => onOpenAuth('login')}>Login</button><button className="register-nav" onClick={() => onOpenAuth('register')}>Register</button></div>}
        </nav>
        <div className="header-actions">
          {isLoggedIn ? <>
            <button className="icon-button" aria-label="Notifications" onClick={() => navigate('dashboard')}><Bell size={18} /><span className="notification-dot" /></button>
            <div className="profile-menu-wrap">
              <button className="profile-chip" onClick={() => setProfileMenuOpen(!profileMenuOpen)}><span>AS</span><span className="profile-name">Aarav S.</span><ChevronDown size={14} /></button>
              {profileMenuOpen && <div className="profile-menu"><button onClick={() => { setProfileMenuOpen(false); navigate('dashboard'); }}><span>My dashboard</span><ChevronRight size={15} /></button><button onClick={onLogout}><span>Logout</span><LogOut size={15} /></button></div>}
            </div>
          </> : <div className="header-auth-actions"><button onClick={() => onOpenAuth('login')}>Login</button><button className="register-nav" onClick={() => onOpenAuth('register')}>Register</button></div>}
          <button className="mobile-menu" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu"><Menu size={21} /></button>
        </div>
      </div>
    </header>
  );
}

function Home({ reports, navigate }: { reports: Report[]; navigate: (view: View, id?: string) => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-image" style={{ backgroundImage: `url(${campusImage})` }} />
        <div className="hero-overlay" />
        <div className="hero-content page-wrap">
          <div className="hero-copy">
            <p className="eyebrow light"><span /> JECRC UNIVERSITY COMMUNITY PORTAL</p>
            <h1>Lost it? Found it?<br /><span>Let's reunite it.</span></h1>
            <p className="hero-description">A trusted digital space for the JU community to report, discover and safely return belongings across campus.</p>
            <div className="hero-actions"><button className="button button-red" onClick={() => navigate('lost')}>Report Lost Item <ArrowRight size={17} /></button><button className="button button-outline-light" onClick={() => navigate('found')}>Report Found Item</button></div>
            <div className="hero-trust"><span><Check size={14} /> Verified community</span><span><Check size={14} /> Private claims</span><span><Check size={14} /> Admin reviewed</span></div>
          </div>
          <div className="hero-stats"><div><strong>1,284</strong><span>Total reports</span></div><div><strong>78%</strong><span>Reunited this year</span></div></div>
        </div>
        <div className="hero-scroll"><span>Scroll to explore</span><div /></div>
      </section>
      <section className="search-strip"><div className="page-wrap search-strip-inner"><div className="search-label"><Search size={20} /><span><strong>Looking for something?</strong><small>Search the campus community listings</small></span></div><SearchBar onSubmit={() => navigate('browse')} /></div></section>
      <section className="section page-wrap"><div className="section-heading"><div><p className="eyebrow">EXPLORE THE PORTAL</p><h2>Find your way back to it.</h2></div><button className="text-button" onClick={() => navigate('browse')}>View all items <ArrowUpRight size={16} /></button></div><div className="category-grid">{[{ icon: Smartphone, label: 'Electronics', count: '42 items' }, { icon: Backpack, label: 'Bags & backpacks', count: '28 items' }, { icon: FileText, label: 'Cards & IDs', count: '19 items' }, { icon: BookOpen, label: 'Books & stationery', count: '36 items' }, { icon: KeyRound, label: 'Keys', count: '11 items' }].map((category) => <button className="category-card" key={category.label} onClick={() => navigate('browse')}><span className="category-icon"><category.icon size={21} /></span><span><strong>{category.label}</strong><small>{category.count}</small></span><ChevronRight size={17} /></button>)}</div></section>
      <section className="section section-tint"><div className="page-wrap"><div className="section-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Latest community reports</h2></div><button className="text-button" onClick={() => navigate('browse')}>Browse all <ArrowUpRight size={16} /></button></div><div className="report-grid">{reports.slice(0, 4).map((report) => <ReportCard report={report} key={report.id} onClick={() => navigate('detail', report.id)} />)}</div></div></section>
      <HowItWorks navigate={navigate} />
      <section className="section page-wrap"><div className="stat-panel"><div><p className="eyebrow light">THE JU FINDIT IMPACT</p><h2>Small reports make<br />a meaningful difference.</h2><p>Every report helps our community keep campus connected, thoughtful and a little more human.</p></div><div className="impact-stats"><div><strong>1,284</strong><span>Total reports</span></div><div><strong>967</strong><span>Items found</span></div><div><strong>812</strong><span>Items returned</span></div><div><strong>74</strong><span>Active reports</span></div></div></div></section>
    </>
  );
}

function SearchBar({ onSubmit }: { onSubmit: () => void }) {
  const [value, setValue] = useState('');
  return <form className="search-box" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><Search size={18} /><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Search by item, category or keyword" /><button type="submit">Search</button></form>;
}

function ReportCard({ report, onClick, compact = false }: { report: Report; onClick: () => void; compact?: boolean }) {
  return <button className={`report-card ${compact ? 'compact' : ''}`} onClick={onClick}><div className={`report-visual visual-${report.icon}`}><span>{getIcon(report.icon, compact ? 27 : 32)}</span><small>{report.type === 'lost' ? 'LOST' : 'FOUND'}</small></div><div className="report-card-body"><div className="report-card-meta"><span className={`status-pill ${report.type}`}>{report.type === 'lost' ? 'Lost item' : 'Found item'}</span><span>{report.id}</span></div><h3>{report.name}</h3><p>{report.description}</p><div className="report-card-footer"><span><MapPin size={14} /> {report.location}</span><span><CalendarDays size={14} /> {formatDate(report.date)}</span></div></div></button>;
}

function HowItWorks({ navigate }: { navigate: (view: View) => void }) {
  return <section className="section page-wrap how-section"><div className="section-heading"><div><p className="eyebrow">SIMPLE BY DESIGN</p><h2>From missing to found.</h2></div><p className="section-intro">A clear, thoughtful process designed for the way the JU community actually moves.</p></div><div className="steps-grid">{[{ number: '01', title: 'Report it', copy: 'Share the essentials and help the community know what to look for.', icon: FileText }, { number: '02', title: 'We connect', copy: 'Smart matching surfaces nearby reports with similar details.', icon: Sparkles }, { number: '03', title: 'Reunite safely', copy: 'Administrators verify ownership before anything is handed over.', icon: BadgeCheck }].map((step) => <div className="step-card" key={step.number}><span className="step-number">{step.number}</span><step.icon size={25} /><h3>{step.title}</h3><p>{step.copy}</p></div>)}</div><div className="how-cta"><span><ShieldCheck size={20} /> Built for a safer campus community</span><button className="text-button" onClick={() => navigate('matching')}>See how smart match works <ArrowRight size={16} /></button></div></section>;
}

function Auth({ navigate, showToast, initialMode, onAuthSuccess }: { navigate: (view: View) => void; showToast: (message: string, tone?: ToastTone) => void; initialMode: 'login' | 'register'; onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [course, setCourse] = useState('');

  useEffect(() => setMode(initialMode), [initialMode]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (mode === 'register') {
      if (!email.trim().toLowerCase().endsWith('@jecrc.ac.in')) { showToast('Please use your JECRC University college email ID.', 'info'); return; }
      if (password.length < 6) { showToast('Your password must be at least 6 characters.', 'info'); return; }
      if (password !== confirmPassword) { showToast('Passwords do not match.', 'info'); return; }
    }
    showToast(mode === 'login' ? 'Demo sign-in successful.' : 'Demo account created. Authentication is simulated for this prototype.');
    onAuthSuccess();
  };

  return <section className="auth-page"><div className="auth-art" style={{ backgroundImage: `url(${campusAerialImage})` }}><div className="auth-art-overlay" /><div className="auth-art-content"><button className="brand brand-light" onClick={() => navigate('home')}><span className="brand-mark"><ShieldCheck size={21} /></span><span><strong>JU <em>FindIt</em></strong><small>JECRC UNIVERSITY</small></span></button><div><p className="eyebrow light">A CONNECTED CAMPUS</p><h1>Belongings find their way home.</h1><p>A trusted space for students and faculty to look out for one another.</p></div><span className="auth-caption">Demo prototype · Fictional data only</span></div></div><div className="auth-panel"><div className="auth-form-wrap"><div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button><button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button></div><p className="eyebrow">WELCOME TO JU FINDIT</p><h2>{mode === 'login' ? 'Welcome back.' : 'Join the community.'}</h2><p className="auth-subtitle">{mode === 'login' ? 'Sign in to manage reports, claims and saved items.' : 'Create a demo account with your official university email.'}</p>{mode === 'register' && <div className="college-email-notice"><ShieldCheck size={16} /><strong>JECRC University College Email ID Only.</strong></div>}<form className="form-stack" onSubmit={submit}>{mode === 'register' && <Field label="Full Name" value={name} onChange={setName} placeholder="e.g. Aarav Mehta" />}{mode === 'register' && <Field label="Registration Number" value={registrationNumber} onChange={setRegistrationNumber} placeholder="e.g. 22BCS1047" />}{mode === 'register' && <Field label="Course" value={course} onChange={setCourse} placeholder="e.g. B.Tech Computer Science" />}<Field label="JECRC College Email ID" value={email} onChange={setEmail} placeholder="you@jecrc.ac.in" type="email" /><div className="field"><label>Password</label><div className="password-field"><input value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} type={showPassword ? 'text' : 'password'} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>{mode === 'register' && <Field label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} type="password" placeholder="Repeat your password" />}<div className="form-note"><LockKeyhole size={15} /> Your personal information stays private and is only visible to authorised administrators.</div><button className="button button-navy full-width" type="submit">{mode === 'login' ? 'Login to JU FindIt' : 'Create demo account'} <ArrowRight size={17} /></button></form>{mode === 'login' && <button className="forgot-button" onClick={() => showToast('Password reset is simulated in this prototype.', 'info')}>Forgot password?</button>}<div className="demo-login"><div><span className="demo-dot" /><strong>Demo access</strong></div><p>Student: <b>student@jecrc.ac.in</b> · Password: <b>demo123</b></p></div><p className="auth-footer">This is a demo authentication flow. No production account is created.</p></div></div></section>;
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value?: string; onChange?: (value: string) => void; placeholder: string; type?: string }) {
  return <div className="field"><label>{label}</label><input required value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} type={type} placeholder={placeholder} /></div>;
}

function ReportForm({ type, addReport, navigate }: { type: ReportType; addReport: (report: Report) => void; navigate: (view: View) => void }) {
  const [form, setForm] = useState({ name: '', category: 'Electronics', description: '', location: 'NYB', exactLocation: '', date: '', time: '', additional: '' });
  const [imageName, setImageName] = useState('');
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); addReport({ id: `JF-${24100 + Math.floor(Math.random() * 80)}`, type, name: form.name, category: form.category, description: form.description || 'Details shared privately with the JU FindIt community.', location: form.location, exactLocation: form.exactLocation || 'Details provided in report', date: form.date || new Date().toISOString().slice(0, 10), time: form.time || '12:00', additional: form.additional, status: 'Submitted', icon: type === 'lost' ? 'backpack' : 'wallet', reporter: 'Demo Student', createdAt: Date.now() }); };
  return <section className="form-page page-wrap"><div className="form-page-heading"><div><button className="back-button" onClick={() => navigate('home')}><ChevronRight size={16} className="rotate-180" /> Back to home</button><p className="eyebrow">{type === 'lost' ? 'HELP THE COMMUNITY LOOK' : 'MAKE A DIFFERENCE TODAY'}</p><h1>Report an item {type === 'lost' ? 'you lost' : 'you found'}.</h1><p>Tell us what happened. Keep personal identifying details private — our administrators will verify claims securely.</p></div><div className={`form-heading-icon ${type}`}><FileCheck2 size={34} /></div></div><form className="report-form" onSubmit={submit}><div className="form-card"><div className="form-card-heading"><span>01</span><div><h2>Item essentials</h2><p>Start with the details the community will recognise.</p></div></div><div className="form-grid"><Field label="Item name" value={form.name} onChange={(value) => update('name', value)} placeholder={type === 'lost' ? 'e.g. Black leather wallet' : 'e.g. Blue water bottle'} /><div className="field"><label>Item category</label><select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></div></div><div className="field"><label>Description</label><textarea required value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Add colour, brand, markings or anything that helps identify it without revealing sensitive information." rows={4} /></div><div className="field"><label>Item photograph <span className="optional">Optional</span></label><label className="upload-box"><input type="file" accept="image/*" onChange={(event) => setImageName(event.target.files?.[0]?.name || '')} /><ImagePlus size={21} /><span>{imageName || 'Upload a clear photograph'}</span><small>PNG or JPG · Max 5MB</small></label></div></div><div className="form-card"><div className="form-card-heading"><span>02</span><div><h2>When and where</h2><p>Approximate details are helpful and always better than leaving it blank.</p></div></div><div className="form-grid three"><Field label={type === 'lost' ? 'Lost date' : 'Found date'} value={form.date} onChange={(value) => update('date', value)} placeholder="dd / mm / yyyy" type="date" /><Field label="Approximate time" value={form.time} onChange={(value) => update('time', value)} placeholder="e.g. 2:30 PM" type="time" /><div className="field"><label>College location</label><select value={form.location} onChange={(event) => update('location', event.target.value)}>{locations.map((location) => <option key={location}>{location}</option>)}</select></div></div><div className="field"><label>Exact location description</label><input required value={form.exactLocation} onChange={(event) => update('exactLocation', event.target.value)} placeholder="e.g. Second floor, outside room 204" /><small className="field-help">This helps our team make a better match. You can be as specific as you are comfortable with.</small></div><div className="field"><label>Additional information <span className="optional">Optional</span></label><textarea value={form.additional} onChange={(event) => update('additional', event.target.value)} placeholder="Anything else the administrator should know?" rows={3} /></div></div><div className="form-submit-row"><div className="form-privacy"><ShieldCheck size={19} /><span><strong>Privacy first</strong><small>Your contact details are never displayed publicly.</small></span></div><button className="button button-red" type="submit">Submit {type === 'lost' ? 'lost' : 'found'} report <ArrowRight size={17} /></button></div></form></section>;
}

function Browse({ reports, navigate, savedItems, toggleSaved }: { reports: Report[]; navigate: (view: View, id?: string) => void; savedItems: string[]; toggleSaved: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | ReportType>('all');
  const [category, setCategory] = useState('All categories');
  const [location, setLocation] = useState('All locations');
  const filtered = useMemo(() => reports.filter((report) => { const searchable = `${report.name} ${report.category} ${report.description} ${report.location}`.toLowerCase(); return searchable.includes(query.toLowerCase()) && (type === 'all' || report.type === type) && (category === 'All categories' || report.category === category) && (location === 'All locations' || report.location === location); }), [reports, query, type, category, location]);
  return <section className="browse-page page-wrap"><div className="browse-heading"><div><p className="eyebrow">COMMUNITY LISTINGS</p><h1>Browse items.</h1><p>Search recent reports from across the JECRC University campus.</p></div><button className="button button-red" onClick={() => navigate('lost')}><Plus size={17} /> New report</button></div><div className="browse-toolbar"><div className="browse-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search items, keywords or IDs" /></div><div className="filter-row"><div className="segmented"><button className={type === 'all' ? 'active' : ''} onClick={() => setType('all')}>All items</button><button className={type === 'lost' ? 'active' : ''} onClick={() => setType('lost')}>Lost</button><button className={type === 'found' ? 'active' : ''} onClick={() => setType('found')}>Found</button></div><Filter size={16} className="filter-icon" /><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={location} onChange={(event) => setLocation(event.target.value)}><option>All locations</option>{locations.map((item) => <option key={item}>{item}</option>)}</select><button className="clear-button" onClick={() => { setQuery(''); setType('all'); setCategory('All categories'); setLocation('All locations'); }}>Clear</button></div></div><div className="results-row"><span><strong>{filtered.length}</strong> listings found</span><span className="sort-label"><SlidersHorizontal size={15} /> Newest first <ChevronDown size={15} /></span></div><div className="report-grid browse-grid">{filtered.map((report) => <div className="report-card-wrap" key={report.id}><ReportCard report={report} onClick={() => navigate('detail', report.id)} /><button className={`save-card-button ${savedItems.includes(report.id) ? 'saved' : ''}`} onClick={() => toggleSaved(report.id)} aria-label="Save item"><Bookmark size={17} fill={savedItems.includes(report.id) ? 'currentColor' : 'none'} /></button></div>)}</div>{filtered.length === 0 && <div className="empty-state"><PackageSearch size={36} /><h3>No items match those filters.</h3><p>Try a broader search or clear your filters to see more community reports.</p></div>}</section>;
}

function Detail({ report, navigate, isSaved, toggleSaved, submitClaim }: { report: Report; navigate: (view: View, id?: string) => void; isSaved: boolean; toggleSaved: (id: string) => void; submitClaim: (report: Report, note: string) => void }) {
  const [claimOpen, setClaimOpen] = useState(false);
  const [note, setNote] = useState('');
  return <section className="detail-page page-wrap"><button className="back-button" onClick={() => navigate('browse')}><ChevronRight size={16} className="rotate-180" /> Back to browse</button><div className="detail-layout"><div className={`detail-visual visual-${report.icon}`}><span>{getIcon(report.icon, 82)}</span><small>{report.type === 'lost' ? 'LOST ITEM' : 'FOUND ITEM'}</small></div><div className="detail-content"><div className="report-card-meta"><span className={`status-pill ${report.type}`}>{report.type === 'lost' ? 'Lost item' : 'Found item'}</span><span>{report.id}</span></div><h1>{report.name}</h1><p className="detail-lead">{report.description}</p><div className="detail-facts"><div><MapPin size={18} /><span><small>Reported at</small><strong>{report.location}</strong><em>{report.exactLocation}</em></span></div><div><CalendarDays size={18} /><span><small>{report.type === 'lost' ? 'Lost on' : 'Found on'}</small><strong>{formatDate(report.date)}</strong><em>Approx. {report.time}</em></span></div><div><Activity size={18} /><span><small>Current status</small><strong>{report.status}</strong><em>Updated by JU FindIt team</em></span></div></div><div className="detail-actions"><button className="button button-red" onClick={() => setClaimOpen(true)}><ShieldCheck size={17} /> Request claim</button><button className={`button button-soft ${isSaved ? 'is-saved' : ''}`} onClick={() => toggleSaved(report.id)}><Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save item'}</button><button className="button button-ghost" onClick={() => navigate(report.type === 'lost' ? 'lost' : 'found')}>Report similar item</button></div><div className="detail-notice"><LockKeyhole size={18} /><div><strong>Private by design</strong><p>Registration numbers, email addresses and claim details are only shared with authorised administrators during verification.</p></div></div></div></div><div className="detail-bottom"><div><p className="eyebrow">GOOD TO KNOW</p><h2>How claims work</h2><p>When you request a claim, you’ll privately share an identifying detail. Our administrator reviews it against the report before approving a safe handover.</p></div><div className="mini-steps"><span><b>1</b> Request claim</span><ArrowRight size={15} /><span><b>2</b> Admin reviews</span><ArrowRight size={15} /><span><b>3</b> Safe return</span></div></div>{claimOpen && <div className="modal-backdrop" onClick={() => setClaimOpen(false)}><div className="modal-card" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setClaimOpen(false)}><X size={18} /></button><span className="modal-icon"><ShieldCheck size={22} /></span><p className="eyebrow">PRIVATE CLAIM REQUEST</p><h2>Could this be yours?</h2><p>Share one detail only the true owner would know. It stays private and goes directly to the administrator review queue.</p><div className="field"><label>Ownership detail</label><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="e.g. A unique mark, screen wallpaper or what was inside (do not share passwords)." rows={4} /></div><button className="button button-red full-width" onClick={() => { submitClaim(report, note || 'Ownership detail shared privately for review.'); setClaimOpen(false); }}>Send private claim request <ArrowRight size={17} /></button></div></div>}</section>;
}

function Dashboard({ reports, claims, savedItems, navigate }: { reports: Report[]; claims: Claim[]; savedItems: string[]; navigate: (view: View, id?: string) => void }) {
  const myReports = reports.filter((report) => report.reporter === 'Demo Student' || report.id === 'JF-24085' || report.id === 'JF-24091');
  const saved = reports.filter((report) => savedItems.includes(report.id));
  return <section className="dashboard-page page-wrap"><div className="dashboard-heading"><div><p className="eyebrow">YOUR SPACE</p><h1>Good morning, Aarav.</h1><p>Here’s what’s happening with your campus reports.</p></div><button className="button button-red" onClick={() => navigate('lost')}><Plus size={17} /> Create a report</button></div><div className="profile-banner"><div className="profile-large">AS</div><div><h3>Aarav Sharma</h3><p>22BCS1047 · B.Tech Computer Science</p><span><CheckCircle2 size={14} /> Student account verified</span></div><button className="button button-outline" onClick={() => navigate('auth')}>Account settings</button></div><div className="dashboard-stats"><div><span className="stat-icon blue"><FileText size={18} /></span><strong>{myReports.length}</strong><small>My reports</small></div><div><span className="stat-icon red"><Inbox size={18} /></span><strong>{claims.filter((claim) => claim.claimant === 'Demo Student' || claim.status === 'Pending').length}</strong><small>Open claims</small></div><div><span className="stat-icon green"><Bookmark size={18} /></span><strong>{saved.length}</strong><small>Saved items</small></div><div><span className="stat-icon amber"><Bell size={18} /></span><strong>3</strong><small>Notifications</small></div></div><div className="dashboard-columns"><div className="dashboard-main"><div className="subsection-heading"><div><p className="eyebrow">TRACK YOUR REPORTS</p><h2>My activity</h2></div><button className="text-button" onClick={() => navigate('browse')}>View all <ArrowRight size={15} /></button></div><div className="activity-list">{myReports.slice(0, 4).map((report) => <button className="activity-item" key={report.id} onClick={() => navigate('detail', report.id)}><div className={`activity-icon visual-${report.icon}`}>{getIcon(report.icon, 20)}</div><div className="activity-copy"><strong>{report.name}</strong><span>{report.type === 'lost' ? 'Lost report' : 'Found report'} · {report.id}</span></div><span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</span><ChevronRight size={17} /></button>)}{myReports.length === 0 && <div className="empty-state small"><FileText size={27} /><p>You haven’t created a report yet.</p></div>}</div><div className="subsection-heading saved-heading"><div><p className="eyebrow">KEEP AN EYE ON IT</p><h2>Saved items</h2></div><button className="text-button" onClick={() => navigate('browse')}>Browse more <ArrowRight size={15} /></button></div><div className="saved-row">{saved.slice(0, 3).map((report) => <button className="saved-mini-card" key={report.id} onClick={() => navigate('detail', report.id)}><div className={`mini-visual visual-${report.icon}`}>{getIcon(report.icon, 24)}</div><strong>{report.name}</strong><span>{report.location} · {formatDate(report.date)}</span></button>)}{saved.length === 0 && <div className="saved-empty"><Bookmark size={18} /> Items you save will appear here.</div>}</div></div><aside className="dashboard-side"><div className="side-card"><div className="side-card-title"><span><Bell size={17} /> Notifications</span><b>3</b></div><div className="notification-list"><div><span className="notification-mark red" /><p><strong>Potential match found</strong><small>Black wallet · 12 min ago</small></p></div><div><span className="notification-mark blue" /><p><strong>Report under review</strong><small>Our team is checking JF-24091</small></p></div><div><span className="notification-mark green" /><p><strong>Claim approved</strong><small>Marketing textbook · 2 days ago</small></p></div></div><button className="side-link" onClick={() => navigate('matching')}>Open smart match <ArrowRight size={15} /></button></div><div className="side-card help-card"><Sparkles size={21} /><h3>Need a hand?</h3><p>JU Assist can help you find a report or understand a status.</p><button className="side-link" onClick={() => navigate('home')}>Ask JU Assist <MessageCircle size={15} /></button></div></aside></div></section>;
}

function Matching({ reports, navigate, submitClaim }: { reports: Report[]; navigate: (view: View, id?: string) => void; submitClaim: (report: Report, note: string) => void }) {
  const lost = reports.find((report) => report.id === 'JF-24091') || reports.find((report) => report.type === 'lost');
  const matches = reports.filter((report) => report.type === 'found').map((report) => ({ report, score: report.location === lost?.location && report.category === lost.category ? 94 : report.category === lost?.category ? 71 : 42 })).sort((a, b) => b.score - a.score).slice(0, 3);
  return <section className="matching-page page-wrap"><div className="matching-heading"><div><p className="eyebrow">SMART MATCH</p><h1>Connections, surfaced.</h1><p>Our prototype matching engine compares report details to highlight promising possibilities. An administrator always makes the final call.</p></div><div className="match-engine"><Sparkles size={20} /><span>Rule-based engine<br /><small>Prototype mode</small></span></div></div><div className="match-summary"><div className="match-summary-icon"><Sparkles size={24} /></div><div><span>Analysing your report</span><strong>{lost?.name}</strong><small>{lost?.location} · {formatDate(lost?.date || '')}</small></div><button className="button button-soft" onClick={() => navigate('detail', lost?.id)}>View report <ArrowRight size={15} /></button></div><div className="matching-grid"><div className="match-source"><div className="match-label"><span className="label-dot lost" /> Your lost report</div>{lost && <ReportCard report={lost} onClick={() => navigate('detail', lost.id)} />}</div><div className="match-connector"><div><Sparkles size={18} /><span>Potential<br />matches</span></div></div><div className="match-results"><div className="match-label"><span className="label-dot found" /> Found reports near your details</div>{matches.map(({ report, score }) => <div className="match-result" key={report.id}><div className={`match-result-visual visual-${report.icon}`}>{getIcon(report.icon, 26)}</div><div className="match-result-copy"><div><strong>{report.name}</strong><span className="confidence"><b>{score}%</b> match</span></div><p><MapPin size={13} /> {report.location} · {formatDate(report.date)}</p><div className="match-factors"><span>Category</span>{report.location === lost?.location && <span>Location</span>}<span>Keywords</span></div></div><button className="icon-button bordered" onClick={() => navigate('detail', report.id)} aria-label="View match"><ArrowUpRight size={17} /></button></div>)}</div></div><div className="matching-footer"><div><ShieldCheck size={19} /><span><strong>Human-led verification</strong><small>Smart Match suggests. JU administrators verify.</small></span></div><button className="button button-navy" onClick={() => matches[0] && submitClaim(matches[0].report, 'I believe this may be my item. Please review the matching details privately.')}>Request a claim review <ArrowRight size={16} /></button></div></section>;
}

function Admin({ reports, claims, navigate, updateClaim, setReports }: { reports: Report[]; claims: Claim[]; navigate: (view: View, id?: string) => void; updateClaim: (id: string, status: Claim['status']) => void; setReports: (reports: Report[]) => void }) {
  const [tab, setTab] = useState<'overview' | 'reports' | 'claims' | 'users'>('overview');
  const pending = claims.filter((claim) => claim.status === 'Pending');
  const markReturned = (id: string) => { setReports(reports.map((report) => report.id === id ? { ...report, status: 'Resolved' } : report)); };
  return <section className="admin-page page-wrap"><div className="admin-heading"><div><p className="eyebrow">AUTHORISED CONSOLE</p><h1>Admin overview.</h1><p>Review activity, protect privacy and help the right items find their people.</p></div><div className="admin-user"><span className="admin-avatar">AD</span><span><strong>Admin desk</strong><small>JECRC authorised</small></span></div></div><div className="admin-tabs">{[{ id: 'overview', label: 'Overview', icon: Activity }, { id: 'reports', label: 'All reports', icon: FileText }, { id: 'claims', label: `Claim queue ${pending.length}`, icon: ShieldCheck }, { id: 'users', label: 'Users', icon: Users }].map((item) => <button className={tab === item.id ? 'active' : ''} key={item.id} onClick={() => setTab(item.id as typeof tab)}><item.icon size={16} />{item.label}</button>)}</div>{tab === 'overview' && <><div className="admin-metrics"><div><span className="metric-symbol blue"><Users size={17} /></span><strong>248</strong><small>Total users</small><em>+12 this month</em></div><div><span className="metric-symbol red"><FileText size={17} /></span><strong>{reports.filter((report) => report.type === 'lost').length}</strong><small>Lost reports</small><em>8 active</em></div><div><span className="metric-symbol amber"><Inbox size={17} /></span><strong>{reports.filter((report) => report.type === 'found').length}</strong><small>Found reports</small><em>3 pending review</em></div><div><span className="metric-symbol purple"><ShieldCheck size={17} /></span><strong>{pending.length}</strong><small>Pending claims</small><em>Needs attention</em></div><div><span className="metric-symbol green"><CheckCircle2 size={17} /></span><strong>812</strong><small>Items returned</small><em>+24 this month</em></div></div><div className="admin-overview-grid"><div className="admin-table-card"><div className="table-card-heading"><div><p className="eyebrow">NEEDS ATTENTION</p><h2>Claim review queue</h2></div><button className="text-button" onClick={() => setTab('claims')}>View queue <ArrowRight size={15} /></button></div><AdminClaimTable claims={pending.slice(0, 3)} updateClaim={updateClaim} /></div><div className="admin-table-card activity-card"><div className="table-card-heading"><div><p className="eyebrow">LIVE PULSE</p><h2>Activity overview</h2></div><Activity size={18} /></div><div className="admin-activity"><div><span className="activity-line blue" /><p><strong>New found report</strong><small>Android mobile phone · 9 minutes ago</small></p></div><div><span className="activity-line red" /><p><strong>Claim submitted</strong><small>White wireless earbuds · 42 minutes ago</small></p></div><div><span className="activity-line green" /><p><strong>Item marked resolved</strong><small>Marketing textbook · 2 days ago</small></p></div><div><span className="activity-line amber" /><p><strong>Report flagged</strong><small>Compact black backpack · 3 days ago</small></p></div></div></div></div></>}{tab === 'claims' && <div className="admin-table-card full-table"><div className="table-card-heading"><div><p className="eyebrow">PRIVATE REVIEW QUEUE</p><h2>Claim requests</h2></div><button className="icon-button bordered"><RefreshCcw size={17} /></button></div><AdminClaimTable claims={claims} updateClaim={updateClaim} /></div>}{tab === 'reports' && <div className="admin-table-card full-table"><div className="table-card-heading"><div><p className="eyebrow">CAMPUS LISTINGS</p><h2>Manage reports</h2></div><button className="button button-soft"><Filter size={15} /> Filter</button></div><div className="table-wrap"><table><thead><tr><th>Item</th><th>Type</th><th>Location</th><th>Reported</th><th>Status</th><th>Action</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td><div className="table-item"><span className={`table-icon visual-${report.icon}`}>{getIcon(report.icon, 16)}</span><span><strong>{report.name}</strong><small>{report.id}</small></span></div></td><td><span className={`status-pill ${report.type}`}>{report.type}</span></td><td>{report.location}</td><td>{formatDate(report.date)}</td><td><span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</span></td><td><button className="table-action" onClick={() => navigate('detail', report.id)}><Eye size={15} /> View</button>{report.status !== 'Resolved' && <button className="table-action" onClick={() => markReturned(report.id)}><Check size={15} /> Resolve</button>}</td></tr>)}</tbody></table></div></div>}{tab === 'users' && <div className="admin-table-card full-table"><div className="table-card-heading"><div><p className="eyebrow">COMMUNITY ACCESS</p><h2>Users & roles</h2></div><button className="button button-soft"><Plus size={15} /> Invite staff</button></div><div className="table-wrap"><table><thead><tr><th>User</th><th>Registration</th><th>Role</th><th>Reports</th><th>Joined</th><th /></tr></thead><tbody>{[['Aarav Sharma', '22BCS1047', 'Student', '4', 'Aug 2024'], ['Meera Singh', '23BBA2018', 'Student', '2', 'Sep 2024'], ['Dr. Nidhi Gupta', 'FAC-0091', 'Faculty', '8', 'Jan 2023'], ['Admin desk', 'JU-ADMIN-01', 'Administrator', '—', 'May 2022']].map((user) => <tr key={user[1]}><td><div className="table-item"><span className="user-table-avatar">{user[0].split(' ').map((part) => part[0]).join('')}</span><strong>{user[0]}</strong></div></td><td>{user[1]}</td><td><span className={`role-tag ${user[2].toLowerCase()}`}>{user[2]}</span></td><td>{user[3]}</td><td>{user[4]}</td><td><button className="icon-button"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></div>}</section>;
}

function AdminClaimTable({ claims, updateClaim }: { claims: Claim[]; updateClaim: (id: string, status: Claim['status']) => void }) {
  if (claims.length === 0) return <div className="empty-state small"><CheckCircle2 size={27} /><p>Nothing needs attention right now.</p></div>;
  return <div className="table-wrap"><table><thead><tr><th>Claimant</th><th>Item</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead><tbody>{claims.map((claim) => <tr key={claim.id}><td><div className="table-item"><span className="user-table-avatar">{claim.claimant.split(' ').map((part) => part[0]).join('')}</span><span><strong>{claim.claimant}</strong><small>{claim.id}</small></span></div></td><td><strong>{claim.reportName}</strong><small className="table-subtext">{claim.note}</small></td><td>{claim.submitted}</td><td><span className={`status-badge claim-${claim.status.toLowerCase()}`}>{claim.status}</span></td><td>{claim.status === 'Pending' ? <div className="table-actions"><button className="approve-button" onClick={() => updateClaim(claim.id, 'Approved')}><Check size={14} /> Approve</button><button className="reject-button" onClick={() => updateClaim(claim.id, 'Rejected')}><X size={14} /> Reject</button></div> : <span className="muted">Reviewed</span>}</td></tr>)}</tbody></table></div>;
}

function Chatbot({ open, setOpen, reports, navigate }: { open: boolean; setOpen: (open: boolean) => void; reports: Report[]; navigate: (view: View, id?: string) => void }) {
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([{ from: 'bot', text: 'Hi, I’m JU Assist. I can help you find a report, understand a status or learn how to use JU FindIt.' }]);
  const [input, setInput] = useState('');
  const suggestions = ['How do I report a lost item?', 'Are there any matching items?', 'How does claim verification work?'];
  const answer = (question: string) => { const lower = question.toLowerCase(); if (lower.includes('report')) return 'Choose Report Lost or Report Found from the home page. Add the essentials, location and an optional photo, then submit. Your report ID is generated immediately.'; if (lower.includes('match')) return `I found ${reports.filter((report) => report.type === 'found').length} found reports in the demo listings. Smart Match compares item, category, keywords, location and date.`; if (lower.includes('claim')) return 'Claims are private. Share an identifying detail and an authorised administrator reviews it before approving a safe return.'; if (lower.includes('location')) return 'You can choose from NYB, VIB, KIB, KAB, Cafeteria, Mess, Sports Complex, Cricket Ground, Football Ground or a specific location.'; return 'I can guide you through reports, search, locations, matches and claim verification. Try one of the suggested questions below.'; };
  const send = (text = input) => { if (!text.trim()) return; setMessages((current) => [...current, { from: 'user', text }, { from: 'bot', text: answer(text) }]); setInput(''); };
  return <><button className={`chat-fab ${open ? 'active' : ''}`} onClick={() => setOpen(!open)} aria-label="Open JU Assist">{open ? <X size={22} /> : <MessageCircle size={23} />}<span className="chat-ping" /></button>{open && <div className="chat-window"><div className="chat-header"><div className="chat-avatar"><Sparkles size={17} /></div><div><strong>JU Assist</strong><span>Your campus guide · Demo mode</span></div><button onClick={() => setOpen(false)}><X size={17} /></button></div><div className="chat-messages">{messages.map((message, index) => <div className={`chat-message ${message.from}`} key={`${message.text}-${index}`}>{message.text}</div>)}{messages.length === 1 && <div className="chat-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => send(suggestion)}>{suggestion}<ArrowUpRight size={13} /></button>)}</div>}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); send(); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask JU Assist..." /><button type="submit" aria-label="Send"><Send size={16} /></button></form><button className="chat-browse" onClick={() => { setOpen(false); navigate('browse'); }}>Browse listings <ArrowRight size={14} /></button></div>}</>;
}

function Footer({ navigate }: { navigate: (view: View) => void }) {
  return <footer className="footer"><div className="page-wrap footer-grid"><div className="footer-brand"><button className="brand brand-light" onClick={() => navigate('home')}><span className="brand-mark"><ShieldCheck size={21} /></span><span><strong>JU <em>FindIt</em></strong><small>JECRC UNIVERSITY</small></span></button><p>Helping the JECRC community look out for one another, one report at a time.</p></div><div><h4>Explore</h4><button onClick={() => navigate('browse')}>Browse items</button><button onClick={() => navigate('matching')}>Smart Match</button><button onClick={() => navigate('dashboard')}>My dashboard</button></div><div><h4>Report</h4><button onClick={() => navigate('lost')}>Lost something?</button><button onClick={() => navigate('found')}>Found something?</button><button onClick={() => navigate('auth')}>Sign in</button></div><div><h4>Need help?</h4><p>For urgent campus matters, please contact the university help desk.</p><span className="footer-contact">helpdesk@jecrc.ac.in</span></div></div><div className="page-wrap footer-bottom"><span>© 2024 JU FindIt · A JECRC University prototype</span><span><ShieldCheck size={14} /> Your privacy matters</span></div></footer>;
}

export default App;
