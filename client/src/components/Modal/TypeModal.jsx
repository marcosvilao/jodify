import React from 'react';
import {ModalContainer, CloseButton} from './ModalStyles';
import { GridWrapper } from '../Events-grid/gridStyles';
import { TextWrapper, CityWrapper } from '../Filters/FilterStyles';

const TypeModal = ({ isOpen, onClose, data, setType}) => {

    return (
      <ModalContainer isOpen={isOpen} className="slide-modal">
        <GridWrapper>
          {data?.map(type => (
                <CityWrapper key={type.name} onClick={() => setType(type.type_name)}>
                    <TextWrapper key={type}>{type.type_name}</TextWrapper>
                </CityWrapper>
          ))}
        </GridWrapper>
        <CloseButton onClick={() => onClose()}>Close</CloseButton>
      </ModalContainer>
    );
  };
  
  export default TypeModal;



