import React from 'react';

const NotificationBadge = ({count}) => {
    return (
            <span className="position-relative">
                <i className="bi bi-bell-fill h3"></i>
                <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger${count? ' d-block':' d-none'}`}>
                    {count}
                </span>
            </span>
    );
};

export default NotificationBadge;