import React, { useEffect, useRef } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../../Context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../Config/ChatLogic';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-section"style={{ height: '400px', padding: '10px' }}>
      <ScrollableFeed>
        {messages && messages.map((m, i) => (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center',  
              marginBottom: '10px',  
            }} 
            key={m._id}
          >
            {(isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${m.sender._id === user.id ? "#BEE3F5" : "#B9F5D0"}`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSameUser(messages, m, i, user.id) ? 3 : 10,
                alignSelf: 'flex-start',
                wordWrap: 'break-word',
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollableFeed>
    </div>
  );
};

export default ScrollableChat;
