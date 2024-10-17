import { Mosaic } from 'react-loading-indicators'

function Loading(msg) {
    return (
        <div className='w-[50%] flex flex-col justify-center items-center gap-5 m-5'>
            <Mosaic color="#cec702" size="large" text="" textColor="" />
            <p><b>{msg}</b></p>
        </div>
    )
}

export default Loading;