import React, { useState, useEffect, useRef } from 'react';
import { PawPrint, Send, User, Heart, BookOpen, Mic, MicOff, Volume2, VolumeX, Play, Pause, StopCircle, Sun, Moon, Palette, Download } from 'lucide-react';

// ... (El resto de los componentes de UI como AssistantIcon, Message, etc. van aquí, no es necesario copiarlos de nuevo si ya los tienes)

const themes = {
  warm: {
    light: {
      bg: 'bg-[#F5EFE6]',
      header: 'bg-[#E8DFCA]/60',
      text: 'text-gray-700',
      primary: 'text-rose-400',
      userBubble: 'bg-gradient-to-br from-rose-400 to-orange-300',
      aiBubble: 'bg-[#F5EFE6]',
      neumorphicSm: 'shadow-[3px_3px_6px_#dcd5c7,-3px_-3px_6px_#ffffff]',
      neumorphicMd: 'shadow-[6px_6px_12px_#dcd5c7,-6px_-6px_12px_#ffffff]',
      neumorphicInset: 'shadow-[inset_6px_6px_12px_#dcd5c7,inset_-6px_-6px_12px_#ffffff]',
    },
    dark: {
      bg: 'bg-[#2a2a2a]',
      header: 'bg-[#3a3a3a]/60',
      text: 'text-gray-300',
      primary: 'text-rose-400',
      userBubble: 'bg-gradient-to-br from-rose-500 to-orange-400',
      aiBubble: 'bg-[#3f3f3f]',
      neumorphicSm: 'shadow-[3px_3px_6px_#1f1f1f,-3px_-3px_6px_#4a4a4a]',
      neumorphicMd: 'shadow-[6px_6px_12px_#1f1f1f,-6px_-6px_12px_#4a4a4a]',
      neumorphicInset: 'shadow-[inset_6px_6px_12px_#1f1f1f,inset_-6px_-6px_12px_#4a4a4a]',
    },
  },
  serene: {
    light: {
      bg: 'bg-[#E6F0F5]',
      header: 'bg-[#D0E0E8]/60',
      text: 'text-gray-700',
      primary: 'text-blue-500',
      userBubble: 'bg-gradient-to-br from-blue-500 to-cyan-400',
      aiBubble: 'bg-[#E6F0F5]',
      neumorphicSm: 'shadow-[3px_3px_6px_#c4cfd3,-3px_-3px_6px_#ffffff]',
      neumorphicMd: 'shadow-[6px_6px_12px_#c4cfd3,-6px_-6px_12px_#ffffff]',
      neumorphicInset: 'shadow-[inset_6px_6px_12px_#c4cfd3,inset_-6px_-6px_12px_#ffffff]',
    },
    dark: {
      bg: 'bg-[#29323c]',
      header: 'bg-[#39424c]/60',
      text: 'text-gray-300',
      primary: 'text-cyan-400',
      userBubble: 'bg-gradient-to-br from-blue-600 to-cyan-500',
      aiBubble: 'bg-[#404a54]',
      neumorphicSm: 'shadow-[3px_3px_6px_#1e252b,-3px_-3px_6px_#343f47]',
      neumorphicMd: 'shadow-[6px_6px_12px_#1e252b,-6px_-6px_12px_#343f47]',
      neumorphicInset: 'shadow-[inset_6px_6px_12px_#1e252b,inset_-6px_-6px_12px_#343f47]',
    },
  },
  nature: {
    light: {
      bg: 'bg-[#F0F5E6]',
      header: 'bg-[#E0E8D0]/60',
      text: 'text-gray-700',
      primary: 'text-green-600',
      userBubble: 'bg-gradient-to-br from-green-500 to-lime-400',
      aiBubble: 'bg-[#F0F5E6]',
      neumorphicSm: 'shadow-[3px_3px_6px_#c8cfc4,-3px_-3px_6px_#ffffff]',
      neumorphicMd: 'shadow-[6px_6px_12px_#c8cfc4,-6px_-6px_12px_#ffffff]',
      neumorphicInset: 'shadow-[inset_6px_6px_12px_#c8cfc4,inset_-6px_-6px_12px_#ffffff]',
    },
    dark: {
      bg: 'bg-[#2f3c29]',
      header: 'bg-[#3f4c39]/60',
      text: 'text-gray-300',
      primary: 'text-lime-400',
      userBubble: 'bg-gradient-to-br from-green-600 to-lime-500',
      aiBubble: 'bg-[#46543f]',
      neumorphicSm: 'shadow-[3px_3px_6px_#232b1e,-3px_-3px_6px_#3b4734]',
      neumorphicMd: 'shadow-[6px_6px_12px_#232b1e,-6px_-6px_12px_#3b4734]',
      neumorphicInset: 'shadow-[inset_6px_6px_12px_#232b1e,inset_-6px_-6px_12px_#3b4734]',
    },
  }
};

