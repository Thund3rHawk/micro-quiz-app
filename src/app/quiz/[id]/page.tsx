'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';


// Types (shared with server component)
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  totalQuestions: number;
  totalPoints: number;
  questions: Question[];
  createdAt: string;
  tags: string[];
}

interface QuizClientProps {
  quiz: Quiz;
}

interface UserAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number;
}

const QuizClient: React.FC<QuizClientProps> = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer for overall quiz
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Date.now() - questionStartTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [questionStartTime]);

  // Reset question start time when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption: selectedAnswer,
      isCorrect,
      timeSpent
    };

    setUserAnswers(prev => [...prev, newAnswer]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const calculateScore = () => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const totalQuestions = userAnswers.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const points = correctAnswers * 10; // Assuming 10 points per correct answer
    
    return { correctAnswers, totalQuestions, percentage, points };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (quizCompleted) {
    const score = calculateScore();
    const totalTime = userAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0);

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {score.percentage >= 80 ? '🎉' : score.percentage >= 60 ? '👍' : '📚'}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
            <p className="text-gray-600">Great job finishing "{quiz.title}"</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Results</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(score.percentage)}`}>
                  {score.percentage}%
                </div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {score.correctAnswers}/{score.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {score.points}
                </div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {formatTime(totalTime)}
                </div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href={`/quizzes/${quiz.category}`}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center block"
            >
              Try More {quiz.category} Quizzes
            </Link>
            <Link
              href="/"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center block"
            >
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link
                href={`/quizzes/${quiz.category}`}
                className="text-indigo-600 hover:text-indigo-700 transition-colors text-sm font-medium"
              >
                ← Back to {quiz.category}
              </Link>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Time: {formatTime(timeElapsed)}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty} • {currentQuestion.points} points
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              let optionClasses = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
              
              if (showExplanation) {
                if (index === currentQuestion.correctAnswer) {
                  optionClasses += "border-green-500 bg-green-50 text-green-800";
                } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                  optionClasses += "border-red-500 bg-red-50 text-red-800";
                } else {
                  optionClasses += "border-gray-200 bg-gray-50 text-gray-600";
                }
              } else {
                if (selectedAnswer === index) {
                  optionClasses += "border-indigo-500 bg-indigo-50 text-indigo-800";
                } else {
                  optionClasses += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={optionClasses}
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && currentQuestion.explanation && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
              <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div>
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
                  disabled={showExplanation}
                >
                  ← Previous Question
                </button>
              )}
            </div>
            <div>
              {!showExplanation ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedAnswer !== null
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'} →
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Types
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  totalQuestions: number;
  totalPoints: number;
  questions: Question[];
  createdAt: string;
  tags: string[];
}

interface PageProps {
  params: { id: string };
}

// Server-side fetch quiz data from API
async function getQuizById(quizId: string): Promise<Quiz | null> {
  try {
    // In production:
    // const response = await fetch(`${process.env.BASE_URL}/api/quiz/${quizId}`, {
    //   cache: 'no-store' // Ensures SSR on each request
    // });
    // return await response.json();
    
    // Mock quiz data simulating API response
    const quizDatabase: Record<string, Quiz> = {
      'hist-ww2-timeline': {
        id: 'hist-ww2-timeline',
        title: 'World War II Timeline',
        description: 'Test your knowledge of major events during World War II, from the invasion of Poland to Victory Day.',
        category: 'History',
        difficulty: 'medium',
        estimatedTime: 15,
        totalQuestions: 10,
        totalPoints: 100,
        createdAt: '2024-01-15',
        tags: ['WWII', 'Timeline', 'Europe', 'Military'],
        questions: [
          {
            id: 'q1',
            question: 'When did World War II officially begin in Europe?',
            options: [
              'September 1, 1939',
              'December 7, 1941',
              'June 22, 1941',
              'May 8, 1945'
            ],
            correctAnswer: 0,
            explanation: 'World War II officially began on September 1, 1939, when Germany invaded Poland.',
            difficulty: 'easy',
            category: 'History',
            points: 10
          },
          {
            id: 'q2',
            question: 'Which operation was the code name for the German invasion of the Soviet Union?',
            options: [
              'Operation Overlord',
              'Operation Barbarossa',
              'Operation Market Garden',
              'Operation Torch'
            ],
            correctAnswer: 1,
            explanation: 'Operation Barbarossa was the code name for Nazi Germany\'s invasion of the Soviet Union, launched on June 22, 1941.',
            difficulty: 'medium',
            category: 'History',
            points: 10
          },
          {
            id: 'q3',
            question: 'What was the turning point battle on the Eastern Front?',
            options: [
              'Battle of Moscow',
              'Battle of Leningrad',
              'Battle of Stalingrad',
              'Battle of Kursk'
            ],
            correctAnswer: 2,
            explanation: 'The Battle of Stalingrad (1942-1943) is widely considered the turning point of the war on the Eastern Front.',
            difficulty: 'medium',
            category: 'History',
            points: 10
          },
          {
            id: 'q4',
            question: 'When did D-Day (Operation Overlord) take place?',
            options: [
              'June 6, 1944',
              'June 4, 1944',
              'July 6, 1944',
              'May 6, 1944'
            ],
            correctAnswer: 0,
            explanation: 'D-Day, the Allied invasion of Normandy, took place on June 6, 1944.',
            difficulty: 'easy',
            category: 'History',
            points: 10
          },
          {
            id: 'q5',
            question: 'Which conference decided the post-war occupation of Germany?',
            options: [
              'Tehran Conference',
              'Casablanca Conference',
              'Yalta Conference',
              'Potsdam Conference'
            ],
            correctAnswer: 3,
            explanation: 'The Potsdam Conference (July-August 1945) decided the post-war occupation and reconstruction of Germany.',
            difficulty: 'hard',
            category: 'History',
            points: 10
          },
          {
            id: 'q6',
            question: 'What was the largest tank battle in history?',
            options: [
              'Battle of Stalingrad',
              'Battle of Kursk',
              'Battle of El Alamein',
              'Battle of the Bulge'
            ],
            correctAnswer: 1,
            explanation: 'The Battle of Kursk (1943) involved over 6,000 tanks and is considered the largest tank battle in history.',
            difficulty: 'hard',
            category: 'History',
            points: 10
          },
          {
            id: 'q7',
            question: 'When did the United States enter World War II?',
            options: [
              'September 1, 1939',
              'December 7, 1941',
              'December 8, 1941',
              'January 1, 1942'
            ],
            correctAnswer: 2,
            explanation: 'The US entered WWII on December 8, 1941, the day after the Pearl Harbor attack, when Congress declared war on Japan.',
            difficulty: 'easy',
            category: 'History',
            points: 10
          },
          {
            id: 'q8',
            question: 'Which Allied leader coined the term "Iron Curtain"?',
            options: [
              'Franklin D. Roosevelt',
              'Harry S. Truman',
              'Winston Churchill',
              'Charles de Gaulle'
            ],
            correctAnswer: 2,
            explanation: 'Winston Churchill coined the term "Iron Curtain" in his famous speech at Westminster College in 1946.',
            difficulty: 'medium',
            category: 'History',
            points: 10
          },
          {
            id: 'q9',
            question: 'What was the code name for the atomic bomb project?',
            options: [
              'Project Manhattan',
              'Manhattan Project',
              'Operation Trinity',
              'Project Venona'
            ],
            correctAnswer: 1,
            explanation: 'The Manhattan Project was the code name for the American-led effort to develop atomic weapons during WWII.',
            difficulty: 'medium',
            category: 'History',
            points: 10
          },
          {
            id: 'q10',
            question: 'When did World War II officially end?',
            options: [
              'May 8, 1945',
              'August 15, 1945',
              'September 2, 1945',
              'October 24, 1945'
            ],
            correctAnswer: 2,
            explanation: 'WWII officially ended on September 2, 1945, with Japan\'s formal surrender aboard the USS Missouri.',
            difficulty: 'easy',
            category: 'History',
            points: 10
          }
        ]
      },
      'sci-physics-fundamentals': {
        id: 'sci-physics-fundamentals',
        title: 'Physics Fundamentals',
        description: 'Basic principles of physics including mechanics, thermodynamics, and electromagnetism.',
        category: 'Science',
        difficulty: 'medium',
        estimatedTime: 15,
        totalQuestions: 8,
        totalPoints: 80,
        createdAt: '2024-01-12',
        tags: ['Physics', 'Mechanics', 'Energy', 'Forces'],
        questions: [
          {
            id: 'p1',
            question: 'What is Newton\'s first law of motion?',
            options: [
              'Force equals mass times acceleration',
              'An object at rest stays at rest unless acted upon by a force',
              'For every action there is an equal and opposite reaction',
              'Energy cannot be created or destroyed'
            ],
            correctAnswer: 1,
            explanation: 'Newton\'s first law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.',
            difficulty: 'easy',
            category: 'Science',
            points: 10
          },
          {
            id: 'p2',
            question: 'What is the unit of force in the SI system?',
            options: [
              'Joule',
              'Watt',
              'Newton',
              'Pascal'
            ],
            correctAnswer: 2,
            explanation: 'The Newton (N) is the SI unit of force, named after Sir Isaac Newton.',
            difficulty: 'easy',
            category: 'Science',
            points: 10
          },
          {
            id: 'p3',
            question: 'What is the speed of light in a vacuum?',
            options: [
              '299,792,458 m/s',
              '300,000,000 m/s',
              '186,000 miles/s',
              'All of the above are approximately correct'
            ],
            correctAnswer: 3,
            explanation: 'The speed of light in a vacuum is exactly 299,792,458 m/s, which is approximately 300,000 km/s or 186,000 miles/s.',
            difficulty: 'medium',
            category: 'Science',
            points: 10
          },
          {
            id: 'p4',
            question: 'What does E=mc² represent?',
            options: [
              'Energy equals mass times the speed of light squared',
              'Energy equals mass times acceleration squared',
              'Electric field equals mass times charge squared',
              'Entropy equals mass times temperature squared'
            ],
            correctAnswer: 0,
            explanation: 'Einstein\'s famous equation shows that energy (E) equals mass (m) times the speed of light (c) squared.',
            difficulty: 'medium',
            category: 'Science',
            points: 10
          },
          {
            id: 'p5',
            question: 'What is absolute zero?',
            options: [
              '0°C',
              '0°F',
              '-273.15°C',
              '-459.67°F'
            ],
            correctAnswer: 2,
            explanation: 'Absolute zero is -273.15°C (or 0 Kelvin), the theoretical temperature at which all molecular motion stops.',
            difficulty: 'medium',
            category: 'Science',
            points: 10
          },
          {
            id: 'p6',
            question: 'What is the acceleration due to gravity on Earth?',
            options: [
              '9.8 m/s²',
              '10 m/s²',
              '9.81 m/s²',
              'Both A and C are correct'
            ],
            correctAnswer: 3,
            explanation: 'The acceleration due to gravity on Earth is approximately 9.81 m/s², often rounded to 9.8 m/s² for calculations.',
            difficulty: 'easy',
            category: 'Science',
            points: 10
          },
          {
            id: 'p7',
            question: 'What is the relationship between frequency and wavelength?',
            options: [
              'They are directly proportional',
              'They are inversely proportional',
              'They are unrelated',
              'They are equal'
            ],
            correctAnswer: 1,
            explanation: 'Frequency and wavelength are inversely proportional: as frequency increases, wavelength decreases (f × λ = c).',
            difficulty: 'medium',
            category: 'Science',
            points: 10
          },
          {
            id: 'p8',
            question: 'What is the first law of thermodynamics?',
            options: [
              'Heat flows from hot to cold',
              'Entropy always increases',
              'Energy cannot be created or destroyed',
              'Absolute zero cannot be reached'
            ],
            correctAnswer: 2,
            explanation: 'The first law of thermodynamics states that energy cannot be created or destroyed, only converted from one form to another.',
            difficulty: 'medium',
            category: 'Science',
            points: 10
          }
        ]
      },
      'prog-javascript-fundamentals': {
        id: 'prog-javascript-fundamentals',
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.',
        category: 'Programming',
        difficulty: 'easy',
        estimatedTime: 15,
        totalQuestions: 6,
        totalPoints: 60,
        createdAt: '2024-01-16',
        tags: ['JavaScript', 'Web Development', 'ES6', 'DOM'],
        questions: [
          {
            id: 'js1',
            question: 'Which of the following is the correct way to declare a variable in JavaScript?',
            options: [
              'var myVariable;',
              'let myVariable;',
              'const myVariable = value;',
              'All of the above'
            ],
            correctAnswer: 3,
            explanation: 'All three (var, let, const) are valid ways to declare variables in JavaScript, each with different scoping rules.',
            difficulty: 'easy',
            category: 'Programming',
            points: 10
          },
          {
            id: 'js2',
            question: 'What does "=== " operator do in JavaScript?',
            options: [
              'Assigns a value',
              'Compares values only',
              'Compares both value and type',
              'Compares references'
            ],
            correctAnswer: 2,
            explanation: 'The strict equality operator (===) compares both value and type without type coercion.',
            difficulty: 'easy',
            category: 'Programming',
            points: 10
          },
          {
            id: 'js3',
            question: 'What is the output of: console.log(typeof null)?',
            options: [
              '"null"',
              '"undefined"',
              '"object"',
              '"boolean"'
            ],
            correctAnswer: 2,
            explanation: 'This is a famous JavaScript quirk: typeof null returns "object", which is considered a bug that has been kept for compatibility.',
            difficulty: 'medium',
            category: 'Programming',
            points: 10
          },
          {
            id: 'js4',
            question: 'Which method is used to add an element to the end of an array?',
            options: [
              'push()',
              'pop()',
              'shift()',
              'unshift()'
            ],
            correctAnswer: 0,
            explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.',
            difficulty: 'easy',
            category: 'Programming',
            points: 10
          },
          {
            id: 'js5',
            question: 'What is a closure in JavaScript?',
            options: [
              'A function that returns another function',
              'A function with access to variables in its outer scope',
              'A method to close browser windows',
              'A way to end a loop'
            ],
            correctAnswer: 1,
            explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.',
            difficulty: 'medium',
            category: 'Programming',
            points: 10
          },
          {
            id: 'js6',
            question: 'Which ES6 feature allows you to extract values from arrays or objects?',
            options: [
              'Spread operator',
              'Rest parameters',
              'Destructuring',
              'Template literals'
            ],
            correctAnswer: 2,
            explanation: 'Destructuring assignment allows you to extract values from arrays or properties from objects into distinct variables.',
            difficulty: 'medium',
            category: 'Programming',
            points: 10
          }
        ]
      }
    };

    return quizDatabase[quizId] || null;
  } catch (error) {
    console.error('Failed to fetch quiz:', error);
    return null;
  }
}

// Main SSR page component
export default async function Page({ params }: PageProps) {
  // Server-side data fetching (runs on each request for SSR)
  const quiz = await getQuizById(params.id);

  // Handle quiz not found
  if (!quiz) {
    notFound();
  }

  return (
      <QuizClient quiz={quiz} />
  )
}