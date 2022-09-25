import React from 'react';

const UserInfoCard = ({user}) => {
    return (
        <div className="userInfoCard d-flex flex-column align-items-center">
              <img 
                src={user.image} 
                alt="user image" 
                style={{
                    width:120,
                }}
                className="rounded-circle"
                />
              <span className='h2'>{user.name}</span>
              <span>{user.email}</span>

        </div>
    );
};

export default UserInfoCard;