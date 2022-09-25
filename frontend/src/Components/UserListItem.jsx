import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { ChatState } from '../Context/ChatProvider';


const UserListItem = ({user,func,disblay='d-block',imageOnly}) => {
    const {onlineUsers} = ChatState();

    console.log(user._id,"------------------");
    console.log(onlineUsers);

    return (
        <ListGroup.Item
            className={disblay}
            style={{cursor:'pointer'}}
            onClick={func}
            >

            <span className="userImg position-relative">
            <img
            src={user.image}
            alt="user image"
            style={{
                width:50,
                cursor:'pointer'
            }}
            className="rounded-circle"
            />
            {(user.isGroupChat||onlineUsers.some((ou) => ou.id === user._id)) &&<span className="position-absolute top-0 start-0 translate-middle p-2 bg-success border border-light rounded-circle"></span>}
            </span>
            {
                imageOnly || 
                <span className="userChatName ms-2">
                    {user.name}
                </span>
            }
            
        </ListGroup.Item>
    );
};

export default UserListItem;