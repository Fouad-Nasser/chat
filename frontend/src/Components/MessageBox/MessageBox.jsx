import React, { useEffect, useRef, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { getUserChatInfo, isLastMessage, isSameSender } from '../../Utils/utils';
import UserListItem from '.././UserListItem';
import Dropdown from 'react-bootstrap/Dropdown';
import UserInfoCard from '.././UserInfoCard';
import Button from 'react-bootstrap/Button';
import UpdateGroup from '.././UpdateGroup';
import './MessageBox.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import axios from 'axios';
import TypingAnimation from '../TypingAnimation';
import InputEmoji from 'react-input-emoji';
import VideoCall from '../VideoCall/VideoCall';


var selectedChatCompare; 

const MessageBox = ({socket, receivedMessage, socketConnected,setShowMsgBox}) => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [show, setShow] = useState(false);
    const [toastMeesage, setToastMeesage] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const inputEl = useRef(null);
    const scroll = useRef();
    const { selectedChat, setSelectedChat, user,reloadChats, setReloadChats,notifications, setNotifications,onlineUsers, setOnlineUsers } = ChatState();
    let chatUser = selectedChat?getUserChatInfo(selectedChat,user):null;

    

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
        
          const { data } = await axios.get(
            `http://localhost:5000/api/message/${selectedChat._id}`,
            config
          );

          setMessages(data);


          socket.emit("join chat", selectedChat._id);

        } catch (error) {
          console.log(error);
          // setToastMeesage("Failed to Load the Messages");
          // setShow(true);
        }
      };
    


    const sendMessage = async (msgContent) => {
      let msg = {
        content: msgContent,
        chatId: selectedChat._id
      }
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            setNewMessage("");
            // inputEl.current.value="";
           
            console.log(msg);
            const { data } = await axios.post(
              "http://localhost:5000/api/message",
              msg
              ,
              config
            );
            console.log(data);
            setMessages([...messages, data]);
            socket.emit("new message", data);
          } catch (error) {
            setToastMeesage("Failed to send the Message");
            setShow(true);
          }
      };


      const sendImage =(img) => {
        if (img === undefined) {
          setToastMeesage("Please Select an Image!");
          setShow(true);
          return;
        }


        console.log(img);

        if (img.type === "image/jpeg" || img.type === "image/png") {
          const data = new FormData();
          data.append("file", img);
          data.append("upload_preset", "chat-app");
          data.append("cloud_name", "dr3swllgw");
          axios.post("https://api.cloudinary.com/v1_1/dr3swllgw/upload", data)
            .then(({data}) => {
              console.log(data.url);
              sendMessage({image:data.url})
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          setToastMeesage("Please Select an Image!");
          setShow(true);
          return;
        }
      };


      

      useEffect(() => {
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    
        // eslint-disable-next-line
      }, []);
      
    

      useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
      }, [selectedChat]);



      useEffect(() => {
        if (receivedMessage !== null) {
            if (!selectedChatCompare || selectedChatCompare._id !== receivedMessage.chat._id) {
                  setNotifications([receivedMessage, ...notifications]);
                  setReloadChats(!reloadChats);
              } else {
                setMessages([...messages, receivedMessage]);

              }
        }
       
      }, [receivedMessage]);
    

      useEffect(()=> {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
      },[messages,istyping])

      useEffect(()=> {
         if (newMessage) {
           if (!socketConnected) return;
              
          if (newMessage) {
            // setTyping(true);
            socket.emit("typing", selectedChat._id);
          }
          let lastTypingTime = new Date().getTime();
          let timerLength = 3000;
          setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength) {
              socket.emit("stop typing", selectedChat._id);
              // setTyping(false);
            }
          }, timerLength);
       }
      },[newMessage])
    
      const typingHandler = (newMesg) => {
        setNewMessage(newMesg);
        console.log(newMesg);
        
      //  if (newMesg) {
      //      if (!socketConnected) return;
              
      //     if (!typing) {
      //       setTyping(true);
      //       socket.emit("typing", selectedChat._id);
      //     }
      //     let lastTypingTime = new Date().getTime();
      //     let timerLength = 3000;
      //     setTimeout(() => {
      //       let timeNow = new Date().getTime();
      //       let timeDiff = timeNow - lastTypingTime;
      //       if (timeDiff >= timerLength && typing) {
      //         socket.emit("stop typing", selectedChat._id);
      //         setTyping(false);
      //       }
      //     }, timerLength);
      //  }
      };
  console.log("onlineUsers",onlineUsers);
      
    return (
        <>
            {
                selectedChat?
                <>
                    <div className="mesHeader bg-primary d-flex justify-content-between align-items-center">
                        <Dropdown>
                            <Dropdown.Toggle className='me-2' id="dropdown-basic">
                                <UserListItem
                                disblay='d-inline'
                                user={chatUser}
                                imageOnly={true}
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item
                                    style={{
                                        cursor:'text'
                                    }}
                                >
                                    <UserInfoCard
                                    user={chatUser}
                                    />
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <div className="features d-flex text-light h3">
                                <i 
                                className="bi bi-arrow-left-square d-md-none me-4"
                                onClick={()=>{
                                  setShowMsgBox(false);
                                    socket.emit("leave chat", selectedChat._id);
                                    setSelectedChat(null);
                                }}
                                />

                                {
                                    selectedChat.isGroupChat?
                                        <UpdateGroup/>
                                    :
                                    <>
                                    <VideoCall/>
                                      <i className="bi bi-telephone me-4"/>
                                    </>
                                }
                        </div>
                    </div>

                    <div className="mesBody">
                        <div className="allMesg">

                            {messages?.map((m,i)=>{
                                let isRenderImg = isSameSender(messages, m, i, user._id) ||
                                                  isLastMessage(messages, i, user._id);
                                return(
                                    <div
                                      key={m._id}
                                      style={{
                                        paddingLeft:!isRenderImg?30:0,
                                        textAlign:m.sender._id !== user._id?'left':'right'
                                    }}
                                     >
                                        {isRenderImg?
                                            <img 
                                            src={m.sender.pic} 
                                            alt=""
                                            style={{
                                                width:25,
                                                marginRight:5
                                            }}
                                            className='rounded-circle'
                                             />:
                                             <></>
                                        }
                                        {
                                          m.content.image?
                                          <img 
                                          src={m.content.image} 
                                          alt=""
                                          style={{
                                              display:'inline-block',
                                              marginRight:5,
                                              marginBottom:5,
                                              maxWidth:"50%",
                                              borderRadius:20
                                        }}
                                        onLoad={()=>{scroll.current?.scrollIntoView({ behavior: "smooth" });}}
                                           />
                                          :
                                        <span
                                        style={{
                                            backgroundColor: `${
                                                m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                              }`,
                                              display:'inline-block',
                                              marginRight:5,
                                              marginBottom:5,
                                              padding:10
                                        }}
                                        >
                                            {m.content.text}
                                        </span>
                                        }
                                    </div>
                                );
                            }
                            )}

                            {istyping && <TypingAnimation/>}

                            <div ref={scroll}></div>
                        </div>


                        <div className="mesInput">
                        <Toast className='m-auto' show={show} onClose={()=>{setShow(false)}} bg="danger">
                        <Toast.Header>
                        <strong className="me-auto">
                            <i className='bi bi-exclamation-circle m-1 errIcon'/>
                            Error
                        </strong>
                        </Toast.Header>
                        <Toast.Body className='text-white toastBody'>{toastMeesage}</Toast.Body>
                        </Toast>
                        <div className="mesInputBox d-flex pe-3 align-items-center">
                        <input  
                        type="file" 
                        id='img' 
                        style={{display:'none'}}
                        accept="image/*"
                        onChange={(e) =>{
                           sendImage(e.target.files[0]);
                          }}
                        />
                        <label htmlFor="img">
                          <i 
                          className="bi bi-image text-primary h3"
                          style={{cursor:'pointer'}}
                          />
                        </label>                          
                            <InputEmoji
                                  onEnter={()=>{sendMessage({
                                    text:newMessage
                                  })}}
                                  cleanOnEnter={true}
                                  onChange={(v)=>{typingHandler(v)}}
                                  height={20}
                                  theme={"light"}
                                  ref={inputEl}
                                />
                            <Button
                            onClick={()=>{
                              sendMessage({
                                text:newMessage
                              });
                            inputEl.current.value="";  
                          }}
                            className="ms-2"
                            >
                                Send
                            </Button>

                        </div>

                        </div>
                    </div>
                </>:
                <div className="d-flex align-items-center h-100">
                    <p className='text-center w-100 h2'>Select User To Start Chating</p>
                </div>
            }
        </>
    );
};

export default MessageBox;