import styled from 'styled-components'

export const ModalContainer = styled.div`
    position: absolute;
    width: 50%;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.isOpen ? 'translateY(0%)' : 'translateY(100%)')};
    bottom: 0;
    /* left: 50%; */
    background-color: #DBDBDB;
    max-height: 50vh;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 3;
`;

export const CloseButton = styled.button`
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`;

