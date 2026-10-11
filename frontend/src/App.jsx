import { useState,useRef,useEffect } from 'react';
import './index.css'
import SideBar from './components/SideBar/SideBar'
import ChatHeader from './components/ChatHeader/ChatHeader'
import MessageList from './components/MessageList/MessageList';
import ChatInput from "./components/ChatInput/ChatInput";
import axios from "axios"

const API_BASE_URL = 'http://localhost:3788/api'

function App() {
      const [conversations, setConversations] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const messagesEndRef = useRef(null);

 const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, isLoading]);

const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/conversation`);
      console.log(response);
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };


  const handleSendMessage = async question => {
    // Optimistically add user message
    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: question,
    };
    setConversations(prev => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat/conversation`, {
        question,
      });
      if (response.data.success) {
        const { userConversation, assistantConversation } = response.data.data;
        // Replace temp message with real ones
        setConversations(prev => {
          const filtered = prev.filter(msg => msg.id !== tempUserMessage.id);
          return [...filtered, userConversation, assistantConversation];
        });
      }
    } catch (error) {
      console.error('Error posting conversation:', error);

      // Extract error message from backend response or use a realistic fallback
      const errorMessage =
        error.response?.data?.message ||
        'There was an error generating a response.';

      // Add error message to chat
      const errorConversation = {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorMessage,
      };

      setConversations(prev => [...prev, errorConversation]);
    } finally {
      setIsLoading(false);
    }
  };
   useEffect(() => {
    fetchConversations();
  }, []);
  return (
    <div className="app">
          <SideBar/>
      <main className='main'>
          <ChatHeader/>
          <MessageList conversations={conversations} isLoading={isLoading} messagesEndRef={messagesEndRef} />
          <ChatInput handleSendMessage={handleSendMessage} isLoading={isLoading}/>
      </main>
    </div>
  )
}

export default App