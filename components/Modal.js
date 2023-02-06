import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpened, children, setOpened }) => {
  return (
    <>
      {isOpened && (
        <div className='modal'>
          <button
            aria-label='Close'
            type='button'
            className='modal__close-event'
            onClick={setOpened}
          />
          <div className='modal__body'>{children}</div>
        </div>
      )}
    </>
  );
};

export default Modal;
