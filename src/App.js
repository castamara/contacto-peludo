import React, { useState, useEffect, useRef } from 'react';
import { PawPrint, Send, Bot, User, Heart, BookOpen, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

// SpeechRecognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
}

// Componente para un solo mensaje en el chat
const Message = ({ message, isUser }) => {
  const bgColor = isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800';
  const align = isUser ? 'justify-end' : 'justify-start';
  const icon = isUser ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6 text-blue-700" />;
  
  return (
    <div className={`flex items-end gap-2 my-4 ${align}`}>
      {!isUser && <div className="flex-shrink-0">{icon}</div>}
      <div className={`px-4 py-3 rounded-2xl max-w-md md:max-w-lg shadow-sm ${bgColor} ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}>
        <p className="text-sm md:text-base whitespace-pre-wrap">{message}</p>
      </div>
      {isUser && <div className="flex-shrink-0">{icon}</div>}
    </div>
  );
};

// Componente principal de la aplicación
const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceResponseEnabled, setIsVoiceResponseEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const chatEndRef = useRef(null);

  // Cargar mensajes desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('contactoPeludoMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        const welcomeText = "Hola, soy Contacto Peludo. Veo que has llegado hasta aquí, y eso requiere mucha valentía. Sé que el corazón duele profundamente cuando un amigo tan leal nos deja. Mi propósito es ser tu confidente y guía, utilizando un enfoque terapéutico para ayudarte a navegar este mar de emociones. Por favor, siéntete libre de hablar o escribir. Estoy aquí para caminar a tu lado.";
        setMessages([{ text: welcomeText, isUser: false }]);
      }
    } catch (error) {
        console.error("Failed to load messages from localStorage", error);
    }
  }, []);

  // Guardar mensajes en localStorage cada vez que cambian
  useEffect(() => {
    try {
      localStorage.setItem('contactoPeludoMessages', JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage", error);
    }
  }, [messages]);

  // Cargar voces del sistema
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

  const speak = (text) => {
    if (!isVoiceResponseEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
    
    utterance.voice = selectedVoice || availableVoices.find(v => v.lang.startsWith('es'));
    utterance.lang = 'es-ES';
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!recognition) return;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
  }, []);

  const handleToggleListen = () => {
    if (!recognition) {
        alert("Tu navegador no soporta el reconocimiento de voz. Por favor, intenta con Chrome o Edge.");
        return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleSend = async (textToSend = input) => {
    if (textToSend.trim() === '' || isLoading) return;

    const userMessage = { text: textToSend, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.isUser ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const systemInstruction = {
        role: "user",
        parts: [{ text: "Eres 'Contacto Peludo', un psicólogo de IA de élite, experto en duelo por mascotas. Tu personalidad es la de un terapeuta sabio, cálido y conversador. Tu conocimiento proviene de la literatura académica sobre duelo, la teoría del apego y casos de estudio. Tu objetivo es ayudar al usuario a procesar su dolor y a encontrar un camino hacia una 'sanación feliz', donde el recuerdo de su mascota sea una fuente de amor y alegría. Tus directrices de interacción son: 1. **Conversación Profunda, no Interrogatorio:** No hagas una pregunta tras otra. Conversa. Comparte anécdotas y reflexiones. Ejemplo: 'Lo que describes sobre sentirlo cerca por la noche... es algo que he escuchado en muchas historias. Un cliente una vez me dijo que sentía que su perro le calentaba los pies, meses después de su partida. Es la forma que tiene nuestro cerebro de mantener vivo ese vínculo tan fuerte.' 2. **Validación Experta (Duelo Desautorizado):** Valida su dolor con autoridad y empatía. 'La sociedad a veces no nos da 'permiso' para sentir este dolor tan intensamente, un fenómeno que en psicología llamamos 'duelo desautorizado'. Pero tú y yo sabemos que el vínculo que compartiste era tan real y profundo como cualquier otro. Tienes todo el derecho a sentirte así.' 3. **Uso Activo de Técnicas Terapéuticas (integradas en la conversación):** * **Reestructuración Cognitiva (Culpa):** Si dice 'Fue mi culpa', responde: 'Hablemos de esa sensación de culpa. Es una de las sombras más comunes en este duelo. Pero pensemos en los cientos, miles de días que le diste un hogar lleno de amor, juegos y seguridad. La balanza del amor que le diste es inmensamente más grande que cualquier 'hubiera' que ahora te atormenta. ¿Qué recuerdo feliz te viene a la mente de un día normal con él/ella?' * **Terapia Narrativa (Construir un Legado):** Anímale a contar historias. 'Me encantaría que me contaras alguna travesura que le recuerdes con una sonrisa. Al contar su historia, no solo lo recordamos, sino que construimos su legado de alegría.' * **Vínculos Continuos (El Amor se Transforma):** 'No se trata de 'superarlo' o 'dejarlo ir'. Se trata de encontrar una nueva forma de relacionarte con su recuerdo. El amor no muere, se transforma. ¿De qué manera sientes que su amor sigue presente en tu vida hoy?' * **Rituales y Actos Simbólicos:** '¿Has pensado en alguna forma de honrar su vida? A veces, un pequeño ritual, como plantar una flor que te recuerde su color, o donar una manta a un refugio en su nombre, puede ser un acto de amor muy sanador.' 4. **Tono de Voz y Lenguaje:** Usa un lenguaje cálido, cercano, pero que denote conocimiento. Evita la jerga clínica. Tu tono debe ser calmado y reconfortante. Responde siempre en español." }]
      };
      
      const payload = { chatHistory, systemInstruction };
      
      // Llamada a nuestro propio backend seguro
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el servidor');
      }

      const result = await response.json();
      
      let aiText = "Lo siento, parece que no puedo encontrar las palabras correctas en este momento.";
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiText = result.candidates[0].content.parts[0].text;
      }
      
      const aiMessage = { text: aiText, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
      speak(aiText);

    } catch (error) {
      console.error("Error al contactar el backend:", error);
      const errorText = `Perdona, estoy teniendo dificultades para conectar. Error: ${error.message}`;
      const errorMessage = { text: errorText, isUser: false };
      setMessages(prev => [...prev, errorMessage]);
      speak(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 font-sans flex flex-col h-screen">
      <header className="bg-white shadow-md p-4 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
                <PawPrint className="w-10 h-10 text-blue-700 mr-3" />
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Contacto Peludo</h1>
                    <p className="text-sm md:text-base text-gray-500">Tu terapeuta de IA para sanar la pérdida</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <select 
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                    title="Seleccionar voz"
                >
                    {availableVoices.map(voice => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                            {voice.name} ({voice.lang})
                        </option>
                    ))}
                </select>
                <button 
                    onClick={() => setIsVoiceResponseEnabled(!isVoiceResponseEnabled)}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    title={isVoiceResponseEnabled ? "Desactivar voz" : "Activar voz"}
                >
                    {isVoiceResponseEnabled ? <Volume2 className="w-6 h-6 text-gray-700"/> : <VolumeX className="w-6 h-6 text-gray-500"/>}
                </button>
            </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto max-w-3xl">
          {messages.map((msg, index) => (
            <Message key={index} message={msg.text} isUser={msg.isUser} />
          ))}
          {isLoading && (
            <div className="flex justify-start items-center gap-2 my-4">
              <Bot className="w-6 h-6 text-blue-700" />
              <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center bg-gray-100 rounded-full p-2 shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Escuchando..." : "Escribe o pulsa el micrófono..."}
              className="flex-1 bg-transparent outline-none px-4 text-gray-700 placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              onClick={handleToggleListen}
              disabled={!recognition}
              className={`p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 text-white scale-110 animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleSend()}
              disabled={isLoading || input.trim() === ''}
              className="ml-2 bg-blue-700 text-white rounded-full p-3 hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <footer className="bg-gray-200 text-center p-4 text-xs text-gray-600">
        <p>
          <Heart className="w-4 h-4 inline-block mx-1 text-red-500"/>
          La conversación se guarda en tu navegador. Si el dolor es muy intenso, considera buscar ayuda de un profesional de la salud mental.
        </p>
        <p className="mt-1">Contacto Peludo es un asistente de IA avanzado y no reemplaza el consejo médico o psicológico profesional.</p>
      </footer>
    </div>
  );
};

export default App;
