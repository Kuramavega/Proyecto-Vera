import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2,
  Heart,
  Calendar,
  AlertTriangle,
  Stethoscope,
  Phone,
  Sparkles,
  Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealthIndex } from '../hooks/useHealthIndex';
import { chatAI, ChatResponse } from '../services/chatAI';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionButtons?: Array<{
    label: string;
    action: string;
    variant?: 'default' | 'destructive' | 'outline';
  }>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  followUp?: string;
  source?: 'local' | 'openai' | 'medical_api' | 'claude' | 'huggingface' | 'gemini';
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

export function Chatbot({ isOpen, onClose, onNavigate }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();
  const healthMetrics = useHealthIndex();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inicializar el chat AI con contexto del usuario
  useEffect(() => {
    if (user && !isInitialized) {
      const context = {
        userProfile: {
          nombre: user.nombre,
          edad: user.fechaNacimiento ? 
            new Date().getFullYear() - new Date(user.fechaNacimiento).getFullYear() : 
            undefined,
          antecedentes: user.antecedentes,
          alergias: user.alergias,
          medicamentosActivos: [] // Se obtendría de la base de datos
        },
        healthIndex: healthMetrics.indiceGeneral,
        recentActivity: []
      };
      
      chatAI.setContext(context);
      
      // Mensaje de bienvenida personalizado
      let welcomeContent = `¡Hola ${user.nombre}! 👋 Soy tu asistente médico virtual inteligente. Estoy aquí para ayudarte con tu salud, citas médicas y síntomas. ¿En qué puedo asistirte hoy?`;
      
      // Agregar info sobre APIs si no están configuradas
      if (!chatAI.isAPIConfigured()) {
        welcomeContent += '\n\n💡 **Tip**: Para respuestas más inteligentes, un administrador puede configurar APIs gratuitas como Hugging Face o Google Gemini.';
      }

      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'bot',
        content: welcomeContent,
        timestamp: new Date(),
        suggestions: chatAI.generateProactiveQuestions()
      };
      
      setMessages([welcomeMessage]);
      setIsInitialized(true);
    }
  }, [user, healthMetrics.indiceGeneral, isInitialized]);

  // Actualizar contexto cuando cambie el índice de salud
  useEffect(() => {
    if (user && isInitialized) {
      const context = {
        userProfile: {
          nombre: user.nombre,
          edad: user.fechaNacimiento ? 
            new Date().getFullYear() - new Date(user.fechaNacimiento).getFullYear() : 
            undefined,
          antecedentes: user.antecedentes,
          alergias: user.alergias,
          medicamentosActivos: []
        },
        healthIndex: healthMetrics.indiceGeneral,
        recentActivity: []
      };
      
      chatAI.setContext(context);
    }
  }, [user, healthMetrics.indiceGeneral, isInitialized]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response: ChatResponse = await chatAI.processMessage(content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actionButtons: response.actionButtons,
        priority: response.priority,
        followUp: response.followUp,
        source: response.source
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Si hay un seguimiento, enviarlo después de un delay
      if (response.followUp) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'bot',
            content: response.followUp!,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, followUpMessage]);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error en chat AI:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: '😔 Disculpa, he tenido un problema técnico. Por favor intenta nuevamente o contacta al soporte si persiste el error.',
        timestamp: new Date(),
        actionButtons: [
          { label: '📞 Contactar soporte', action: 'support', variant: 'outline' }
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleActionClick = (action: string) => {
    if (action === 'emergency') {
      window.open('tel:911', '_self');
      return;
    }
    
    if (action === 'support') {
      // Simular contacto con soporte
      const supportMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: '📞 El equipo de soporte ha sido notificado. También puedes llamar al número de atención: +505 2255-8000',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportMessage]);
      return;
    }
    
    if (onNavigate) {
      onNavigate(action);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return '';
    }
  };

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'openai': return '🤖 OpenAI';
      case 'medical_api': return '🏥 API Médica';
      case 'claude': return '🔮 Claude';
      case 'huggingface': return '🤗 HuggingFace';
      case 'gemini': return '✨ Gemini';
      case 'local': return '💾 Local';
      default: return '🧠 IA';
    }
  };

  if (!isOpen) return null;

  const lastBotMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const showSourceIndicator = lastBotMessage && lastBotMessage.type === 'bot' && lastBotMessage.source;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 z-50 w-80 h-96 md:w-96 md:h-[600px]"
      >
        <Card className="h-full flex flex-col shadow-2xl border-2 overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 rounded-full p-1.5 relative">
                  <Brain className="size-5" />
                  <div className="absolute -top-1 -right-1 size-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <CardTitle className="text-sm flex items-center">
                    Asistente IA SaludCerca
                    <Sparkles className="size-3 ml-1" />
                  </CardTitle>
                  <p className="text-xs opacity-90">Asistente médico inteligente</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[85%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <Avatar className="size-6 shrink-0 mt-1">
                        <AvatarFallback className={`text-xs ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        }`}>
                          {message.type === 'user' ? <User className="size-3" /> : <Brain className="size-3" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-xl p-3 text-sm break-words hyphens-auto max-w-full overflow-hidden ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : `bg-white dark:bg-gray-800 border shadow-sm ${getPriorityStyle(message.priority)}`
                      }`}>
                        <div 
                          className="prose prose-sm max-w-none dark:prose-invert break-words"
                          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                          dangerouslySetInnerHTML={{ 
                            __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                          }}
                        />
                        
                        {/* Seguimiento */}
                        {message.followUp && (
                          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-xs text-blue-800 dark:text-blue-300 break-words">
                            💡 {message.followUp}
                          </div>
                        )}
                        
                        {/* Action buttons */}
                        {message.actionButtons && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.actionButtons.map((button, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant={button.variant}
                                onClick={() => handleActionClick(button.action)}
                                className="text-xs h-7 px-2 whitespace-nowrap"
                              >
                                {button.label}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {message.suggestions.map((suggestion, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-blue-600 hover:text-white text-xs transition-colors break-words max-w-full"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2 max-w-[85%]">
                      <Avatar className="size-6 shrink-0 mt-1">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          <Brain className="size-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white dark:bg-gray-800 border rounded-xl p-3">
                        <div className="flex items-center space-x-1">
                          <Sparkles className="size-3 text-blue-600 animate-pulse" />
                          <span className="text-xs text-muted-foreground">Analizando...</span>
                          <div className="flex space-x-1">
                            <div className="size-1 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="size-1 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                            <div className="size-1 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe tus síntomas o haz una pregunta..."
                disabled={isTyping}
                className="flex-1 bg-white dark:bg-gray-800"
              />
              <Button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isTyping ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-center mt-2 gap-2">
              <span className="text-xs text-muted-foreground flex items-center">
                <Sparkles className="size-3 mr-1" />
                IA médica avanzada
              </span>
              {/* Mostrar fuente de la última respuesta */}
              {showSourceIndicator && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs">
                  {getSourceLabel(lastBotMessage?.source)}
                </span>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Floating Action Button Component
interface FloatingChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export function FloatingChatButton({ onClick, hasUnread = false }: FloatingChatButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <Button
        onClick={onClick}
        size="lg"
        className="rounded-full size-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-white dark:border-gray-800 relative group"
      >
        <div className="relative">
          <Brain className="size-6" />
          <Sparkles className="size-3 absolute -top-1 -right-1 text-yellow-300 group-hover:animate-pulse" />
        </div>
        {hasUnread && (
          <div className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="size-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20"></div>
      </Button>
    </motion.div>
  );
}