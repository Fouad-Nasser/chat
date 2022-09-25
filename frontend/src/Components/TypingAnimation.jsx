import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const TypingAnimation = () => {
    return (
        <>
            <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
            variant="secondary"
            />
            <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
            variant="secondary"
            />
            <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
            variant="secondary"
            />
        </>
    );
};

export default TypingAnimation;