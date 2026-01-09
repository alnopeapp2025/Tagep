import { Transaction } from '@/pages/TransactionsPage';

// Re-export Transaction so other files can import it from store
export type { Transaction };

// --- Constants ---
export const BANKS_LIST = [
  "الراجحي", "الأهلي", "الإنماء", "البلاد", "بنك stc", 
  "الرياض", "الجزيرة", "ساب", "نقداً كاش", "بنك آخر"
];

export const INITIAL_BALANCES: Record<string, number> = BANKS_LIST.reduce((acc, bank) => ({ ...acc, [bank]: 0 }), {});

// --- Types ---
export interface User {
  id: number;
  officeName: string;
  phone: string;
  passwordHash: string; // Hashed Password
  securityQuestion: string;
  securityAnswer: string;
  createdAt: number;
}

export interface Client {
  id: number;
  name: string;
  phone?: string;     // Mobile Number
  whatsapp?: string;  // WhatsApp Number
  createdAt: number;
}

export interface Agent {
  id: number;
  name: string;
  phone?: string;     // Mobile Number
  whatsapp?: string;  // WhatsApp Number
  createdAt: number;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  bank: string;
  date: number;
}

// New Types for Achievers Hub
export interface ExternalAgent {
  id: number;
  name: string;
  phone: string;
  createdAt: number;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  createdAt: number;
}

// New Type for Agent Transfers Report
export interface AgentTransferRecord {
  id: number;
  agentName: string;
  amount: number;
  bank: string;
  date: number;
  transactionCount: number;
}

// New Type for Client Refunds Report
export interface ClientRefundRecord {
  id: number;
  clientName: string;
  amount: number;
  bank: string;
  date: number;
  transactionCount: number;
}

export interface AppData {
  transactions: Transaction[];
  balances: Record<string, number>;
}

// --- Local Storage Helpers ---
const TX_KEY = 'moaqeb_transactions_v1';
const BAL_KEY = 'moaqeb_balances_v1';
const PENDING_BAL_KEY = 'moaqeb_pending_balances_v1';
const CLIENTS_KEY = 'moaqeb_clients_v1';
const AGENTS_KEY = 'moaqeb_agents_v1';
const EXPENSES_KEY = 'moaqeb_expenses_v1';
const EXT_AGENTS_KEY = 'moaqeb_ext_agents_v1';
const LESSONS_KEY = 'moaqeb_lessons_v1';
const AGENT_TRANSFERS_KEY = 'moaqeb_agent_transfers_v1';
const CLIENT_REFUNDS_KEY = 'moaqeb_client_refunds_v1';
const USERS_KEY = 'moaqeb_users_v1'; // NEW: Users Storage
const CURRENT_USER_KEY = 'moaqeb_current_user_v1'; // NEW: Session Storage

// --- User Management (Auth) ---

// Simple Hash Function (Simulation for Frontend)
const hashPassword = (pwd: string) => {
  return btoa(pwd).split('').reverse().join(''); // Simple obfuscation
};

export const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const registerUser = (user: Omit<User, 'id' | 'createdAt' | 'passwordHash'> & { password: string }) => {
  const users = getStoredUsers();
  
  // Check if phone exists
  if (users.find(u => u.phone === user.phone)) {
    return { success: false, message: 'رقم الهاتف مسجل مسبقاً' };
  }

  const newUser: User = {
    id: Date.now(),
    officeName: user.officeName,
    phone: user.phone,
    passwordHash: hashPassword(user.password),
    securityQuestion: user.securityQuestion,
    securityAnswer: user.securityAnswer,
    createdAt: Date.now()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, user: newUser };
};

export const loginUser = (phone: string, password: string) => {
  const users = getStoredUsers();
  const user = users.find(u => u.phone === phone && u.passwordHash === hashPassword(password));
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'بيانات الدخول غير صحيحة' };
};

export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};


// Transactions
export const getStoredTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(TX_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveStoredTransactions = (txs: Transaction[]) => {
  localStorage.setItem(TX_KEY, JSON.stringify(txs));
};

// Balances (Actual Treasury)
export const getStoredBalances = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem(BAL_KEY);
    return stored ? JSON.parse(stored) : INITIAL_BALANCES;
  } catch {
    return INITIAL_BALANCES;
  }
};

export const saveStoredBalances = (balances: Record<string, number>) => {
  localStorage.setItem(BAL_KEY, JSON.stringify(balances));
};

