import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { ScannerView } from './components/ScannerView';
import { Education } from './views/Education';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard setView={setCurrentView} />;
      case AppView.URL_SCANNER:
        return (
          <ScannerView 
            type="URL" 
            title="Malicious URL Scanner" 
            description="Detect phishing links, malware distribution sites, and suspicious domains using AI heuristics."
            placeholder="https://example.com/suspicious-path"
          />
        );
      case AppView.EMAIL_SCANNER:
        return (
          <ScannerView 
            type="EMAIL" 
            title="Email Spam & Phishing Detector" 
            description="Analyze email headers and body text for social engineering, spam patterns, and malicious intent."
            placeholder="Paste raw email content here..."
          />
        );
      case AppView.TRANSACTION_SCANNER:
        return (
          <ScannerView 
            type="TRANSACTION" 
            title="Transaction Anomaly Detector" 
            description="Identify fraudulent financial patterns or irregular behavior in transaction logs. Input data including amount, location, and time."
            placeholder='{
  "transaction_id": "TXN_99283",
  "amount": 15000.00,
  "currency": "USD",
  "location": "Lagos, Nigeria",
  "user_home_location": "New York, USA",
  "time": "03:15 AM",
  "merchant": "Unknown Electronics Store"
}'
          />
        );
      case AppView.CODE_SCANNER:
        return (
          <ScannerView 
            type="CODE" 
            title="Vulnerability Code Scanner" 
            description="Static analysis of code snippets to identify potential security flaws like SQL Injection or XSS."
            placeholder="def login(user): query = 'SELECT * FROM users WHERE name=' + user..."
          />
        );
      case AppView.PASSWORD_CHECKER:
        return (
          <ScannerView 
            type="PASSWORD" 
            title="Password Strength Audit" 
            description="Evaluate password entropy and resistance to brute-force or dictionary attacks."
            placeholder="Enter password to test..."
          />
        );
      case AppView.EDUCATION:
        return <Education />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;