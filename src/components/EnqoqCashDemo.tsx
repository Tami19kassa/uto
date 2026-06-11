import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Riddle, HighScore } from "../types";
import {
  Trophy,
  Award,
  HelpCircle,
  Timer,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle,
  XCircle,
  Users,
  Coins,
  Ticket
} from "lucide-react";
import { SectionBackground } from "./SectionBackground";

// Curated trivia questions encompassing General Knowledge, Sports, Science, and History
const ENQOQ_RIDDLES: Riddle[] = [
  {
    id: "r1",
    question: "What is the capital city of Ethiopia, hosting the headquarters of the African Union?",
    choices: ["Addis Ababa (አዲስ አበባ)", "Nairobi", "Asmara", "Cairo"],
    answer: "Addis Ababa (አዲስ አበባ)",
    explanation: "Category: General Knowledge. Addis Ababa was founded in 1886 by Emperor Menelik II and Empress Taytu Betul.",
    amharicWord: "አዲስ አበባ",
    difficulty: "Easy",
    prizeValue: 150,
  },
  {
    id: "r2",
    question: "Which legendary long-distance runner won multiple Olympic gold medals and is celebrated global history?",
    choices: ["Haile Gebrselassie", "Kenenisa Bekele", "Abebe Bikila", "All of the above"],
    answer: "All of the above",
    explanation: "Category: Sports. All three are legendary long-distance icons from Ethiopia who dominated globally.",
    amharicWord: "አትሌቲክስ",
    difficulty: "Easy",
    prizeValue: 150,
  },
  {
    id: "r3",
    question: "Which celestial body is known as the 'Red Planet' because of its iron oxide-rich surface?",
    choices: ["Mars (ማርስ)", "Venus", "Jupiter", "Mercury"],
    answer: "Mars (ማርስ)",
    explanation: "Category: Science. Mars appears reddish in our night sky because of massive deposits of rust on its surface.",
    amharicWord: "ሳይንስ",
    difficulty: "Easy",
    prizeValue: 150,
  },
  {
    id: "r4",
    question: "In what year did the historic Battle of Adwa take place, where Ethiopian forces defeated an invading army?",
    choices: ["1896 (፲፰፺፮)", "1935", "1889", "1941"],
    answer: "1896 (፲፰፺፮)",
    explanation: "Category: History. The battle took place on March 1, 1896, securing Ethiopia's sovereignty and inspiring freedom movements worldwide.",
    amharicWord: "ታሪክ",
    difficulty: "Medium",
    prizeValue: 300,
  },
  {
    id: "r5",
    question: "What is the primary gas that makes up about 78% of the Earth's atmosphere?",
    choices: ["Nitrogen (ናይትሮጅን)", "Oxygen", "Carbon Dioxide", "Hydrogen"],
    answer: "Nitrogen (ናይትሮጅን)",
    explanation: "Category: Science. The rest of the atmosphere consists of about 21% Oxygen and other trace gases like Argon.",
    amharicWord: "ሳይንስ",
    difficulty: "Medium",
    prizeValue: 300,
  },
  {
    id: "r6",
    question: "Which majestic river is widely considered the longest river in the world, stretching over 6,600 kilometers?",
    choices: ["The Nile River (ዓባይ)", "The Amazon River", "The Yangtze River", "The Mississippi River"],
    answer: "The Nile River (ዓባይ)",
    explanation: "Category: General Knowledge. The Blue Nile portion originates in Lake Tana, Ethiopia and travels through Sudan and Egypt.",
    amharicWord: "ዓባይ",
    difficulty: "Medium",
    prizeValue: 300,
  },
  {
    id: "r7",
    question: "Which prominent historical structure in Gondar, Ethiopia, is a massive stone castle compound built by Emperor Fasilides?",
    choices: ["Fasil Ghebbi (ፋሲል ግቢ)", "Lalibela Rock Churches", "Axum Obelisk", "Sof Omar Caves"],
    answer: "Fasil Ghebbi (ፋሲል ግቢ)",
    explanation: "Category: History. Fasil Ghebbi served as the royal fortress-city of the Ethiopian emperors throughout the 17th century.",
    amharicWord: "ጎንደር",
    difficulty: "Hard",
    prizeValue: 500,
  },
  {
    id: "r8",
    question: "What is the approximate speed of light in a vacuum, which is fundamental to modern physics?",
    choices: ["299,792 kilometers per second", "150,000 kilometers per second", "1,000,000 kilometers per second", "343 meters per second"],
    answer: "299,792 kilometers per second",
    explanation: "Category: Science. Light travels at the ultimate universal speed limit defined by modern scientific physics.",
    amharicWord: "ብርሃን",
    difficulty: "Hard",
    prizeValue: 500,
  },
  {
    id: "r9",
    question: "In which sport can a competitor score a 'double eagle' (albatross) by completing a hole three strokes under par?",
    choices: ["Golf (ጎልፍ)", "Tennis", "Archery", "Cricket"],
    answer: "Golf (ጎልፍ)",
    explanation: "Category: Sports. Scoring an albatross is extremely rare in golf championships, requiring incredible precision.",
    amharicWord: "ስፖርት",
    difficulty: "Hard",
    prizeValue: 500,
  }
];

