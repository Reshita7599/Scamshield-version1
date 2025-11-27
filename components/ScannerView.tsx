import React, { useState } from 'react';
import { analyzeSecurityData, checkPasswordStrength } from '../services/geminiService';
import { RiskLevel, SecurityAnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, ShieldAlert, Loader2, Copy, RefreshCw, Search, Terminal } from 'lucide-react';

interface ScannerViewProps {
  type: 'URL' | 'EMAIL' | 'TRANSACTION' | 'CODE' | 'PASSWORD';
  title: string;
  description: string;
  placeholder: string;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ type, title, description, placeholder }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SecurityAnalysisResult | null>(null);

  const handleScan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    let res: SecurityAnalysisResult;
    if (type === 'PASSWORD') {
        res = await checkPasswordStrength(input);
    } else {
        // We know type is not PASSWORD here due to logic, but TS needs help or split
        res = await analyzeSecurityData(input, type as 'URL' | 'EMAIL' | 'TRANSACTION' | 'CODE');
    }
    
    setResult(res);
    setLoading(false);
  };

  const handleLoadSample = () => {
    setInput(placeholder);
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return 'text-cyber-neon border-cyber-neon';
      case RiskLevel.SUSPICIOUS: return 'text-yellow-400 border-yellow-400';
      case RiskLevel.MALICIOUS: return 'text-cyber-alert border-cyber-alert';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return <CheckCircle size={40} className="text-cyber-neon" />;
      case RiskLevel.SUSPICIOUS: return <AlertTriangle size={40} className="text-yellow-400" />;
      case RiskLevel.MALICIOUS: return <ShieldAlert size={40} className="text-cyber-alert" />;
      default: return <Loader2 size={40} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 max-w-2xl">{description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-cyber-dark border border-gray-800 rounded-xl p-6 shadow-xl relative">
            <div className="absolute top-4 right-4 z-10">
                <button 
                    onClick={handleLoadSample}
                    className="flex items-center space-x-1 text-xs text-cyber-neon hover:text-white transition-colors bg-gray-900 px-2 py-1 rounded border border-gray-800 hover:border-gray-600"
                    title="Load Sample Data"
                >
                    <Terminal size={12} />
                    <span>LOAD_SAMPLE</span>
                </button>
            </div>

          <label className="block text-sm font-mono text-gray-400 mb-2">TARGET_INPUT</label>
          {type === 'EMAIL' || type === 'CODE' || type === 'TRANSACTION' ? (
             <textarea
             className="w-full h-64 bg-black border border-gray-700 rounded-lg p-4 text-gray-300 font-mono focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none transition-all resize-none"
             placeholder={placeholder}
             value={input}
             onChange={(e) => setInput(e.target.value)}
           />
          ) : (
            <input
              type={type === 'PASSWORD' ? 'text' : 'text'} // Show password for checking, or use password type
              className="w-full bg-black border border-gray-700 rounded-lg p-4 text-gray-300 font-mono focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none transition-all"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleScan}
              disabled={loading || !input}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all
                ${loading || !input 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-cyber-neon text-black hover:bg-opacity-90 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>ANALYZING...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>INITIATE SCAN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className={`bg-cyber-dark border border-gray-800 rounded-xl p-6 shadow-xl flex flex-col relative overflow-hidden min-h-[400px]`}>
          {!result && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
              <ShieldAlert size={64} className="mb-4 opacity-20" />
              <p className="font-mono text-sm">AWAITING INPUT DATA...</p>
            </div>
          )}

          {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10">
                <div className="w-16 h-1 bg-gray-800 rounded overflow-hidden mb-2">
                    <div className="h-full bg-cyber-neon animate-progress"></div>
                </div>
                <p className="text-cyber-neon font-mono text-xs animate-pulse">PROCESSING NEURAL NETWORK</p>
             </div>
          )}

          {result && !loading && (
            <div className="flex flex-col h-full animate-fadeIn">
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-800">
                <div className="flex items-center space-x-4">
                    {getRiskIcon(result.riskLevel)}
                    <div>
                        <div className="text-xs text-gray-500 font-mono mb-1">VERDICT</div>
                        <h3 className={`text-2xl font-bold ${getRiskColor(result.riskLevel).split(' ')[0]}`}>
                            {result.riskLevel}
                        </h3>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 font-mono mb-1">SAFETY SCORE</div>
                    <div className={`text-3xl font-mono font-bold ${
                        result.score > 80 ? 'text-cyber-neon' : result.score > 50 ? 'text-yellow-400' : 'text-cyber-alert'
                    }`}>
                        {result.score}/100
                    </div>
                </div>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Analysis Summary</h4>
                    <p className="text-gray-400 leading-relaxed">{result.summary}</p>
                </div>
                
                <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Technical Details</h4>
                    <ul className="space-y-2">
                        {result.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm text-gray-400">
                                <span className="text-cyber-blue mt-1">›</span>
                                <span>{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-800">
                     <h4 className="text-sm font-bold text-cyber-neon mb-1 uppercase tracking-wider flex items-center">
                        <AlertTriangle size={14} className="mr-2" />
                        Recommendation
                     </h4>
                     <p className="text-sm text-gray-300">{result.recommendation}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between text-xs font-mono text-gray-600">
                <span>SCAN_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                <span>TIME: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};