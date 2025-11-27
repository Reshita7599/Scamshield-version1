export enum RiskLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  MALICIOUS = 'MALICIOUS',
  UNKNOWN = 'UNKNOWN'
}

export interface SecurityAnalysisResult {
  riskLevel: RiskLevel;
  score: number; // 0 to 100
  summary: string;
  details: string[];
  recommendation: string;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: 'News' | 'Best Practice' | 'Exploit';
  readTime: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  URL_SCANNER = 'URL_SCANNER',
  EMAIL_SCANNER = 'EMAIL_SCANNER',
  TRANSACTION_SCANNER = 'TRANSACTION_SCANNER',
  CODE_SCANNER = 'CODE_SCANNER',
  PASSWORD_CHECKER = 'PASSWORD_CHECKER',
  EDUCATION = 'EDUCATION',
}