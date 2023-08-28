import React from 'react'
import {CardSkeleton, LeftCol, RightCol} from './LoaderStyles'
import Skeleton from 'react-loading-skeleton';


function Loader() {
    return (
        <CardSkeleton>
            <LeftCol>
                <Skeleton />
            </LeftCol>
            <RightCol>
                <Skeleton/>
            </RightCol>
        </CardSkeleton>
      );
}

export default Loader