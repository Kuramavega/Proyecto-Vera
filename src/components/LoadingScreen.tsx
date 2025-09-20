import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export function LoadingScreen() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="bg-gradient-to-r from-primary to-blue-600 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center shadow-lg"
        >
          <div className="text-white text-2xl">💙</div>
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {t('app.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('app.tagline')}
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="size-2 bg-primary rounded-full animate-bounce"></div>
          <div className="size-2 bg-primary rounded-full animate-bounce delay-75"></div>
          <div className="size-2 bg-primary rounded-full animate-bounce delay-150"></div>
        </div>
      </motion.div>
    </div>
  );
}