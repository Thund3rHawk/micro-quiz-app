import { QuizCategory } from "@/lib/types";
import Link from "next/link";
import React from "react";

interface QuizCardProps {
  category: QuizCategory;
}

const QuizCard:React.FC<QuizCardProps> = ({category}) => {
  return (
    <div key={category.id} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 hover:border-indigo-300 h-full flex flex-col">
        {/* Category Icon */}
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {category.icon}
        </div>

        {/* Category Info */}
        <div className="space-y-3 flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
            {category.name}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          <span className="text-sm text-gray-500">
            {category.quizCount} quizzes available
          </span>

          <Link
            href={`/quizes/${category.name}`}
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
          >
            <span className="text-sm font-medium">Start Quiz</span>
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
