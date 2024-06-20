import React, { useState } from 'react'
import LeftView from './LeftView'
import RightView from './RightView'
import WindowSizeProvider from '../../Hooks/WindowSizeProvider'
import { useAuthContext } from '../../Auth/AuthProvider'

const MainPos = () => {
    const [rightViewClass, setRightViewClass] = useState('translate-x-full'); // Tailwind class for full translate
    const [isBackdropHidden, setIsBackDropHidden] = useState(true);
    const { width } = WindowSizeProvider();
    const {user} = useAuthContext()

    const toggleRightView = () => {
        setIsBackDropHidden(false);
        setRightViewClass('translate-x-0'); // Tailwind class for no translate
    };

    const hideRightView = () => {
        setRightViewClass('translate-x-full'); // Hide sidebar
        setIsBackDropHidden(true);
    };

    return (
        <div className='flex-1 overflow-auto flex w-full h-full bg-gray-50 p-0 md:p-0 relative'>
            {/* Backdrop */}
            {!isBackdropHidden && (
                <div
                    onClick={hideRightView}
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                    className='absolute w-full cursor-pointer h-screen bg-black z-10 transition-opacity duration-300'
                ></div>
            )}
            {/* Left Side */}
            {
            user === null ?
            <div className='flex-1 flex'>
                <div className="flex-1 overflow-auto p-5 flex flex-col space-y-5 h-full relative bg-white animate-pulse">
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="w-52 semiSm:w-64 lg:w-96 relative h-full ">
                    <div className="ps-2 py-2 text-xs  bg-gray-200 w-full h-full rounded pe-10 lg:text-sm lg:ps-5"></div>
                    </div>
                    <div className="hidden lg:flex items-start h-full gap-3 ">
                    <div className="h-4 bg-gray-300 rounded w-1/4 inline-block"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/4 inline-block"></div>
                    </div>
                    <div className="h-10 w-10 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
                <div className="scrollBar flex-1 overflow-y-auto bg-gray-200 rounded">
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 rounded mt-2"></div>
                    <div className="h-10 w-full bg-gray-200 rounded mt-2"></div>
                </div>
                </div>
                <div className="hidden md:flex animate-pulse">
                <div className="w-64 md:w-72 xl:w-96 p-3 overflow-hidden rounded shadow pt-5 pb-3 flex flex-col h-full bg-white">
                    
                    <div className="w-full flex items-center justify-between">
                    <h5 className="bg-gray-200 h-4 rounded w-24"></h5>
                    <div className="p-1.5 bg-gray-200 rounded relative"></div>
                    </div>
                    
                    <div className="flex flex-col mt-5 gap-2">
                    <h6 className="h-4 bg-gray-200 rounded w-24"></h6>
                    <div className="p-2 w-full border outline-none border-gray-200 rounded bg-gray-200"></div>
                    </div>

                    
                    <div className="h-20 bg-gray-200 mt-5 rounded overflow-hidden"></div>

                    
                    <div className="flex flex-col gap-3 pt-3 ">
                    
                    <div>
                        <div className="flex items-center justify-between">
                        <div className="font-extrabold bg-gray-200 h-4 rounded w-16"></div>
                        <div className="font-extrabold bg-gray-200 h-4 rounded w-16"></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                        <div className="font-extrabold bg-gray-200 h-4 rounded w-16"></div>
                        <div className="font-extrabold bg-gray-200 h-4 rounded w-16"></div>
                        </div>
                    </div>
                    
                    <div className="w-full">
                        <div className="bg-gray-200 h-8 rounded w-full"></div>
                    </div>
                    
                    <div className="w-full mt-3">
                        <div className="w-full h-8 bg-gray-200 rounded"></div>
                    </div>
                    </div>

                    <div className="h-full mt-3 bg-gray-200 rounded w-full"></div>
                </div>
                </div>
            </div>
            :
            <>
                <LeftView toggleRightView={toggleRightView} />
                <div className={`md:p-2 ${width <= 768 ? `fixed right-0 h-screen bg-white ${rightViewClass} z-20 transition-transform duration-300` : 'flex'}`}>
                    <RightView />
                </div>
            </>
            }
        </div>
    );
}

export default MainPos