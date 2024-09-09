import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../../Context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../Config/ChatLogic';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => (
        <div style={{ display: 'flex' }} key={m._id}>
          {
            (isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )
          }
          <span
            style={{
              backgroundColor: `${m.sender._id === user.id ? "#BEE3F5" : "#B9F5D0"}`, // Corrected comparison
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
              marginLeft: isSameSenderMargin(messages, m, i, user.id),
              marginTop:isSameUser(messages,m,i,user.id)?3:10,
            }}
          >{m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;