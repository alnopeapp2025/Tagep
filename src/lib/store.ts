import { Transaction } from '@/pages/TransactionsPage';
import { supabase } from './supabase';

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
const CURRENT_USER_KEY = 'moaqeb_current_user_v1'; // Session Storage
const LAST_BACKUP_KEY = 'moaqeb_last_backup_v1';

// --- User Management (Supabase Auth) ---

// Simple Hash Function
const hashPassword = (pwd: string) => {
  return btoa(pwd).split('').reverse().join(''); 
};

export const registerUser = async (user: Omit<User, 'id' | 'createdAt' | 'passwordHash'> & { password: string }) => {
  try {
    // 1. Check if phone exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('phone')
      .eq('phone', user.phone);

    if (checkError) {
        console.error('Check error:', checkError);
        return { success: false, message: 'حدث خطأ أثناء التحقق من البيانات' };
    }

    if (existingUsers && existingUsers.length > 0) {
      return { success: false, message: 'رقم الهاتف مسجل مسبقاً' };
    }

    // 2. Insert new user
    const passwordHash = hashPassword(user.password);
    
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          office_name: user.officeName,
          phone: user.phone,
          password_hash: passwordHash,
          security_question: user.securityQuestion,
          security_answer: user.securityAnswer
        }
      ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return { success: false, message: 'فشل إنشاء الحساب، يرجى المحاولة لاحقاً' };
    }

    return { success: true };
  } catch (err) {
    console.error('Registration error:', err);
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
};

export const loginUser = async (phone: string, password: string) => {
  try {
    const passwordHash = hashPassword(password);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .eq('password_hash', passwordHash)
      .single();

    if (error || !data) {
      return { success: false, message: 'بيانات الدخول غير صحيحة' };
    }

    // Map DB columns to User interface
    const user: User = {
        id: data.id,
        officeName: data.office_name,
        phone: data.phone,
        passwordHash: data.password_hash,
        securityQuestion: data.security_question,
        securityAnswer: data.security_answer,
        createdAt: new Date(data.created_at).getTime()
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
  }
};

export const changePassword = async (phone: string, oldPass: string, newPass: string) => {
  try {
    const oldHash = hashPassword(oldPass);
    
    // 1. Verify old password
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .eq('password_hash', oldHash)
      .single();

    if (error || !data) {
      return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };
    }

    // 2. Update to new password
    const newHash = hashPassword(newPass);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newHash })
      .eq('id', data.id);

    if (updateError) {
      return { success: false, message: 'فشل تحديث كلمة المرور' };
    }

    return { success: true };
  } catch (err) {
    console.error('Change password error:', err);
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
};

// --- Password Recovery Functions ---

export const verifySecurityInfo = async (phone: string, question: string, answer: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .eq('security_question', question)
      .eq('security_answer', answer)
      .single();

    if (error || !data) {
      return { success: false, message: 'البيانات غير متطابقة' };
    }

    return { success: true };
  } catch (err) {
    console.error('Verification error:', err);
    return { success: false, message: 'حدث خطأ أثناء التحقق' };
  }
};

export const resetPassword = async (phone: string, newPassword: string) => {
  try {
    const passwordHash = hashPassword(newPassword);

    const { error } = await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('phone', phone);

    if (error) {
      return { success: false, message: 'فشل تحديث كلمة المرور' };
    }

    return { success: true };
  } catch (err) {
    console.error('Reset password error:', err);
    return { success: false, message: 'حدث خطأ أثناء التحديث' };
  }
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

// --- Expense Management (Cloud) ---

export const addExpenseToCloud = async (expense: Expense, userId: number) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          user_id: userId,
          title: expense.title,
          amount: expense.amount,
          bank: expense.bank,
          date: expense.date // Sending date as BIGINT (Date.now())
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Insert Error:', JSON.stringify(error, null, 2));
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error syncing expense (Exception):', err);
    return false;
  }
};

export const fetchExpensesFromCloud = async (userId: number): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }

    // Map DB columns to Expense interface
    // Note: DB 'id' is int8 (number), 'date' is bigint (number)
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      amount: Number(item.amount),
      bank: item.bank,
      date: Number(item.date)
    }));
  } catch (err) {
    console.error('Fetch exception:', err);
    return [];
  }
};

export const deleteExpenseFromCloud = async (id: number) => {
    try {
        const { error } = await supabase.from('expenses').delete().eq('id', id);
        if (error) {
            console.error('Delete error', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Delete exception', err);
        return false;
    }
}

// --- Agent Management (Cloud) ---

export const addAgentToCloud = async (agent: Agent, userId: number) => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .insert([
        {
          user_id: userId,
          name: agent.name,
          phone: agent.phone,
          whatsapp: agent.whatsapp
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Insert Error (Agents):', JSON.stringify(error, null, 2));
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error syncing agent (Exception):', err);
    return false;
  }
};

export const fetchAgentsFromCloud = async (userId: number): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agents:', error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      whatsapp: item.whatsapp,
      createdAt: new Date(item.created_at).getTime()
    }));
  } catch (err) {
    console.error('Fetch agents exception:', err);
    return [];
  }
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

export const getLastBackupTime = () => {
  return localStorage.getItem(LAST_BACKUP_KEY);
};

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
    timestamp: Date.now()
  };
  
  // Save backup timestamp
  localStorage.setItem(LAST_BACKUP_KEY, Date.now().toString());
  
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