// Pending Balances (Unearned Treasury)
export const getStoredPendingBalances = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem(PENDING_BAL_KEY);
    return stored ? JSON.parse(stored) : INITIAL_BALANCES;
  } catch {
    return INITIAL_BALANCES;
  }
};

export const saveStoredPendingBalances = (balances: Record<string, number>) => {
  localStorage.setItem(PENDING_BAL_KEY, JSON.stringify(balances));
};

// Clients
export const getStoredClients = (): Client[] => {
  try {
    const stored = localStorage.getItem(CLIENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveStoredClients = (clients: Client[]) => {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

// Agents
export const getStoredAgents = (): Agent[] => {
  try {
    const stored = localStorage.getItem(AGENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveStoredAgents = (agents: Agent[]) => {
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
};

// Expenses
export const getStoredExpenses = (): Expense[] => {
  try {
    const stored = localStorage.getItem(EXPENSES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveStoredExpenses = (expenses: Expense[]) => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

// External Agents (Achievers Hub)
export const getStoredExtAgents = (): ExternalAgent[] => {
  try {
    const stored = localStorage.getItem(EXT_AGENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveStoredExtAgents = (agents: ExternalAgent[]) => {
  localStorage.setItem(EXT_AGENTS_KEY, JSON.stringify(agents));
};

// Lessons (Achievers Hub)
export const getStoredLessons = (): Lesson[] => {
  try {
    const stored = localStorage.getItem(LESSONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveStoredLessons = (lessons: Lesson[]) => {
  localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
};

// Agent Transfers Records
export const getStoredAgentTransfers = (): AgentTransferRecord[] => {
  try {
    const stored = localStorage.getItem(AGENT_TRANSFERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveStoredAgentTransfers = (records: AgentTransferRecord[]) => {
  localStorage.setItem(AGENT_TRANSFERS_KEY, JSON.stringify(records));
};

// Client Refunds Records
export const getStoredClientRefunds = (): ClientRefundRecord[] => {
  try {
    const stored = localStorage.getItem(CLIENT_REFUNDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveStoredClientRefunds = (records: ClientRefundRecord[]) => {
  localStorage.setItem(CLIENT_REFUNDS_KEY, JSON.stringify(records));
};

// --- Logic Helpers ---
export const calculateAchievers = (transactions: Transaction[]) => {
  const achievers: Record<string, { count: number; total: number }> = {};

  transactions.filter(t => t.status === 'completed').forEach(t => {
    if (!achievers[t.agent]) {
      achievers[t.agent] = { count: 0, total: 0 };
    }
    achievers[t.agent].count += 1;
    achievers[t.agent].total += parseFloat(String(t.clientPrice)) || 0;
  });

  return Object.entries(achievers)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total); // Sort by revenue
};

// --- Backup & Restore & Delete ---

export const createBackup = () => {
  const data = {
    transactions: getStoredTransactions(),
    balances: getStoredBalances(),
    pendingBalances: getStoredPendingBalances(),
    clients: getStoredClients(),
    agents: getStoredAgents(),
    expenses: getStoredExpenses(),
    extAgents: getStoredExtAgents(),
    lessons: getStoredLessons(),
    agentTransfers: getStoredAgentTransfers(),
    clientRefunds: getStoredClientRefunds(),
    users: getStoredUsers(), // Include Users
    timestamp: Date.now()
  };
  return JSON.stringify(data);
};

export const restoreBackup = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    if (data.transactions) saveStoredTransactions(data.transactions);
    if (data.balances) saveStoredBalances(data.balances);
    if (data.pendingBalances) saveStoredPendingBalances(data.pendingBalances);
    if (data.clients) saveStoredClients(data.clients);
    if (data.agents) saveStoredAgents(data.agents);
    if (data.expenses) saveStoredExpenses(data.expenses);
    if (data.extAgents) saveStoredExtAgents(data.extAgents);
    if (data.lessons) saveStoredLessons(data.lessons);
    if (data.agentTransfers) saveStoredAgentTransfers(data.agentTransfers);
    if (data.clientRefunds) saveStoredClientRefunds(data.clientRefunds);
    if (data.users) localStorage.setItem(USERS_KEY, JSON.stringify(data.users));
    return true;
  } catch (e) {
    console.error("Restore failed", e);
    return false;
  }
};

export const clearAgents = () => localStorage.removeItem(AGENTS_KEY);
export const clearClients = () => localStorage.removeItem(CLIENTS_KEY);
export const clearTransactions = () => localStorage.removeItem(TX_KEY);
export const clearAllData = () => {
  localStorage.clear();
};
