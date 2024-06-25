import React from 'react';
import ReactModal from 'react-modal';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  content: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onRequestClose, content }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Preview Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <button onClick={onRequestClose} className="close-button">X</button>
      <div className="modal-content">
        {content}
      </div>
    </ReactModal>
  );
};

export default Modal;