// Seed initial leaderboard inside localStorage if not present
const INITIAL_LEADERBOARD: HighScore[] = [
  { name: "Nahom_99", score: 1400, difficulty: "Hard", date: "2026-06-09", ticketId: "ENQ-734B-8" },
  { name: "Meron_Eth", score: 1100, difficulty: "Hard", date: "2026-06-10", ticketId: "ENQ-591C-2" },
  { name: "Yosef_K", score: 900, difficulty: "Medium", date: "2026-06-08", ticketId: "ENQ-112X-9" },
  { name: "Teka_7", score: 600, difficulty: "Easy", date: "2026-06-10", ticketId: "ENQ-819A-4" },
  { name: "Betty_Ethiopia", score: 450, difficulty: "Easy", date: "2026-06-10", ticketId: "ENQ-300D-5" }
];

interface EnqoqCashDemoProps {
  onUpdateScore: (score: number) => void;
}

export const EnqoqCashDemo: React.FC<EnqoqCashDemoProps> = ({ onUpdateScore }) => {
  // Game state
  const [gameState, setGameState] = useState<"lobby" | "playing" | "results">("lobby");
  const [nickname, setNickname] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answersSubmitted, setAnswersSubmitted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [score, setScore] = useState(0);
  const [rightAnswersCount, setRightAnswersCount] = useState(0);
  const [ticketNumber, setTicketNumber] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<HighScore[]>([]);
  
  // Audio / feedback simulated states
  const [shakeActive, setShakeActive] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);

  // Load riddles matching selected difficulty
  const activeRiddles = ENQOQ_RIDDLES.filter(
    (r) => r.difficulty === selectedDifficulty
  );

  useEffect(() => {
    // Load leaderboard
    const stored = localStorage.getItem("enqoq_leaderboard");
    if (stored) {
      setLeaderboard(JSON.parse(stored));
    } else {
      localStorage.setItem("enqoq_leaderboard", JSON.stringify(INITIAL_LEADERBOARD));
      setLeaderboard(INITIAL_LEADERBOARD);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameState === "playing" && !answersSubmitted) {
      setTimeRemaining(20);
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleCheckAnswer(null); // Time's out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState, currentQuestionIndex, answersSubmitted]);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    
    setScore(0);
    scoreRef.current = 0;
    setRightAnswersCount(0);
    setCurrentQuestionIndex(0);
    setSelectedChoice(null);
    setAnswersSubmitted(false);
    setGameState("playing");
  };

  const handleChoiceSelect = (choice: string) => {
    if (answersSubmitted) return;
    setSelectedChoice(choice);
  };

  const handleCheckAnswer = (choice: string | null) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    const actualSelection = choice !== null ? choice : selectedChoice;
    const currentRiddle = activeRiddles[currentQuestionIndex];
    setAnswersSubmitted(true);

    if (actualSelection === currentRiddle.answer) {
      // Clean answer
      const pointsEarned = currentRiddle.prizeValue + (timeRemaining * 10);
      const newScore = scoreRef.current + pointsEarned;
      scoreRef.current = newScore;
      setScore(newScore);
      setRightAnswersCount((prev) => prev + 1);
    } else {
      // Incorrect answer, shake screen
      setShakeActive(true);
      setTimeout(() => setShakeActive(false), 500);
    }
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setAnswersSubmitted(false);

    if (currentQuestionIndex + 1 < activeRiddles.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Complete Game
      const uniqueId = `ENQ-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(Math.random() * 10)}`;
      setTicketNumber(uniqueId);
      
      const newScoreRecord: HighScore = {
        name: nickname.trim(),
        score: scoreRef.current,
        difficulty: selectedDifficulty,
        date: new Date().toISOString().split("T")[0],
        ticketId: uniqueId
      };

      const updatedLeaderboard = [newScoreRecord, ...leaderboard]
        .sort((a, b) => b.score - a.score)
        .slice(0, 8); // top 8

      setLeaderboard(updatedLeaderboard);
      localStorage.setItem("enqoq_leaderboard", JSON.stringify(updatedLeaderboard));
      onUpdateScore(scoreRef.current); // Send scoreboard back up to app context!
      
      setGameState("results");
    }
  };

  const handleReset = () => {
    setGameState("lobby");
    setNickname("");
  };

  return (
    <section id="enqoq-cash" className="relative py-24 md:py-32 bg-white dark:bg-[#060606] overflow-hidden border-t border-rose-100 dark:border-white/8">
      <SectionBackground variant="enqoq" />
      {/* Absolute Graphics */}
      <div className="absolute top-[-5%] left-[-10%] w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 huge-grid-pattern-orange opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: Branding Narrative & Lead-up */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="font-mono text-xs tracking-widest text-[#FF1E27] font-semibold flex items-center gap-2">
                OUR HERO PROJECT <span className="w-1.5 h-1.5 rounded-full bg-brand" /> ENQOQ CASH
              </span>
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif italic text-4xl sm:text-6xl text-neutral-900 dark:text-white tracking-tight leading-[1.05]"
              >
                Where Knowledge <br />
                <span className="text-[#FF1E27] relative not-italic font-display font-black tracking-tighter">
                  Unlocks Fortunes
                  <span className="absolute bottom-1 left-0 w-full h-[3px] bg-brand" />
                </span>
                .
              </motion.h2>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed font-sans font-light max-w-xl"
            >
              Derived from the traditional word <span className="text-neutral-800 dark:text-white font-medium italic">"Enqoqlsh" (እንቆቅልሽ)</span>, 
              Enqoq Cash is YouTobia Multimedia's high-traffic interactive web solution. 
              We revolutionized custom software design by allowing users to compete in live categorized 
              trivia, scoring points against rapid clocks to secure structural prizes and cash backings.
            </motion.p>

            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-white/10 max-w-lg">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 items-start"
              >
                <div className="bg-[#FF1E27]/5 p-2.5 rounded-lg border border-[#FF1E27]/20 shrink-0">
                  <Coins className="w-5 h-5 text-[#FF1E27]" />
                </div>
                <div>
                  <h4 className="font-serif italic text-neutral-800 dark:text-white text-lg">Responsive Cashout Engine</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-sans font-light leading-relaxed">
                    Synchronized secure transaction channels back the gameplay to supply immediate rewards for top-tier competitors.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 items-start"
              >
                <div className="bg-[#FF1E27]/5 p-2.5 rounded-lg border border-[#FF1E27]/20 shrink-0">
                  <Users className="w-5 h-5 text-[#FF1E27]" />
                </div>
                <div>
                  <h4 className="font-serif italic text-neutral-800 dark:text-white text-lg">Four Dynamic Categories</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-sans font-light leading-relaxed">
                    Promoting intellectual scaling and wisdom through comprehensive questions in General Knowledge, Sport, Science, and History.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Live Interactive Playable App Demo Block */}
          <div className="lg:col-span-12 xl:col-span-7 bg-[#fafafa]/90 border border-neutral-200 rounded-2xl p-6 md:p-10 relative overflow-hidden shadow-xl">
            {/* Glossy Header Bar of the Mock App */}
            <div className="absolute top-0 left-0 w-full h-[6px] bg-[#FF1E27]" />
            
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF1E27]" />
                <span className="font-display font-black tracking-widest text-[#FF1E27] text-sm">ENQOQ CASH</span>
                <span className="bg-[#FF1E27]/5 px-2 py-0.5 rounded text-[10px] text-neutral-500 font-mono tracking-widest uppercase font-semibold border border-neutral-200/50">DEMO INTERACTION</span>
              </div>
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                ADDIS ABABA CREATIVE AREA
              </div>
            </div>

            <AnimatePresence mode="wait">
              
              {/* STAGE 1: LOBBY */}
              {/* STAGE 1: LOBBY */}
              {gameState === "lobby" && (
                <motion.div
                  key="lobby"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center bg-brand/10 w-16 h-16 rounded-full border border-brand/20 mb-2">
                      <Trophy className="w-8 h-8 text-brand animate-bounce" />
                    </div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display font-extrabold text-2xl text-neutral-800 dark:text-white"
                    >
                      Enter the Trivia Arena
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto"
                    >
                      Step up, choose your nickname, select your difficulty level, and answer all trivia multiple-choice questions before the timer runs out!
                    </motion.p>
                  </div>

                  <form onSubmit={handleStartGame} className="space-y-5 max-w-md mx-auto">
                    {/* Nickname Form */}
                    <div className="space-y-2">
                      <motion.label 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="block text-xs font-mono tracking-widest text-neutral-500 uppercase"
                      >
                        CHOOSE YOUR GAMER TAG
                      </motion.label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alazar_Eth"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        maxLength={15}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-neutral-800 dark:text-white focus:outline-none transition-all duration-300 font-mono shadow-xs"
                        id="demo-nickname-input"
                      />
                    </div>

                    {/* Difficulty selector */}
                    <div className="space-y-2">
                      <motion.label 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="block text-xs font-mono tracking-widest text-neutral-500 uppercase"
                      >
                        CHOOSE DIFFICULTY TIER
                      </motion.label>
                      <div className="grid grid-cols-3 gap-3">
                        {(["Easy", "Medium", "Hard"] as const).map((dif) => (
                          <button
                            key={dif}
                            type="button"
                            onClick={() => setSelectedDifficulty(dif)}
                            className={`py-3.5 rounded-xl text-xs font-mono font-medium border cursor-pointer transition-all duration-300 ${
                              selectedDifficulty === dif
                                ? "bg-brand/10 border-brand text-brand font-bold shadow-xs"
                                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                            }`}
                          >
                            {dif}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Start trigger */}
                    <button
                      type="submit"
                      disabled={!nickname.trim()}
                      className="w-full bg-[#FF1E27] hover:bg-[#C90E16] disabled:opacity-40 text-white font-display font-bold select-none py-3.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-brand/10"
                    >
                      <span>LAUNCH TRIVIA RUN</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  {/* Top Scores persistent Board */}
                  <div className="pt-6 border-t border-neutral-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">LIVE LEADERBOARD</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {leaderboard.slice(0, 4).map((record, index) => (
                        <div
                          key={record.ticketId}
                          className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#FF1E27] font-mono font-semibold text-xs">#{index + 1}</span>
                            <span className="text-xs text-neutral-700 font-mono truncate max-w-[100px]">{record.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-500">{record.difficulty}</span>
                            <span className="text-xs font-bold text-[#FF1E27] font-mono">{record.score}¢</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE 2: PLAYING RIDDLES */}
              {/* STAGE 2: PLAYING RIDDLES */}
              {gameState === "playing" && activeRiddles.length > 0 && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`space-y-6 ${shakeActive ? "animate-shake" : ""}`}
                >
                  {/* Game Status Indicators */}
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                        NICKNAME: {nickname}
                      </span>
                      <div className="text-sm font-display font-medium text-neutral-800">
                        Question <span className="text-brand font-bold">{currentQuestionIndex + 1}</span> of {activeRiddles.length}
                      </div>
                    </div>

                    {/* Progress score */}
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-[#FF1E27] uppercase tracking-widest">
                        Current Score
                      </span>
                      <div className="text-2xl font-mono font-black text-[#FF1E27]">
                        {score}¢
                      </div>
                    </div>
                  </div>

                  {/* Riddle Prompt Block */}
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 relative shadow-xs">
                    {/* Ge'ez accent if available */}
                    {activeRiddles[currentQuestionIndex].amharicWord && (
                      <div className="absolute right-4 top-4 text-brand/80 font-display font-bold text-lg border border-brand/20 bg-[#FF1E27]/5 px-2.5 py-0.5 rounded">
                        {activeRiddles[currentQuestionIndex].amharicWord}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs mb-3">
                      <HelpCircle className="w-3.5 h-3.5 text-brand" />
                      <span>MULTIPLE-CHOICE TRIVIA</span>
                    </div>

                    <motion.h4 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg md:text-xl font-display font-medium text-neutral-900 dark:text-white leading-relaxed"
                    >
                      "{activeRiddles[currentQuestionIndex].question}"
                    </motion.h4>
                  </div>

                  {/* Countdown Bar & Actions */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-500 flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-brand" />
                        <span>ANSWER TIMER</span>
                      </span>
                      <span className={`${timeRemaining <= 5 ? "text-brand font-bold animate-pulse" : "text-neutral-600"}`}>
                        {timeRemaining} SECONDS LEFT
                      </span>
                    </div>
                    {/* Loading meter animated */}
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: `${(timeRemaining / 20) * 100}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                        className={`h-full ${timeRemaining <= 5 ? "bg-[#FF1E27]" : "bg-gradient-to-r from-brand-orange to-brand"}`}
                      />
                    </div>
                  </div>

                  {/* Answer Choices Grid - Re-keyed for dynamic fanning cascade animation on each new riddle */}
                  <div key={currentQuestionIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {activeRiddles[currentQuestionIndex].choices.map((choice, choiceIdx) => {
                      const isSelected = selectedChoice === choice;
                      const isCorrect = choice === activeRiddles[currentQuestionIndex].answer;
                      
                      let choiceBtnStyle = "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300";
                      
                      if (answersSubmitted) {
                        if (isCorrect) {
                          choiceBtnStyle = "bg-green-500/10 border-green-500 text-green-600 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          choiceBtnStyle = "bg-red-500/10 border-red-500 text-red-600 font-semibold";
                        } else {
                          choiceBtnStyle = "bg-neutral-50/50 border-neutral-100 text-neutral-400";
                        }
                      } else if (isSelected) {
                        choiceBtnStyle = "bg-brand/10 border-brand text-brand font-semibold";
                      }

                      return (
                        <motion.button
                          key={choice}
                          type="button"
                          disabled={answersSubmitted}
                          onClick={() => handleChoiceSelect(choice)}
                          initial={{ opacity: 0, y: 15, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          whileHover={answersSubmitted ? {} : { scale: 1.015, y: -2 }}
                          whileTap={answersSubmitted ? {} : { scale: 0.98 }}
                          transition={{
                            duration: 0.4,
                            delay: choiceIdx * 0.08,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className={`w-full text-left p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${choiceBtnStyle}`}
                        >
                          <span className="font-sans text-sm">{choice}</span>
                          {answersSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-green-500 shrink-0 ml-2" />}
                          {answersSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Bottom validation button or Explanatory note */}
                  <div className="pt-4 border-t border-neutral-200 flex flex-col gap-4">
                    {!answersSubmitted ? (
                      <button
                        onClick={() => handleCheckAnswer(null)}
                        disabled={!selectedChoice}
                        className="w-full bg-[#FF1E27] hover:bg-[#C90E16] text-white font-display font-bold py-3.5 rounded-xl cursor-pointer transition-all duration-300 disabled:opacity-30"
                        id="validate-answer-btn"
                      >
                        SUBMIT FINAL DECISION
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-4 rounded-xl text-xs font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed shadow-xs">
                          <strong className="text-neutral-800 dark:text-white block font-display mb-1">Trivia Context Breakdown:</strong>
                          {activeRiddles[currentQuestionIndex].explanation}
                        </div>

                        <button
                          onClick={handleNextQuestion}
                          className="w-full bg-brand hover:bg-brand-orange text-white font-display font-bold py-3.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 group"
                          id="next-question-btn"
                        >
                          <span>
                            {currentQuestionIndex + 1 < activeRiddles.length
                              ? "PROCEED TO NEXT QUESTION"
                              : "COMPUTE FINAL RESULTS"}
                          </span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STAGE 3: RESULTS & WINNER TICKET GENERATOR */}
              {gameState === "results" && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8 flex flex-col items-center"
                >
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center bg-green-500/10 w-16 h-16 rounded-full border border-green-500/20 mb-2">
                      <Sparkles className="w-8 h-8 text-green-500 animate-spin" />
                    </div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display font-extrabold text-3xl text-neutral-800 dark:text-white animate-fade-in"
                    >
                      Congratulations, {nickname}!
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto"
                    >
                      You conquered the live trivia run in {selectedDifficulty} mode! Your YouTobia Multimedia Prize Ticket is ready!
                    </motion.p>
                  </div>

                  {/* Physical Style Ticket Mock Render */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-full max-w-md bg-white border-2 border-dashed border-brand/60 rounded-2xl overflow-hidden shadow-2xl relative"
                  >
                    {/* Glowing Accent Spot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-brand/5 blur-[60px] pointer-events-none" />

                    {/* Sidewise cutout ticket notches */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-100 border-r border-neutral-200" />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-100 border-l border-neutral-200" />

                    {/* Inside Ticket Grid */}
                    <div className="p-6 space-y-4">
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                        <div className="flex items-center gap-1.5">
                          <Ticket className="w-4 h-4 text-brand" />
                          <span className="font-mono text-[10px] tracking-widest text-[#FF1E27] uppercase font-bold">
                            TRIVIA PRIZE PASS
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-neutral-400">
                          ID: {ticketNumber}
                        </span>
                      </div>

                      {/* Ticket details */}
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                            CHALLENGER
                          </span>
                          <span className="font-display font-extrabold text-sm text-neutral-800 truncate max-w-[140px] block">
                            {nickname}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                            TIER LEVEL
                          </span>
                          <span className="font-mono text-xs font-semibold text-brand block">
                            {selectedDifficulty} RUN
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                            CORRECTS
                          </span>
                          <span className="font-sans font-semibold text-xs text-neutral-700 block">
                            {rightAnswersCount} / {activeRiddles.length} Challenges
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                            DATE EXECUTED
                          </span>
                          <span className="font-mono text-xs text-neutral-500 block">
                            {new Date().toISOString().split("T")[0]}
                          </span>
                        </div>
                      </div>

                      {/* Major Rewards box */}
                      <div className="bg-[#FF1E27]/5 border border-[#FF1E27]/25 rounded-xl p-4 text-center space-y-1.5 relative overflow-hidden">
                        <span className="text-[9px] font-mono text-[#FF1E27] uppercase tracking-widest font-semibold">
                          ESTIMATED PRIZE CREDIT
                        </span>
                        <div className="text-3xl font-mono font-black text-brand tracking-tighter">
                          {score} ETB / Coins
                        </div>
                        <span className="text-[8px] font-mono text-neutral-400 block">
                          REDEEMABLE FROM YOUTOBIA DESK CLIENTS
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Inline Toast Success Banner */}
                  <AnimatePresence>
                    {isSaved && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full max-w-md bg-green-500/10 border border-green-500/30 text-green-600 p-4 rounded-xl text-xs font-mono text-center space-y-1"
                      >
                        <div className="font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          <span>PRIZE CERTIFICATE SECURED</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-[10px] uppercase leading-relaxed font-sans">
                          Ticket ID #{ticketNumber} is active and stored in your browser session cookies for redemption.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Options */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button
                      onClick={() => {
                        setIsSaved(false);
                        handleReset();
                      }}
                      className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-mono text-xs tracking-widest px-6 py-3.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <RotateCcw className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                      <span>PLAY AGAIN</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsSaved(true);
                      }}
                      className="bg-[#FF1E27] hover:bg-[#C90E16] text-white font-display font-bold py-3.5 px-6 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
                    >
                      <Award className="w-4 h-4" />
                      <span>SECURE CERTIFICATE</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
export default EnqoqCashDemo;
