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

const CreateGroup = () => {
    const [showM, setShowM] = useState(false);
    const [show, setShow] = useState(false);
    const [toastMeesage, setToastMeesage] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [addedUsers, setAddedUsers] = useState([]);
    const [groupName, setGroupName] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();



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

      const handleGroup = (newUser) => {
        // console.log("new user");
        if (addedUsers.includes(newUser)) {
            setToastMeesage("User is added");
            setShow(true);
          return;
        }
    
        setAddedUsers([...addedUsers, newUser]);
      };

      const handleDelete = (deletedUser) => {
        setAddedUsers(addedUsers.filter((u) => u._id !== deletedUser._id));
      };


      const handleCreateGroup = async () => {
        if (!groupName || !addedUsers) {
            setToastMeesage("Please fill all the feilds");
            setShow(true);
          return;
        }
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            `http://localhost:5000/api/chat/group`,
            {
              name: groupName,
              users: JSON.stringify(addedUsers.map((u) => u._id)),
            },
            config
          );
          setChats([data, ...chats]);
          console.log(data);
          handleCloseM();
        } catch (error) {
          setToastMeesage("Can't Create the Group!");
          setShow(true);
        }
      };


    const handleCloseM = () => setShowM(false);
    const handleShowM = () => setShowM(true);

    return (
        <>
            <span onClick={handleShowM}>
              <i className="bi bi-people-fill text-primary"> Create Group</i>
            </span>

            <Modal show={showM} onHide={handleCloseM}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a New Group Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Group Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter Group Name"
                        onChange={(e) => setGroupName(e.target.value)}
                        required/>
                    </Form.Group>
                    
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
                            addedUsers.map( user =>
                                <Badge
                                 className="ms-2"
                                 bg="danger"
                                 key={user._id}
                                 style={{cursor:'pointer'}}  
                                 onClick={()=>handleDelete(user)}
                                 >
                                    <i className="bi bi-trash me-1 h5"/>
                                    {user.name}
                                </Badge>
                            )
                        }
                    </div>

                    <ListGroup>
                    {
                        searchResult?.slice(0, 4)
                        .map(user =>(
                            <UserListItem
                            key={user._id}
                            user={user}
                            func={() => handleGroup(user)}
                            />
                        ))
                    }
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                    variant="primary"
                    onClick={handleCreateGroup}
                    >
                        Create Group
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        
    );
};

export default CreateGroup;