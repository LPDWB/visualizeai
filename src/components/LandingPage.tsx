'use client';

import { motion } from 'framer-motion';
import { ArrowUp, BarChart3, LineChart, PieChart, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import HeroSection from './HeroSection';
import VisualizationShowcase from './VisualizationShowcase';

const features = [
  {
    icon: BarChart3,
    title: 'Разнообразие графиков',
    description: 'Столбчатые, линейные, круговые и другие типы визуализаций'
  },
  {
    icon: Settings,
    title: 'Гибкая настройка',
    description: 'Настраивайте цвета, размеры и стили под ваши нужды'
  },
  {
    icon: Download,
    title: 'Быстрый экспорт',
    description: 'Сохраняйте графики в PNG, SVG и других форматах'
  }
];

const visualizations = [
  {
    icon: BarChart3,
    title: 'Столбчатые графики',
    description: 'Идеально для сравнения значений'
  },
  {
    icon: LineChart,
    title: 'Линейные графики',
    description: 'Отслеживайте изменения во времени'
  },
  {
    icon: PieChart,
    title: 'Круговые диаграммы',
    description: 'Показывайте доли и проценты'
  }
];

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartClick = () => {
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <HeroSection onStartClick={handleStartClick} />
      <VisualizationShowcase ref={showcaseRef} />

      {/* Scroll to Top Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full shadow-lg"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
} 