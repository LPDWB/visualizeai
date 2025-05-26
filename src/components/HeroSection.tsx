'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles } from 'lucide-react';
import { GlowingBackground } from '@/components/ui/glowing-background';

interface HeroSectionProps {
  onStartClick?: () => void;
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
};

const tagVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: [0, -2, 2, -1, 1, 0],
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10,
    },
  },
};

const scrollIndicatorVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 1,
    },
  },
};

export default function HeroSection({ onStartClick }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const y = useSpring(0, { stiffness: 100, damping: 30 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const title = "VisualizeAI — визуализируйте ваши данные";
  const description = "Графики, диаграммы, визуальные представления без кода";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80">
      {/* Enhanced spotlight effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(1200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--primary-rgb), 0.15), transparent 60%)`,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.8))',
          }}
        />
      </div>
      <GlowingBackground />

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-center space-y-6 mb-16"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold relative"
            variants={textVariants}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0 blur-xl opacity-50" 
                  style={{
                    transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
                  }}
            />
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {title.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-2"
                  variants={letterVariants}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto backdrop-blur-sm bg-background/30 p-4 rounded-lg border border-white/10"
            variants={textVariants}
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            variants={textVariants}
          >
            <motion.div variants={tagVariants} whileHover="hover" initial="initial">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full"
                onClick={onStartClick}
              >
                <Button
                  size="lg"
                  className="group relative overflow-hidden w-full backdrop-blur-sm bg-primary/90 hover:bg-primary"
                >
                  <Sparkles className="w-4 h-4 mr-2 group-hover:animate-spin" />
                  Начать сейчас
                </Button>
              </motion.button>
            </motion.div>

            <motion.div variants={tagVariants} whileHover="hover" initial="initial">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full backdrop-blur-sm bg-background/30 hover:bg-background/50"
                >
                  Узнать больше
                </Button>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scrollIndicatorVariants}
          style={{ opacity, y }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
          <span className="text-sm text-muted-foreground backdrop-blur-sm bg-background/30 px-4 py-2 rounded-full border border-white/10">
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  );
} 