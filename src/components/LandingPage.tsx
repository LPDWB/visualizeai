'use client';

import { motion } from 'framer-motion';
import { ArrowUp, BarChart3, LineChart, PieChart, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              VisualizeAI — визуализируйте ваши данные
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Графики, диаграммы, визуальные представления без кода
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visualizations Section */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Типы графиков
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {visualizations.map((viz, index) => (
              <motion.div
                key={viz.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <viz.icon className="w-16 h-16 text-primary/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{viz.title}</h3>
                <p className="text-muted-foreground">{viz.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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