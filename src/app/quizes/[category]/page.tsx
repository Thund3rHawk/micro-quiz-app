// app/quizzes/[category]/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Types
interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  estimatedTime: number;
  tags: string[];
  createdAt: string;
  completionRate: number;
  thumbnail?: string;
}

interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  quizCount: number;
}

interface PageProps {
  params: { category: string };
}

// Fetch category data from API
async function getCategoryData(categoryId: string): Promise<QuizCategory | null> {
  try {
    // In production: const response = await fetch(`${process.env.BASE_URL}/api/categories/${categoryId}`);
    const categories: Record<string, QuizCategory> = {
      'History': {
        id: 'history',
        name: 'History',
        description: 'Test your knowledge of historical events, figures, and civilizations',
        icon: '📚',
        quizCount: 12
      },
      'Science': {
        id: 'science',
        name: 'Science',
        description: 'Explore physics, chemistry, biology, and earth sciences',
        icon: '🔬',
        quizCount: 15
      },
      'Mathematics': {
        id: 'math',
        name: 'Mathematics',
        description: 'Challenge yourself with algebra, geometry, and calculus problems',
        icon: '📐',
        quizCount: 8
      },
      'Programming': {
        id: 'programming',
        name: 'Programming',
        description: 'Test your coding skills across various programming languages',
        icon: '💻',
        quizCount: 18
      },
      'Geography': {
        id: 'geography',
        name: 'Geography',
        description: 'Discover countries, capitals, landmarks, and natural wonders',
        icon: '🌍',
        quizCount: 10
      },
      'Literature': {
        id: 'literature',
        name: 'Literature',
        description: 'Dive into classic and modern literature from around the world',
        icon: '📖',
        quizCount: 7
      }
    };

    return categories[categoryId] || null;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return null;
  }
}

