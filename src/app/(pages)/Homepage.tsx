'use client'
import QuizCard from "@/components/shared/QuizCard";
import { QuizCategory } from "@/lib/types";
import Link from "next/link";


import React from "react";


async function getQuizCategories(): Promise<QuizCategory[]> {
  try {
    // In a real app, this would fetch from your API route
    // For now, we'll use static data that would come from /api/categories
    const categories: QuizCategory[] = [
      {
        id: 'history',
        name: 'History',
        description: 'Test your knowledge of historical events, figures, and civilizations',
        icon: '📚',
        quizCount: 12
      },
      {
        id: 'science',
        name: 'Science',
        description: 'Explore physics, chemistry, biology, and earth sciences',
        icon: '🔬',
        quizCount: 15
      },
      {
        id: 'math',
        name: 'Mathematics',
        description: 'Challenge yourself with algebra, geometry, and calculus problems',
        icon: '📐',
        quizCount: 8
      },
      {
        id: 'programming',
        name: 'Programming',
        description: 'Test your coding skills across various programming languages',
        icon: '💻',
        quizCount: 18
      },
      {
        id: 'geography',
        name: 'Geography',
        description: 'Discover countries, capitals, landmarks, and natural wonders',
        icon: '🌍',
        quizCount: 10
      },
      {
        id: 'literature',
        name: 'Literature',
        description: 'Dive into classic and modern literature from around the world',
        icon: '📖',
        quizCount: 7
      }
    ];
    
    return categories;
  } catch (error) {
    console.error('Failed to fetch quiz categories:', error);
    return [];
  }
}

export default async function HomePage() {
  const categories = await getQuizCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Quiz Master
            </h1>
            <p className="text-lg text-gray-600">
              Test your knowledge across multiple categories
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        {/* <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Challenge
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select from our diverse collection of quiz categories and put your knowledge to the test. 
            Each category offers unique challenges designed to engage and educate.
          </p>
        </section> */}

        {/* Categories Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <QuizCard category = {category} key = {index}/>
            ))}
          </div>
        </section>


        {/* Stats Section
        <section className="mt-20 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Platform Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-indigo-600">
                  {categories.reduce((total, category) => total + category.quizCount, 0)}
                </div>
                <div className="text-gray-600">Total Quizzes</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-indigo-600">
                  {categories.length}
                </div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-indigo-600">
                  1000+
                </div>
                <div className="text-gray-600">Questions</div>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
    <footer className="bg-gray-800 text-white w-full fixed bottom-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center">
        <p className="text-gray-400">
          &copy; 2025 Quiz Master. Challenge yourself, learn something new.
        </p>
        </div>
      </div>
    </footer>
    </div>
  )
}