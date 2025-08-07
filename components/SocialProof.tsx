"use client";

import { useState } from 'react';

interface SocialProofProps {
  className?: string;
}

export default function SocialProof({ className = "" }: SocialProofProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      company: "Google", 
      logo: "🔍",
      text: "Secure OAuth integration"
    },
    {
      company: "GitHub",
      logo: "🐙", 
      text: "Developer-trusted authentication"
    },
    {
      company: "Microsoft",
      logo: "🏢",
      text: "Enterprise-grade security"
    }
  ];

  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 mb-4">
        <span>Trusted by developers at</span>
      </div>
      
      <div className="flex items-center justify-center space-x-8 opacity-60">
        {testimonials.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-lg">{item.logo}</span>
            <span className="font-medium text-gray-600 text-sm">{item.company}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
}
