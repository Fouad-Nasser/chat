import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChatHeader from '../../Components/ChatHeader';
import './chats.css';
import Toast from 'react-bootstrap/Toast';
import { ChatState } from '../../Context/ChatProvider';
import axios from "axios";
import ListGroup from 'react-bootstrap/ListGroup';
import { getSender, getSenderFull, getUserChatInfo } from '../../Utils/utils';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import UserListItem from '../../Components/UserListItem';
import MessageBox from '../../Components/MessageBox/MessageBox';
import io from "socket.io-client";


const ENDPOINT = "http://localhost:5000/";
let socket = io(ENDPOINT);

const Chats = () => {
    const [show, setShow] = useState(false);
    const [toastMeesage, setToastMeesage] = useState(false);
    const [searchTxt, setSearchTxt] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [receivedMessage, setReceivedMessage] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [showMsgBox, setShowMsgBox] = useState(false);
    const { selectedChat, setSelectedChat, user, chats, setChats, reloadChats, setReloadChats, onlineUsers, setOnlineUsers} = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:5000/api/chat/", config);
      console.log("fff",data);
      setChats(data);
    } catch (error) {
      setToastMeesage("Can't Load the Chats");
      setShow(true);
    }
  };


  
  const handleSearch = async () => {
    if (!searchTxt) {
      setToastMeesage("Please Enter Search Text");
      setShow(true);
      return;
    }

    try {      
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
      
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${searchTxt}`, config);
            console.log("search",data);
            setSearchResult(data);
            setIsSearch(true);
          } catch (error) {
            setToastMeesage("Can't Load Search Results");
            setShow(true);
          }
  };


  const accessChat = async (userId) => {
    console.log(userId);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:5000/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      if (selectedChat) {
        socket.emit("leave chat", selectedChat._id);
      }
      setSelectedChat(data);
      setShowMsgBox(true);
      setIsSearch(false);
    } catch (error) {
      setToastMeesage("Can't Chat With This User");
      setShow(true);
    }
  };

  // useEffect(() => {
  //   socket.on("get online users", (users) => {
  //     setOnlineUsers(users);
  //   });
  // }, []);


  
  useEffect(() => {
    socket.emit("setup", user._id);
    socket.on("get online users", (users) => {
      setOnlineUsers(users);
    });
    socket.on("message recieved", (newMessageRecieved) => {
      setReceivedMessage(newMessageRecieved);
    });
    socket.on("connected", () => setSocketConnected(true));
  }, []);



  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [reloadChats]);


  const getUserList = (arr,notFoundMsg)=>{
    console.log(arr,"arrrrr");
    return(
      arr.length > 0 
      ? arr.map(c=>{
        let chatUser = getUserChatInfo(c,user);
        return(
          <UserListItem
          key={c._id}
          user={chatUser}
          func={()=>{
            if (selectedChat) {
              socket.emit("leave chat", selectedChat._id);
            }
            setShowMsgBox(true);
            setSelectedChat(c);
          }}
          />
        )
      })
      :<p className='text-center'>{notFoundMsg}</p>
    )
  }

    return (
        <div className="chats position-relative">
            <Container className="p-0 h-100" fluid>
                <Row className="chatsHeader w-100 bg-primary ms-0">
                    <Col className="p-0 chatsHeader">
                        <ChatHeader socket={socket}/>
                    </Col>
                </Row> 

                <Row className='me-0 mt-2 chatsBody'>
                    <Col className={`col-md-4 d-md-block h-100 ${showMsgBox? "d-none":"d-block"} p-0`}>
                      <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                        <div className="chatList border border-4 border-primary rounded-top bg-light">
                        <Toast className='m-auto' show={show} onClose={()=>{setShow(false)}} bg="danger">
                          <Toast.Header>
                          <strong className="me-auto">
                              <i className='bi bi-exclamation-circle m-1 errIcon'/>
                              Error
                          </strong>
                          </Toast.Header>
                          <Toast.Body className='text-white toastBody'>{toastMeesage}</Toast.Body>
                      </Toast>

                      <div className="bg-primary chatListHeader">                      
                          <InputGroup >                             
                                <Form.Control
                                type="text" 
                                placeholder="Search..."
                                aria-describedby="search"
                                onChange={(e) => setSearchTxt(e.target.value)}
                                />
                            {/* <Button 
                                className='ms-3' 
                                onClick={()=>setIsSearch(!isSearch)}
                                type="button">
                                    Get All
                                </Button> */}
                                <InputGroup.Text className="bg-primary text-light" id="search">
                                  <i className="bi bi-search"
                                    // style={{cursor:'pointer'}}
                                    onClick={handleSearch}
                                    />
                                </InputGroup.Text>
                            </InputGroup>

                            <ButtonToolbar className="mb-3 w-100" aria-label="Toolbar with button groups">
                              <ButtonGroup className="pt-2 w-100"  aria-label="Second group">
                                <Button
                                onClick={()=>{
                                  setIsSearch(false);
                                  setIsGroup(false);
                                  setIsOnline(false);
                                }}
                                >
                                  Chats
                                </Button>
                                <Button
                                onClick={()=>{
                                  setIsSearch(false);
                                  setIsGroup(true)
                                  setIsOnline(false);
                                }}
                                >
                                  Groups
                                </Button>
                                <Button
                                onClick={()=>{
                                  setIsSearch(false);
                                  setIsGroup(false);
                                  setIsOnline(true);
                                }}
                                >
                                  Online
                                </Button>
                              </ButtonGroup>
                            </ButtonToolbar>
                            </div>
                              

                            <div className='listGroup'>
                            <ListGroup >
                              {isSearch?
                              searchResult.length>0 ?
                              searchResult.map(c=>{
                                return(
                                  <UserListItem
                                  key={c._id}
                                  user={c}
                                  func={() => accessChat(c._id)}
                                  />
                                )
                              }):
                                <p className='text-center'>No User is Match</p>
                              :
                                isGroup?
                                  getUserList(chats.filter(c=>c.isGroupChat),"No Groups are Found")
                                  :
                                  isOnline?
                                  getUserList(chats.filter(c=>{
                                    return c.isGroupChat || onlineUsers.some((ou) => ou.id === getSenderFull(user,c.users)._id)
                                  }),"No Online Usrs are Found")
                                  :
                                  getUserList(chats,"No Chats are Found")
                                  
                            }
                          </ListGroup>
                            </div>
                        </div>
                      </div>
                    
                </Col>

                    
                    <Col className={`col-md-8 d-md-block ${showMsgBox? "d-block":"d-none"} h-100 p-0`}>
                      <div className="h-100 w-100 d-flex align-items-center">
                        <div className="mesgBox ms-md-0 border border-4 border-primary rounded-top">
                          <MessageBox 
                          socket={socket}
                          receivedMessage={receivedMessage}
                          socketConnected={socketConnected}
                          setShowMsgBox={setShowMsgBox}
                          />
                        </div>
                      </div>
                    </Col>
                </Row>   
            </Container>
        </div>
        
    );
};

export default Chats;