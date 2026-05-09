"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Award, 
  Flame, 
  BrainCircuit,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Assess your level",
    question: "What is your current English proficiency?",
    options: ["A1 Beginner", "A2 Elementary", "B1 Intermediate", "B2 Upper Intermediate", "C1 Advanced", "C2 Mastery"],
    icon: <Award className="text-indigo-600" />
  },
  {
    title: "Define your goals",
    question: "What would you like to focus on?",
    options: ["Job Interview", "Business Communication", "IELTS", "Daily Conversation", "Vocabulary Building", "Presentation Skills", "Meeting Communication"],
    icon: <Target className="text-orange-500" />
  },
  {
    title: "Learning Style",
    question: "How do you prefer to learn?",
    options: ["Immersive Speaking", "Structured Lessons", "Real-world Context", "AI-driven Practice"],
    icon: <BrainCircuit className="text-emerald-500" />
  },
  {
    title: "Daily Practice",
    question: "What is your daily practice goal?",
    options: ["15 mins", "30 mins", "45 mins", "1 hour+"],
    icon: <Flame className="text-red-500" />
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const router = useRouter();

  const handleOptionSelect = (option: string) => {
    setAnswers({ ...answers, [currentStep]: option });
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        router.push("/dashboard");
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      
      {/* Progress Indicator */}
      <div className="w-full max-w-lg mb-12 flex justify-between gap-2">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-500",
              i <= currentStep ? "bg-indigo-600" : "bg-slate-200"
            )} 
          />
        ))}
      </div>

      <motion.div 
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full max-w-xl bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-sm relative overflow-hidden"
      >
        {/* Background Sparkle */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
           <Sparkles size={160} className="text-indigo-600" />
        </div>

        <div className="relative z-10">
          <div className="mb-8 md:mb-10 text-center">
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-6">
              {React.cloneElement(steps[currentStep].icon as any, { size: 32 })}
            </div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Step {currentStep + 1} of {steps.length}</h2>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface leading-tight">{steps[currentStep].question}</h1>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {steps[currentStep].options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={cn(
                  "w-full p-4 md:p-6 rounded-2xl border text-left font-bold transition-all flex items-center justify-between group text-sm md:text-base",
                  answers[currentStep] === option 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100" 
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50"
                )}
              >
                {option}
                <ArrowRight 
                  size={18} 
                  className={cn(
                    "transition-all",
                    answers[currentStep] === option ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                  )} 
                />
              </button>
            ))}
          </div>

          {currentStep > 0 && (
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors mx-auto block"
            >
              Go Back
            </button>
          )}
        </div>
      </motion.div>

      <footer className="mt-12 text-slate-400 text-xs font-medium flex items-center gap-2">
        <Sparkles size={14} className="text-indigo-300" /> Powered by Lingoura Intelligence
      </footer>
    </div>
  );
}
