import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { ChatState } from '../Context/ChatProvider';
import axios from "axios";
import Toast from 'react-bootstrap/Toast';
import ListGroup from 'react-bootstrap/ListGroup';
import UserListItem from './UserListItem';
import Badge from 'react-bootstrap/Badge';

const UpdateGroup = () => {
    const [showM, setShowM] = useState(false);
    const [show, setShow] = useState(false);
    const [toastMeesage, setToastMeesage] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [addedUsers, setAddedUsers] = useState([]);
    const [groupName, setGroupName] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats, reloadChats, setReloadChats } = ChatState();



    const handleSearch = async (searchTxt) => {
      if (!(searchTxt.trim())) {
        setSearchResult([]);
        return;
      }
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`http://localhost:5000/api/user?search=${searchTxt}`, config);
          console.log(data);
          setSearchResult(data);
        } catch (error) 
        {
            console.log(error);
            setToastMeesage("Can't Load Search Results");
            setShow(true);
        }
      };


      const handleRename = async () => {
        if (!groupName) return;
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `http://localhost:5000/api/chat/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupName
            },
            config
          );
    
          setSelectedChat(data);
          setReloadChats(!reloadChats);
        } catch (error) {
          setToastMeesage("Error Occured");
          setShow(true);
        }
        setGroupName("");
      };

      
      const handleAddUser = async (addedUser) => {
        if (selectedChat.users.find((u) => u._id === addedUser._id)) {
            setToastMeesage("User Already in group!");
            setShow(true);
          return;
        }
    
        if (selectedChat.groupAdmin._id !== user._id) {
            setToastMeesage("Only admins can add someone!");
            setShow(true);
          return;
        }

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `http://localhost:5000/api/chat/groupadd`,
            {
              chatId: selectedChat._id,
              userId: addedUser._id,
            },
            config
          );
    
          setSelectedChat(data);
          setReloadChats(!reloadChats);
        } catch (error) {
            setToastMeesage("Can't Load Search Results");
            setShow(true);
        }
        // setGroupChatName("");
      }

      const handleRemove = async (remUser) => {
        if (selectedChat.groupAdmin._id !== user._id && remUser._id !== user._id) {
            setToastMeesage("don't have permission");
            setShow(true);
          return;
        }

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `http://localhost:5000/api/chat/groupremove`,
            {
              chatId: selectedChat._id,
              userId: remUser._id,
            },
            config
          );
    
          remUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
          setReloadChats(!reloadChats);
        } catch (error) {
            setToastMeesage("Error Occured");
            setShow(true);
        }
      };
    


    const handleCloseM = () => setShowM(false);
    const handleShowM = () => setShowM(true);

    return (
        <>
            <i
            className='bi bi-gear me-4'
            onClick={handleShowM}
            />

            <Modal show={showM} onHide={handleCloseM}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedChat?.chatName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                            <Button
                            variant="success"
                            onClick={handleRename}
                            >
                              Rename
                            </Button>
                            
                            <Form.Control
                            type="text" 
                            placeholder="Enter New Group Name"
                            onChange={(e) => setGroupName(e.target.value)}
                            />
                    </InputGroup>

                    <InputGroup className="mb-3">
                            <InputGroup.Text id="search">
                               <i className="bi bi-search"
                                onClick={handleSearch}
                                />
                            </InputGroup.Text>
                            
                            <Form.Control
                            type="text" 
                            placeholder="Search..."
                            aria-describedby="search"
                            onChange={(e) => handleSearch(e.target.value)}
                            />
                    </InputGroup>

                    <Toast className='m-auto' show={show} onClose={()=>{setShow(false)}} bg="danger">
                        <Toast.Header>
                        <strong className="me-auto">
                            <i className='bi bi-exclamation-circle m-1 errIcon'/>
                            Error
                        </strong>
                        </Toast.Header>
                        <Toast.Body className='text-white toastBody'>{toastMeesage}</Toast.Body>
                    </Toast>

                    <div className="addedUsers mb-2">
                        {
                            selectedChat?.users.map( user =>
                                <Badge
                                 className="ms-2"
                                 bg="danger"
                                 key={user._id}
                                 style={{cursor:'pointer'}}  
                                 onClick={()=>handleRemove(user)}
                                 >
                                    <i className="bi bi-trash me-1 h5"/>
                                    {user.name}
                                </Badge>
                            )
                        }
                    </div>

                    <ListGroup>
                    {
                        searchResult?.slice(0, 5)
                        .map(user =>(
                            <UserListItem
                            key={user._id}
                            user={user}
                            func={() => handleAddUser(user)}
                            />
                        ))
                    }
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                    variant="danger"
                    onClick={() => handleRemove(user)}
                    >
                        Leave Group
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        
    );
};

export default UpdateGroup;