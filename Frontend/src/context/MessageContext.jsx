import { createContext, useState, useContext } from 'react';

const MessageContext = createContext();
 const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  return (
    <MessageContext.Provider value={{ message, messageType, setMessage, setMessageType }}>
      {children}
    </MessageContext.Provider>
  );
};
export default MessageProvider;
export const useMessageContext = () => useContext(MessageContext);