// Server-side fetch quizzes by category from API route
async function getQuizzesByCategory(categoryName: string): Promise<Quiz[]> {
  try {
    // In production: 
    // const response = await fetch(`${process.env.BASE_URL}/api/quizzes/${categoryName}`, {
    //   cache: 'no-store' // Ensures SSR on each request
    // });
    // return await response.json();
    
    // Mock data simulating API response
    const quizData: Record<string, Quiz[]> = {
      'History': [
        {
          id: 'hist-ww2-timeline',
          title: 'World War II Timeline',
          description: 'Test your knowledge of major events during World War II, from the invasion of Poland to Victory Day.',
          difficulty: 'medium',
          questionCount: 20,
          estimatedTime: 15,
          tags: ['WWII', 'Timeline', 'Europe', 'Military'],
          createdAt: '2024-01-15',
          completionRate: 78
        },
        {
          id: 'hist-ancient-civilizations',
          title: 'Ancient Civilizations',
          description: 'Explore the great civilizations of antiquity including Egypt, Greece, Rome, and Mesopotamia.',
          difficulty: 'hard',
          questionCount: 25,
          estimatedTime: 20,
          tags: ['Ancient', 'Civilizations', 'Culture', 'Archaeology'],
          createdAt: '2024-01-10',
          completionRate: 65
        },
        {
          id: 'hist-american-revolution',
          title: 'American Revolution',
          description: 'Key figures and events of the American Revolution from taxation to independence.',
          difficulty: 'easy',
          questionCount: 15,
          estimatedTime: 10,
          tags: ['America', 'Revolution', 'Independence', '1776'],
          createdAt: '2024-01-20',
          completionRate: 82
        },
        {
          id: 'hist-cold-war',
          title: 'Cold War Era',
          description: 'The tense standoff between superpowers from 1947 to 1991.',
          difficulty: 'medium',
          questionCount: 18,
          estimatedTime: 14,
          tags: ['Cold War', 'USSR', 'USA', 'Nuclear'],
          createdAt: '2024-01-25',
          completionRate: 71
        }
      ],
      'Science': [
        {
          id: 'sci-physics-fundamentals',
          title: 'Physics Fundamentals',
          description: 'Basic principles of physics including mechanics, thermodynamics, and electromagnetism.',
          difficulty: 'medium',
          questionCount: 18,
          estimatedTime: 15,
          tags: ['Physics', 'Mechanics', 'Energy', 'Forces'],
          createdAt: '2024-01-12',
          completionRate: 71
        },
        {
          id: 'sci-chemistry-basics',
          title: 'Chemistry Basics',
          description: 'Essential chemistry concepts including atomic structure, chemical bonds, and reactions.',
          difficulty: 'easy',
          questionCount: 22,
          estimatedTime: 18,
          tags: ['Chemistry', 'Atoms', 'Reactions', 'Elements'],
          createdAt: '2024-01-18',
          completionRate: 85
        },
        {
          id: 'sci-biology-cells',
          title: 'Cell Biology',
          description: 'Understanding the basic unit of life: cell structure, function, and processes.',
          difficulty: 'medium',
          questionCount: 20,
          estimatedTime: 16,
          tags: ['Biology', 'Cells', 'Organisms', 'Life'],
          createdAt: '2024-01-22',
          completionRate: 76
        }
      ],
      'Mathematics': [
        {
          id: 'math-algebra-essentials',
          title: 'Algebra Essentials',
          description: 'Master the fundamentals of algebraic equations, variables, and problem-solving.',
          difficulty: 'medium',
          questionCount: 16,
          estimatedTime: 12,
          tags: ['Algebra', 'Equations', 'Variables', 'Functions'],
          createdAt: '2024-01-14',
          completionRate: 73
        },
        {
          id: 'math-geometry-basics',
          title: 'Geometry Fundamentals',
          description: 'Explore shapes, angles, area, volume, and geometric relationships.',
          difficulty: 'easy',
          questionCount: 14,
          estimatedTime: 10,
          tags: ['Geometry', 'Shapes', 'Area', 'Volume'],
          createdAt: '2024-01-28',
          completionRate: 81
        }
      ],
      'Programming': [
        {
          id: 'prog-javascript-fundamentals',
          title: 'JavaScript Fundamentals',
          description: 'Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.',
          difficulty: 'easy',
          questionCount: 20,
          estimatedTime: 15,
          tags: ['JavaScript', 'Web Development', 'ES6', 'DOM'],
          createdAt: '2024-01-16',
          completionRate: 79
        },
        {
          id: 'prog-python-data-structures',
          title: 'Python Data Structures',
          description: 'Advanced Python data structures and algorithms including lists, dictionaries, and sets.',
          difficulty: 'hard',
          questionCount: 30,
          estimatedTime: 25,
          tags: ['Python', 'Data Structures', 'Algorithms', 'Lists'],
          createdAt: '2024-01-22',
          completionRate: 62
        },
        {
          id: 'prog-react-components',
          title: 'React Components',
          description: 'Understanding React components, props, state, and the component lifecycle.',
          difficulty: 'medium',
          questionCount: 24,
          estimatedTime: 20,
          tags: ['React', 'Components', 'JSX', 'Hooks'],
          createdAt: '2024-01-30',
          completionRate: 68
        }
      ]
    };

    return quizData[categoryName] || [];
  } catch (error) {
    console.error('Failed to fetch quizzes:', error);
    return [];
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const categoryData = await getCategoryData(params.category);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found - Quiz Master',
      description: 'The requested quiz category could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  const quizzes = await getQuizzesByCategory(params.category);

  return {
    title: `${categoryData.name} Quizzes - Quiz Master | ${quizzes.length} Available Tests`,
    description: `${categoryData.description} Choose from ${quizzes.length} carefully crafted ${categoryData.name.toLowerCase()} quizzes. Test your knowledge and track your progress.`,
    keywords: `${categoryData.name.toLowerCase()}, quiz, test, knowledge, learning, ${categoryData.name.toLowerCase()} questions, education, assessment`,
    openGraph: {
      title: `${categoryData.name} Quizzes - Quiz Master`,
      description: `${categoryData.description} ${quizzes.length} quizzes available.`,
      type: 'website',
      url: `/quizzes/${params.category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryData.name} Quizzes - Quiz Master`,
      description: `Test your ${categoryData.name.toLowerCase()} knowledge with ${quizzes.length} engaging quizzes.`
    },
    alternates: {
      canonical: `/quizzes/${params.category}`
    }
  };
}

// Difficulty styling helper
const getDifficultyStyles = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': 
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium': 
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hard': 
      return 'bg-red-100 text-red-800 border-red-200';
    default: 
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Main SSR page component
export default async function QuizCategoryPage({ params }: PageProps) {
  // Server-side data fetching (runs on each request)
  const [categoryData, quizzes] = await Promise.all([
    getCategoryData(params.category),
    getQuizzesByCategory(params.category)
  ]);

  // Handle category not found
  if (!categoryData) {
    notFound();
  }

  // Calculate category statistics
  const avgCompletionRate = quizzes.length > 0 
    ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.completionRate, 0) / quizzes.length)
    : 0;
  
  const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questionCount, 0);
  const avgTime = quizzes.length > 0
    ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.estimatedTime, 0) / quizzes.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Categories
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{categoryData.name}</span>
          </nav>

          {/* Category Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{categoryData.icon}</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {categoryData.name} Quizzes
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  {categoryData.description}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              ← All Categories
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{quizzes.length}</div>
              <div className="text-sm text-gray-600">Available Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{avgCompletionRate}%</div>
              <div className="text-sm text-gray-600">Avg. Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{avgTime} min</div>
              <div className="text-sm text-gray-600">Avg. Duration</div>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        {quizzes.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Quizzes ({quizzes.length})
              </h2>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Sort by:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Newest First</option>
                  <option>Difficulty</option>
                  <option>Duration</option>
                  <option>Popularity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <article key={quiz.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 overflow-hidden group">
                  <div className="p-6">
                    {/* Quiz Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {quiz.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {quiz.description}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyStyles(quiz.difficulty)} ml-3 shrink-0`}>
                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                      </span>
                    </div>

                    {/* Quiz Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {quiz.questionCount} questions
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {quiz.estimatedTime} min
                        </span>
                      </div>
                      <span className="text-green-600 font-medium">
                        {quiz.completionRate}% complete rate
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {quiz.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                          #{tag}
                        </span>
                      ))}
                      {quiz.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                          +{quiz.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/quiz/${quiz.id}`}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-center font-medium inline-block group-hover:bg-indigo-700"
                    >
                      Start Quiz →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">No Quizzes Available</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              We're working on adding more {categoryData.name.toLowerCase()} quizzes. 
              Check back soon or explore other categories!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Browse Other Categories
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}