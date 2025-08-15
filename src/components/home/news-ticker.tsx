"use client";

import React from "react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  link: string;
}

interface NewsTickerProps {
  news: NewsItem[];
  speed?: number;
}

export function NewsTicker({ news, speed = 50 }: NewsTickerProps) {
  if (!news.length) return null;

  return (
    <div className="bg-green-600 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="bg-green-800 px-4 py-1 rounded-r-full mr-4 flex-shrink-0">
            <span className="font-semibold text-sm">📢 समाचार</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div
              className="flex animate-scroll whitespace-nowrap"
              style={{
                animationDuration: `${speed}s`,
                animationIterationCount: "infinite",
                animationTimingFunction: "linear",
              }}
            >
              {news.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Link
                    href={item.link}
                    className="hover:text-yellow-300 transition-colors duration-200 mx-8"
                  >
                    {item.title}
                  </Link>
                  {index < news.length - 1 && (
                    <span className="text-yellow-300 mx-4">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation-name: scroll;
        }
      `}</style>
    </div>
  );
}