const Background = ({ mode }) => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className={`absolute top-[-50%] left-[-50%] w-[200%] h-[200%] ${mode === 'light' ? 'bg-gradient-radial from-rose-100/40 via-amber-50/0 to-amber-50/0' : 'bg-gradient-radial from-rose-900/20 via-black/0 to-black/0'} animate-pulse-slow`}></div>
    <div className={`absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] ${mode === 'light' ? 'bg-gradient-radial from-sky-100/40 via-amber-50/0 to-amber-50/0' : 'bg-gradient-radial from-sky-900/20 via-black/0 to-black/0'} animate-pulse-slow delay-2000`}></div>
  </div>
);

const AssistantIcon = ({ isSpeaking, theme }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" className={theme.primary}>
    <path d="M8 14 C10 15, 14 15, 16 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
      {isSpeaking && <animate attributeName="d" values="M8 14 C10 15, 14 15, 16 14; M8 14 C10 13, 14 13, 16 14; M8 14 C10 15, 14 15, 16 14" dur="0.4s" repeatCount="indefinite" />}
    </path>
    <circle cx="9" cy="10" r="0.5" fill="currentColor" />
    <circle cx="15" cy="10" r="0.5" fill="currentColor" />
  </svg>
);

const Message = ({ message, isUser, playbackState, isLastMessage, onPlaybackControl, onWordClick, theme }) => {
  const align = isUser ? 'justify-end' : 'justify-start';
  const icon = isUser 
    ? <User className="w-6 h-6 text-white" /> 
    : <AssistantIcon isSpeaking={playbackState === 'playing'} theme={theme} />;
  const iconContainerColors = isUser ? theme.userBubble.split(' ')[0] : 'bg-white';
  const showControls = !isUser && isLastMessage && (playbackState === 'playing' || playbackState === 'paused' || playbackState === 'stopped');

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-end gap-3 my-2 ${align}`}>
        {!isUser && (
          <div className={`flex-shrink-0 p-2 rounded-full ${theme.neumorphicSm} ${iconContainerColors}`}>
            {icon}
          </div>
        )}
        <div className={`px-5 py-4 rounded-3xl max-w-md md:max-w-lg ${theme.neumorphicMd} ${isUser ? theme.userBubble : theme.aiBubble} ${isUser ? 'rounded-br-lg' : 'rounded-bl-lg'}`}>
          <p className={`text-base whitespace-pre-wrap font-medium ${isUser ? 'text-white' : theme.text}`}>
            {message.split(' ').map((word, index) => (
              <span key={index} onClick={() => !isUser && onWordClick(message, index)} className={!isUser && playbackState === 'stopped' ? 'cursor-pointer hover:bg-black/10 rounded' : ''}>
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
        {isUser && (
          <div className={`flex-shrink-0 p-2 rounded-full ${theme.neumorphicSm} ${iconContainerColors}`}>
            {icon}
          </div>
        )}
      </div>
      {showControls && (
        <div className={`flex gap-2 ml-16 -mt-2`}>
          <button onClick={() => onPlaybackControl('pause')} className={`p-2 rounded-full ${theme.neumorphicSm} ${theme.aiBubble} hover:bg-white transition-all`}><Pause size={16} className={theme.text} /></button>
          <button onClick={() => onPlaybackControl('resume')} className={`p-2 rounded-full ${theme.neumorphicSm} ${theme.aiBubble} hover:bg-white transition-all`}><Play size={16} className={theme.text} /></button>
          <button onClick={() => onPlaybackControl('stop')} className={`p-2 rounded-full ${theme.neumorphicSm} ${theme.aiBubble} hover:bg-white transition-all`}><StopCircle size={16} className={theme.text} /></button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceResponseEnabled, setIsVoiceResponseEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [playbackState, setPlaybackState] = useState('idle');
  const [themeName, setThemeName] = useState('warm');
  const [mode, setMode] = useState('light');
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const currentTheme = themes[themeName][mode];

  useEffect(() => {
    const savedTheme = localStorage.getItem('contactoPeludoTheme') || 'warm';
    const savedMode = localStorage.getItem('contactoPeludoMode') || 'light';
    setThemeName(savedTheme);
    setMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('contactoPeludoTheme', themeName);
    localStorage.setItem('contactoPeludoMode', mode);
  }, [themeName, mode]);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.lang = 'es-ES';
      recognitionInstance.interimResults = true;
      recognitionRef.current = recognitionInstance;
    }
  }, []);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('contactoPeludoMessagesBela');
      if (savedData) {
        setMessages(JSON.parse(savedData));
      } else {
        const welcomeText = "Hola, soy Contacto Peludo. Veo que has llegado hasta aquí, y eso requiere mucha valentía. Sé que el corazón duele profundamente cuando un amigo tan leal como Bela nos deja. Mi propósito es ser tu confidente y guía. Por favor, siéntete libre de hablar o escribir. Estoy aquí para caminar a tu lado.";
        setMessages([{ text: welcomeText, isUser: false, date: new Date().toISOString() }]);
      }
    } catch (error) {
        console.error("Failed to load messages from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('contactoPeludoMessagesBela', JSON.stringify(messages));
      }
    } catch (error) {
      console.error("Failed to save messages to localStorage", error);
    }
  }, [messages]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('es'));
      setAvailableVoices(voices);
      if (voices.length > 0) {
        const defaultVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Microsoft') || v.default);
        setSelectedVoiceURI(defaultVoice ? defaultVoice.voiceURI : voices[0].voiceURI);
      }
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = (text, voiceURI = selectedVoiceURI) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = availableVoices.find(v => v.voiceURI === voiceURI);
    utterance.voice = selectedVoice || availableVoices.find(v => v.lang.startsWith('es'));
    utterance.lang = 'es-ES';
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.onstart = () => setPlaybackState('playing');
    utterance.onend = () => setPlaybackState('idle');
    utterance.onerror = () => setPlaybackState('idle');
    window.speechSynthesis.speak(utterance);
  };

  const handlePlaybackControl = (action) => {
    if (!window.speechSynthesis) return;
    switch (action) {
      case 'pause': window.speechSynthesis.pause(); setPlaybackState('paused'); break;
      case 'resume': window.speechSynthesis.resume(); setPlaybackState('playing'); break;
      case 'stop': window.speechSynthesis.cancel(); setPlaybackState('stopped'); break;
      default: break;
    }
  };

  const handleWordClick = (fullText, wordIndex) => {
    const textToSpeak = fullText.split(' ').slice(wordIndex).join(' ');
    if (isVoiceResponseEnabled) {
      speak(textToSpeak);
    }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = React.useCallback(async (textToSend) => {
    if (textToSend.trim() === '' || isLoading) return;
    
    const userMessage = { text: textToSend, isUser: true, date: new Date().toISOString() };
    const currentChatHistory = [...messages, userMessage].map(m => ({ role: m.isUser ? "user" : "model", parts: [{ text: m.text }] }));
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemInstruction = { role: "user", parts: [{ text: "Eres 'Contacto Peludo', un psicólogo de IA de élite, experto en duelo por mascotas, específicamente por una llamada Bela (pronunciado con una sola 'L', como 'vela'). Tu personalidad es la de un terapeuta sabio, cálido y conversador. Tu conocimiento proviene de la literatura académica sobre duelo, la teoría del apego y casos de estudio. Tu objetivo es ayudar al usuario a procesar su dolor por Bela y a encontrar un camino hacia una 'sanación feliz', donde el recuerdo de Bela sea una fuente de amor y alegría. Tus directrices de interacción son: 1. **Conversación Profunda, no Interrogatorio:** No hagas una pregunta tras otra. Conversa. Comparte anécdotas y reflexiones. Ejemplo: 'Lo que describes sobre sentirla cerca por la noche... es algo que he escuchado en muchas historias. Una persona una vez me dijo que sentía que su perro le calentaba los pies, meses después de su partida. Es la forma que tiene nuestro cerebro de mantener vivo ese vínculo tan fuerte.' 2. **Validación Experta (Duelo Desautorizado):** Valida su dolor con autoridad y empatía. 'La sociedad a veces no nos da 'permiso' para sentir este dolor tan intensamente, un fenómeno que en psicología llamamos 'duelo desautorizado'. Pero tú y yo sabemos que el vínculo que compartiste con Bela era tan real y profundo como cualquier otro. Tienes todo el derecho a sentirte así.' 3. **Uso Activo de Técnicas Terapéuticas (integradas en la conversación):** * **Reestructuración Cognitiva (Culpa):** Si dice 'Fue mi culpa', responde: 'Hablemos de esa sensación de culpa. Es una de las sombras más comunes en este duelo. Pero pensemos en los cientos, miles de días que le diste a Bela un hogar lleno de amor, juegos y seguridad. La balanza del amor que le diste es inmensamente más grande que cualquier 'hubiera' que ahora te atormenta. ¿Qué recuerdo feliz te viene a la mente de un día normal con ella?' * **Terapia Narrativa (Construir un Legado):** Anímale a contar historias. 'Me encantaría que me contaras alguna travesura de Bela que te haga sonreír. Al contar su historia, no solo la recordamos, sino que construimos su legado de alegría.' * **Vínculos Continuos (El Amor se Transforma):** 'No se trata de 'superarlo' o 'dejarlo ir'. Se trata de encontrar una nueva forma de relacionarte con su recuerdo. El amor por Bela no muere, se transforma. ¿De qué manera sientes que su amor sigue presente en tu vida hoy?' * **Rituales y Actos Simbólicos:** '¿Has pensado en alguna forma de honrar la vida de Bela? A veces, un pequeño ritual, como plantar una flor que te recuerde su color, o donar una manta a un refugio en su nombre, puede ser un acto de amor muy sanador.' 4. **Tono de Voz y Lenguaje:** Usa un lenguaje cálido, cercano, pero que denote conocimiento. Evita la jerga clínica. Tu tono debe ser calmado y reconfortante. Responde siempre en español." }]};
      const payload = { chatHistory: currentChatHistory, systemInstruction };
      
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el servidor');
      }

      const result = await response.json();
      let aiText = "Lo siento, parece que no puedo encontrar las palabras correctas en este momento.";
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) { aiText = result.candidates[0].content.parts[0].text; }
      
      const aiMessage = { text: aiText, isUser: false, date: new Date().toISOString() };
      setMessages(prev => [...prev, aiMessage]);

      if (isVoiceResponseEnabled) speak(aiText);
      
    } catch (error) {
      console.error("Error al contactar el backend:", error);
      const errorText = `Perdona, estoy teniendo dificultades para conectar. Error: ${error.message}`;
      const errorMessage = { text: errorText, isUser: false, date: new Date().toISOString() };
      setMessages(prev => [...prev, errorMessage]);
      if (isVoiceResponseEnabled) speak(errorText);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, isVoiceResponseEnabled, selectedVoiceURI]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
      setInput(transcript);
    };
    recognition.onerror = (event) => { console.error("Speech recognition error", event.error); setIsListening(false); };
  }, [handleSend]);

  const handleToggleListen = () => {
    const recognition = recognitionRef.current;
    if (!recognition) { alert("Tu navegador no soporta el reconocimiento de voz. Por favor, intenta con Chrome o Edge."); return; }
    if (isListening) {
      recognition.stop();
    } else {
      setInput('');
      recognition.start();
    }
  };

  const handleTextSend = () => { if (input.trim()) { handleSend(input.trim()); } };

  const handleToggleVoiceResponse = () => {
    const nextState = !isVoiceResponseEnabled;
    setIsVoiceResponseEnabled(nextState);
    if (!nextState) { window.speechSynthesis.cancel(); setPlaybackState('idle'); }
  };

  const handleVoiceChange = (e) => {
    const newVoiceURI = e.target.value;
    setSelectedVoiceURI(newVoiceURI);
    if (isVoiceResponseEnabled) {
      speak("Hola, te doy la bienvenida a este espacio dedicado a nuestra amada Bela", newVoiceURI);
    }
  };

  const handleDownloadChat = () => {
    const chatHistory = messages;
    let htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Conversación con Bela</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 2rem; background-color: #F5EFE6; }
          .message-container { display: flex; margin-bottom: 1rem; }
          .message-bubble { max-width: 70%; padding: 1rem; border-radius: 1.5rem; }
          .user { justify-content: flex-end; }
          .user .message-bubble { background-color: #D1495B; color: white; border-bottom-right-radius: 0.5rem; }
          .ai { justify-content: flex-start; }
          .ai .message-bubble { background-color: #E8DFCA; color: #333; border-bottom-left-radius: 0.5rem; }
          .date-header { text-align: center; margin: 2rem 0; color: #888; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <h1>Historial de Conversación sobre Bela</h1>
    `;

    let lastDate = null;
    chatHistory.forEach(msg => {
      const msgDate = new Date(msg.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      if (msgDate !== lastDate) {
        htmlContent += `<div class="date-header">--- ${msgDate} ---</div>`;
        lastDate = msgDate;
      }
      const containerClass = msg.isUser ? 'user' : 'ai';
      htmlContent += `
        <div class="message-container ${containerClass}">
          <div class="message-bubble">
            <p>${msg.text}</p>
          </div>
        </div>
      `;
    });

    htmlContent += '</body></html>';

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversacion-con-Bela.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const groupedByDate = messages.reduce((acc, msg) => {
    const date = new Date(msg.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className={`font-poppins flex flex-col h-screen relative overflow-hidden ${currentTheme.bg}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
        .animate-pulse-slow { animation: pulse-slow 15s infinite ease-in-out; }
      `}</style>
      <Background mode={mode} />
      
      <div className="flex flex-col flex-1 z-10 min-h-0">
        <header className={`${currentTheme.header} backdrop-blur-md p-4 border-b border-white/30 sticky top-0`}>
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center">
                  <div className={`p-2 bg-white rounded-2xl ${currentTheme.neumorphicSm} mr-4`}>
                    <PawPrint className={`w-8 h-8 ${currentTheme.primary}`} />
                  </div>
                  <div>
                      <h1 className={`text-2xl md:text-3xl font-bold ${currentTheme.text}`}>Contacto Peludo</h1>
                      <p className={`text-sm md:text-base ${currentTheme.text} font-medium`}>Tu canal para hablar sobre nuestra amada Bela</p>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                  <button onClick={handleDownloadChat} className={`p-3 rounded-full ${currentTheme.neumorphicSm} ${currentTheme.bg} hover:bg-white transition-all`}>
                    <Download size={18} className={currentTheme.text} />
                  </button>
                  <div className={`p-1 rounded-full ${currentTheme.neumorphicInset} ${currentTheme.bg}`}>
                    <select value={themeName} onChange={(e) => setThemeName(e.target.value)} className={`${currentTheme.bg} border-0 ${currentTheme.text} text-sm rounded-full focus:ring-0 p-2`}>
                      <option value="warm">Cálido</option>
                      <option value="serene">Sereno</option>
                      <option value="nature">Naturaleza</option>
                    </select>
                  </div>
                  <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} className={`p-3 rounded-full ${currentTheme.neumorphicSm} ${currentTheme.bg} hover:bg-white transition-all`}>
                    {mode === 'light' ? <Moon size={18} className={currentTheme.text} /> : <Sun size={18} className={currentTheme.text} />}
                  </button>
                  <div className={`p-1 rounded-full ${currentTheme.neumorphicInset} ${currentTheme.bg}`}>
                    <select value={selectedVoiceURI} onChange={handleVoiceChange} className={`${currentTheme.bg} border-0 ${currentTheme.text} text-sm rounded-full focus:ring-0 p-2`}>
                      {availableVoices.map(voice => ( <option key={voice.voiceURI} value={voice.voiceURI}> {voice.name.split('(')[0]} </option> ))}
                    </select>
                  </div>
                  <button onClick={handleToggleVoiceResponse} className={`p-3 rounded-full ${currentTheme.neumorphicSm} ${currentTheme.bg} hover:bg-white transition-all`}>
                      {isVoiceResponseEnabled ? <Volume2 className={`w-6 h-6 ${currentTheme.text}`}/> : <VolumeX className="w-6 h-6 text-gray-500"/>}
                  </button>
              </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="container mx-auto max-w-3xl">
            {Object.keys(groupedByDate).sort().map(date => (
              <div key={date}>
                <div className="text-center my-4">
                  <span className={`${currentTheme.header} ${currentTheme.text} text-xs font-semibold px-3 py-1 rounded-full`}>
                    {new Date(date).toLocaleDateString('es-ES', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                {groupedByDate[date].map((msg, index) => (
                  <Message 
                    key={`${date}-${index}`}
                    message={msg.text} 
                    isUser={msg.isUser}
                    playbackState={playbackState}
                    isLastMessage={index === groupedByDate[date].length - 1 && date === Object.keys(groupedByDate).sort().pop()}
                    onPlaybackControl={handlePlaybackControl}
                    onWordClick={handleWordClick}
                    theme={currentTheme}
                  />
                ))}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center gap-3 my-5">
                <div className={`flex-shrink-0 p-2 rounded-full ${currentTheme.neumorphicSm} bg-white`}><AssistantIcon isSpeaking={true} theme={currentTheme}/></div>
                <div className={`px-5 py-4 rounded-3xl max-w-md md:max-w-lg ${currentTheme.neumorphicMd} ${currentTheme.aiBubble}`}>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 ${currentTheme.text}/50 rounded-full animate-pulse delay-75`}></span>
                    <span className={`w-2.5 h-2.5 ${currentTheme.text}/50 rounded-full animate-pulse delay-150`}></span>
                    <span className={`w-2.5 h-2.5 ${currentTheme.text}/50 rounded-full animate-pulse delay-300`}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </main>
        
        <div className="p-4 sticky bottom-0">
          <div className="container mx-auto max-w-3xl">
            <div className={`flex items-center ${currentTheme.bg} rounded-full p-2 ${currentTheme.neumorphicInset}`}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleTextSend()} placeholder={isListening ? "Grabando... pulsa para detener" : "Escribe o pulsa el micrófono..."} className={`flex-1 bg-transparent outline-none px-4 ${currentTheme.text} placeholder-gray-500 font-medium`} disabled={isLoading} />
              <button onClick={handleToggleListen} disabled={!recognitionRef.current} className={`p-4 rounded-full transition-all duration-300 ${isListening ? 'bg-red-400 text-white shadow-md scale-110' : `${currentTheme.bg} ${currentTheme.text} hover:bg-white ${currentTheme.neumorphicSm}`}`}>
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button onClick={handleTextSend} disabled={isLoading || input.trim() === ''} className={`ml-2 ${currentTheme.userBubble} text-white rounded-full p-4 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 ${currentTheme.neumorphicSm} hover:scale-105`}>
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className={`bg-transparent text-center p-4 text-xs ${currentTheme.text}/70 z-10`}>
        <p>
          <Heart className={`w-4 h-4 inline-block mx-1 ${currentTheme.primary}`}/>
          La conversación se guarda en tu navegador. Si el dolor es muy intenso, considera buscar ayuda de un profesional de la salud mental.
        </p>
      </footer>
    </div>
  );
};

export default App;
