import React, {FC} from 'react';


const NotImplemented: FC<{props: any}> = props => {
    return(
        <div>
            This Componeneted was not implemented <br/>
            {JSON.stringify(props, null, 4)}
        </div>
    )

}

export default NotImplemented;