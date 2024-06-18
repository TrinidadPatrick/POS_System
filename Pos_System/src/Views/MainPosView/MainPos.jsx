import React, { useState } from 'react'
import LeftView from './LeftView'
import RightView from './RightView'
import WindowSizeProvider from '../../Hooks/WindowSizeProvider'

const MainPos = () => {
  const [rightViewClass, setRightViewClass] = useState('translate-x-full'); // Tailwind class for full translate
    const [isBackdropHidden, setIsBackDropHidden] = useState(true);
    const { width } = WindowSizeProvider();

    const toggleRightView = () => {
        setIsBackDropHidden(false);
        setRightViewClass('translate-x-0'); // Tailwind class for no translate
    };

    const hideRightView = () => {
        setRightViewClass('translate-x-full'); // Hide sidebar
        setIsBackDropHidden(true);
    };

    return (
        <div className='flex-1 overflow-auto flex w-full h-full bg-[#f9f9f9] p-0 md:p-0 relative'>
            {/* Backdrop */}
            {!isBackdropHidden && (
                <div
                    onClick={hideRightView}
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                    className='absolute w-full cursor-pointer h-screen bg-black z-10 transition-opacity duration-300'
                ></div>
            )}
            {/* Left Side */}
            <LeftView toggleRightView={toggleRightView} />
            <div className={`md:p-2 ${width <= 768 ? `fixed right-0 h-screen bg-white ${rightViewClass} z-20 transition-transform duration-300` : 'flex'}`}>
                <RightView />
            </div>
        </div>
    );
}

export default MainPos