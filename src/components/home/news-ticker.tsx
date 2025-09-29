"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NewsItem {
  id: string;
  title: string;
  link: string;
}

interface NewsTickerProps {
  speed?: number;
}

export function NewsTicker({ speed = 50 }: NewsTickerProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreakingNews = () => {
      try {
        // Fetch breaking news and high priority news for ticker
        const newsQuery = query(
          collection(db, 'newsArticles'),
          where('status', '==', 'published'),
          where('isBreaking', '==', true),
          orderBy('publishDate', 'desc'),
          limit(5)
        );

        const unsubscribe = onSnapshot(
          newsQuery,
          (snapshot) => {
            const newsData = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title,
                link: `/news/${data.slug}`
              };
            });

            // If no breaking news, fetch high priority news
            if (newsData.length === 0) {
              const highPriorityQuery = query(
                collection(db, 'newsArticles'),
                where('status', '==', 'published'),
                where('priority', '==', 'high'),
                orderBy('publishDate', 'desc'),
                limit(3)
              );

              onSnapshot(highPriorityQuery, (snapshot) => {
                const highPriorityData = snapshot.docs.map(doc => {
                  const data = doc.data();
                  return {
                    id: doc.id,
                    title: data.title,
                    link: `/news/${data.slug}`
                  };
                });
                setNews(highPriorityData);
                setLoading(false);
              });
            } else {
              setNews(newsData);
              setLoading(false);
            }
          },
          (error) => {
            console.error('Error fetching breaking news:', error);
            // Set fallback sample data
            setNews([
              {
                id: 'sample-1',
                title: 'पुस्तकालय भवन निर्माण कार्य जून 2024 तक पूर्ण होने की संभावना',
                link: '/news/library-construction-update'
              },
              {
                id: 'sample-2',
                title: 'मासिक रक्तदान शिविर का आयोजन - रक्तदाताओं से अपील',
                link: '/news/monthly-blood-donation-camp'
              },
              {
                id: 'sample-3',
                title: 'निःशुल्क स्वास्थ्य जांच शिविर का सफल आयोजन - 200+ लाभार्थी',
                link: '/news/health-camp-success'
              }
            ]);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up news ticker:', error);
        setLoading(false);
      }
    };

    const unsubscribe = fetchBreakingNews();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (loading || !news.length) return null;

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