import React, {FC} from 'react';


const NotImplemented: FC<{props: any}> = props => {
    return(
        <div>
            This Component was not implemented <br/>
           <pre>{JSON.stringify(props, null, 4)}</pre> 
        </div>
    )

}

export default NotImplemented;