import React from 'react';
import {ModalContainer, CloseButton} from './ModalStyles';
import { GridWrapper } from '../Events-grid/gridStyles';
import { TextWrapper, CityWrapper } from '../Filters/FilterStyles';

const CityModal = ({ isOpen, onClose, data}) => {

    return (
      <ModalContainer isOpen={isOpen} className="slide-modal">
        i am sliding
        <GridWrapper>
          {data?.map(city => (
                <CityWrapper key={city.id || city.name} onClick={() => handleClick(city.city_id ? city.city_id : city.type_name)}>
                    <TextWrapper key={city}>{city.city_name}</TextWrapper>
                </CityWrapper>
          ))}
        </GridWrapper>
        <CloseButton onClick={() => onClose()}>Close</CloseButton>
      </ModalContainer>
    );
  };
  
  export default CityModal;



