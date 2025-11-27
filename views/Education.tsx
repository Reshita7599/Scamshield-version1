import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import { Article, Flashcard } from '../types';

export const Education: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'flashcards'>('articles');
  
  // MOCK DATA - In a real app, this could be fetched or generated via Gemini
  const articles: Article[] = [
    {
      id: 1,
      title: "The Rise of AI-Powered Phishing",
      excerpt: "Attackers are using LLMs to craft perfect emails. Here is how to spot them.",
      date: "2023-10-24",
      category: "News",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Zero Trust Architecture Explained",
      excerpt: "Why 'never trust, always verify' is becoming the industry standard for network security.",
      date: "2023-10-20",
      category: "Best Practice",
      readTime: "8 min"
    },
    {
      id: 3,
      title: "Understanding SQL Injection",
      excerpt: "A deep dive into how database vulnerabilities happen and how to patch them.",
      date: "2023-10-15",
      category: "Exploit",
      readTime: "12 min"
    }
  ];

  const flashcards: Flashcard[] = [
    { id: 1, category: "Network", question: "What is port 443 used for?", answer: "HTTPS (Hypertext Transfer Protocol Secure)" },
    { id: 2, category: "Attack", question: "What does XSS stand for?", answer: "Cross-Site Scripting" },
    { id: 3, category: "Defense", question: "What is 2FA?", answer: "Two-Factor Authentication (Something you know, have, or are)" },
    { id: 4, category: "Concept", question: "What is the CIA Triad?", answer: "Confidentiality, Integrity, Availability" },
    { id: 5, category: "Malware", question: "What is Ransomware?", answer: "Malware that encrypts files and demands payment for the key." },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentCardIndex((prev) => (prev + 1) % flashcards.length), 200);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length), 200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Knowledge Base</h2>
          <p className="text-gray-400">Stay informed on the latest threats and terminology.</p>
        </div>
        <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
          <button 
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'articles' ? 'bg-cyber-gray text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Articles
          </button>
          <button 
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'flashcards' ? 'bg-cyber-gray text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Flashcards
          </button>
        </div>
      </div>

      {activeTab === 'articles' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div key={article.id} className="bg-cyber-dark border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all group cursor-pointer">
              <div className="h-2 bg-cyber-neon w-0 group-hover:w-full transition-all duration-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4 text-xs font-mono text-gray-500">
                  <span className="text-cyber-blue">{article.category.toUpperCase()}</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-neon transition-colors">{article.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="text-xs text-gray-500 font-mono flex items-center">
                  <BookOpen size={14} className="mr-2" /> {article.readTime} READ
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="relative w-full max-w-xl h-80 perspective-1000">
             <div 
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
             >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-cyber-dark border-2 border-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                   <div className="text-cyber-blue font-mono text-sm mb-4 tracking-widest">{flashcards[currentCardIndex].category}</div>
                   <h3 className="text-2xl font-bold text-white">{flashcards[currentCardIndex].question}</h3>
                   <div className="absolute bottom-6 text-gray-500 text-xs flex items-center">
                      <HelpCircle size={14} className="mr-2" /> Click to reveal answer
                   </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900 border-2 border-cyber-neon rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                   <h3 className="text-xl font-bold text-cyber-neon mb-4">ANSWER</h3>
                   <p className="text-gray-200 text-lg">{flashcards[currentCardIndex].answer}</p>
                </div>
             </div>
          </div>

          <div className="flex items-center space-x-8 mt-10">
            <button onClick={prevCard} className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 hover:scale-110 transition-all">
                <ChevronLeft size={24} />
            </button>
            <span className="font-mono text-gray-500">{currentCardIndex + 1} / {flashcards.length}</span>
            <button onClick={nextCard} className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 hover:scale-110 transition-all">
                <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};