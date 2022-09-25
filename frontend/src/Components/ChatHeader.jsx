import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import Logo from './Logo';
import Dropdown from 'react-bootstrap/Dropdown';
import CreateGroup from './CreateGroup';
import NotificationBadge from './NotificationBadge';
import { getSender, getSenderFull } from '../Utils/utils';
import UserListItem from './UserListItem';
import { useNavigate } from 'react-router-dom';
import UserInfoCard from './UserInfoCard';



const ChatHeader = ({socket}) => {
    const navigate = useNavigate();
    const { user, setUser, notifications, setNotifications, selectedChat, setSelectedChat } = ChatState();


    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        socket.emit("logout", user._id);
        setUser(null)
        navigate("/login");
      };


    return (
        <>
            <div className="ps-2">
                <Logo/>
            </div>

            <div className="p-3 d-flex align-items-center">
            <Dropdown>
                    <Dropdown.Toggle className='m-2' id="dropdown-basic">
                    <NotificationBadge
                    count={notifications.length}
                    />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {
                            notifications.length > 0 ?
                            notifications.map(n=>
                                <Dropdown.Item 
                                    key={n._id}
                                    onClick={()=>{
                                        setSelectedChat(n.chat);
                                        setNotifications(notifications.filter((i)=> i !== n));
                                    }}
                                >
                                    <div className="h4">New Message received</div>
                                    <div>
                                    <UserListItem
                                    disblay='d-inline'
                                    user={getSenderFull(user, n.chat.users)}
                                    />
                                        <span> : {n.content.text}</span>
                                    </div>
                                    
                                </Dropdown.Item>
                            )
                            :   <Dropdown.Item className='h3'>No Notifications</Dropdown.Item>

                        }
                    </Dropdown.Menu>
                </Dropdown>



                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                    <UserListItem
                    disblay='d-inline'
                    user={user}
                    imageOnly={true}
                    />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item>
                        <UserInfoCard
                        user={user}
                        />
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <CreateGroup/>
                        </Dropdown.Item>
                        <Dropdown.Item 
                        onClick={logoutHandler}
                        >
                            <i className="bi bi-box-arrow-left text-danger"> Log Out</i>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    );
};

export default ChatHeader;