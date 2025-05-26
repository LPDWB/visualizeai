'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowUp, BarChart3, LineChart, PieChart, CircleDot, ScatterChart, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, forwardRef, useRef } from 'react';
import { GlowingBackground } from '@/components/ui/glowing-background';

const visualizations = [
  {
    icon: BarChart3,
    title: 'Bar Chart',
    description: 'Сравнение значений между категориями',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: LineChart,
    title: 'Line Chart',
    description: 'Отслеживание изменений во времени',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: PieChart,
    title: 'Pie Chart',
    description: 'Распределение частей целого',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: CircleDot,
    title: 'Donut Chart',
    description: 'Круговые диаграммы с отверстием',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: ScatterChart,
    title: 'Bubble Chart',
    description: 'Трехмерное представление данных',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: CalendarClock,
    title: 'Timeline',
    description: 'Временные последовательности событий',
    color: 'from-red-500 to-red-600'
  }
];

const VisualizationShowcase = forwardRef<HTMLDivElement>((_, forwardedRef) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = forwardedRef || internalRef;
  const isInView = useInView(ref as React.RefObject<HTMLDivElement>, { once: true, margin: "-100px" });

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
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-20 relative"
    >
      <GlowingBackground className="opacity-50" />

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 backdrop-blur-sm bg-background/30 p-8 rounded-2xl border border-white/10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Типы визуализаций, доступные в VisualizeAI
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Выбирайте из множества типов графиков для наилучшего представления ваших данных
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {visualizations.map((viz, index) => (
            <motion.div
              key={viz.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm bg-background/30 hover:bg-background/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="mb-4">
                  <viz.icon className={`w-12 h-12 bg-gradient-to-r ${viz.color} bg-clip-text text-transparent`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{viz.title}</h3>
                <p className="text-muted-foreground">{viz.description}</p>
              </div>
              <div className="aspect-video bg-muted/50 rounded-b-xl overflow-hidden">
                <div className={`w-full h-full bg-gradient-to-r ${viz.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm bg-background/30 hover:bg-background/50 border border-white/10"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.section>
  );
});

VisualizationShowcase.displayName = 'VisualizationShowcase';

export default VisualizationShowcase; 