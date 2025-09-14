import React, { useRef, useEffect, useState } from "react";

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
}) => {
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress more accurately
        const viewportCenter = windowHeight / 2;
        const elementCenter = elementTop + elementHeight / 2;
        const distanceFromCenter = Math.abs(viewportCenter - elementCenter);
        const maxDistance = windowHeight + elementHeight / 2;
        
        // Smooth scroll progress calculation
        const scrollProgress = Math.max(0, Math.min(1, 
          1 - (distanceFromCenter / maxDistance)
        ));
        
        setScrollY(scrollProgress);
      }
    };

    // Initial call
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      checkMobile();
      handleScroll();
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Improved animation calculations
  const scaleX = 1 + (scrollY * 0.3);
  const scaleY = 0.8 + (scrollY * 0.4);
  const rotate = scrollY > 0.1 ? Math.max(-15, -15 + (scrollY - 0.1) * 100) : -15;
  const textOpacity = Math.max(0, 1 - (scrollY * 2));
  const translateY = scrollY * 50;

  return (
    <div
      ref={ref}
      className="min-h-[120vh] flex flex-col items-center py-16 md:py-24 justify-center shrink-0 [perspective:1000px] transform-gpu"
      style={{
        transform: `scale(${isMobile ? 0.6 : 1})`,
      }}
    >
      <h2
        style={{
          opacity: textOpacity,
          transform: `translateY(${translateY}px)`,
        }}
        className="dark:text-white text-neutral-800 text-2xl md:text-4xl font-bold mb-12 md:mb-16 text-center transition-all duration-500 ease-out"
      >
        {title || (
          <span>
            This Macbook is built with Tailwindcss. <br />
            No kidding.
          </span>
        )}
      </h2>
      
      {/* MacBook Container */}
      <div className="relative">
        {/* Lid */}
        <Lid
          src={src}
          scaleX={scaleX}
          scaleY={scaleY}
          rotate={rotate}
          translate={scrollY * 200}
        />
        
        {/* Base area */}
        <div 
          className="h-[20rem] w-[28rem] md:h-[22rem] md:w-[32rem] bg-gradient-to-b from-gray-300 to-gray-400 dark:from-[#2a2a2a] dark:to-[#1a1a1a] rounded-2xl overflow-hidden relative shadow-2xl"
          style={{
            transform: `translateY(${scrollY * 100}px)`,
          }}
        >
          {/* above keyboard bar */}
          <div className="h-8 md:h-10 w-full relative">
            <div className="absolute inset-x-0 mx-auto w-64 md:w-80 h-3 md:h-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full shadow-inner" />
          </div>
          
          <div className="flex relative h-full">
            <div className="mx-auto w-[10%] overflow-hidden h-full">
              <SpeakerGrid />
            </div>
            <div className="mx-auto w-[80%] h-full">
              <Keypad />
            </div>
            <div className="mx-auto w-[10%] overflow-hidden h-full">
              <SpeakerGrid />
            </div>
          </div>
          
          <Trackpad />
          <div className="h-2 w-16 md:w-20 mx-auto inset-x-0 absolute bottom-0 bg-gradient-to-t from-[#272729] to-[#050505] rounded-tr-3xl rounded-tl-3xl" />
          
          {showGradient && (
            <div className="h-32 md:h-40 w-full absolute bottom-0 inset-x-0 bg-gradient-to-t dark:from-black from-white via-white dark:via-black to-transparent z-50"></div>
          )}
          
          {badge && <div className="absolute top-4 left-4">{badge}</div>}
        </div>
      </div>
    </div>
  );
};

export const Lid = ({ scaleX, scaleY, rotate, translate, src }) => {
  return (
    <div className="relative [perspective:1000px] mb-4">
      {/* Static base for the lid */}
      <div
        style={{
          transform: "perspective(1000px) rotateX(-20deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="h-[10rem] md:h-[12rem] w-[28rem] md:w-[32rem] bg-[#010101] rounded-2xl p-2 relative"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #171717 inset",
          }}
          className="absolute inset-0 bg-[#010101] rounded-lg flex items-center justify-center"
        >
          <span className="text-white">
            {src ? (
              <img
                src={src}
                alt="macbook"
                className="object-cover object-left-top absolute rounded-lg inset-0 h-full w-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg"></div>
            )}
          </span>
        </div>
      </div>
      
      {/* Animated screen */}
      <div
        style={{
          transform: `scaleX(${scaleX}) scaleY(${scaleY}) rotateX(${rotate}deg) translateY(${translate}px)`,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
          transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="h-80 md:h-96 w-[28rem] md:w-[32rem] absolute inset-0 bg-gradient-to-b from-gray-900 to-black rounded-2xl p-2 shadow-2xl border border-gray-700"
      >
        <div className="absolute inset-0 bg-[#272729] rounded-lg" />
        <div className="absolute inset-0 bg-[#050505] rounded-lg">
          {src ? (
            <img
              src={src}
              alt="macbook"
              className="object-cover object-left-top absolute rounded-lg inset-0 h-full w-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg flex flex-col items-center justify-center p-4 md:p-6">
              <div className="text-emerald-400 text-lg md:text-xl font-bold mb-4 md:mb-6">Store Rating Dashboard</div>
              <div className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-xs md:max-w-sm">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg h-10 md:h-14 flex items-center justify-center shadow-lg">
                  <div className="text-white text-xs font-semibold">Analytics</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg h-10 md:h-14 flex items-center justify-center shadow-lg">
                  <div className="text-white text-xs font-semibold">Reviews</div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg h-10 md:h-14 flex items-center justify-center shadow-lg">
                  <div className="text-white text-xs font-semibold">Ratings</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg h-8 md:h-10 col-span-3 flex items-center justify-center shadow-lg">
                  <div className="text-white text-xs font-semibold">Store Performance Overview</div>
                </div>
              </div>
              <div className="mt-3 md:mt-4 flex gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div
      className="w-[40%] mx-auto h-32 rounded-xl my-1"
      style={{
        boxShadow: "0px 0px 1px 1px #00000020 inset",
      }}
    ></div>
  );
};

export const Keypad = () => {
  return (
    <div className="h-full rounded-md bg-gradient-to-b from-gray-800 to-gray-900 mx-1 p-1 shadow-inner">
      <div className="flex gap-[2px] mb-[2px] w-full flex-shrink-0">
        <div className="p-[0.5px] rounded-[1px] bg-gradient-to-b from-gray-600 to-gray-700 w-10 shadow-sm">
          <div className="h-6 w-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-[0.5px] flex items-center justify-center text-gray-200 text-[5px] shadow-inner">
            esc
          </div>
        </div>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="p-[0.5px] rounded-[1px] bg-gradient-to-b from-gray-600 to-gray-700 shadow-sm">
            <div className="h-6 w-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-[0.5px] flex items-center justify-center text-gray-200 text-[5px] shadow-inner">
              F{i + 1}
            </div>
          </div>
        ))}
      </div>
      
      {/* QWERTY Layout */}
      {[
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete'],
        ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
        ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'return'],
        ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift'],
        ['fn', 'ctrl', 'opt', 'cmd', 'space', 'cmd', 'opt', '↑', '↓', '←', '→']
      ].map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[2px] mb-[2px] w-full flex-shrink-0">
          {row.map((key, keyIndex) => (
            <div 
              key={keyIndex} 
              className={`p-[0.5px] rounded-[1px] bg-gradient-to-b from-gray-600 to-gray-700 shadow-sm ${
                key === 'space' ? 'w-[8.2rem]' : 
                key === 'delete' || key === 'return' || key === 'shift' ? 'w-10' :
                key === 'tab' || key === 'caps' ? 'w-8' : 'w-6'
              }`}
            >
              <div className="h-6 w-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-[0.5px] flex items-center justify-center text-gray-200 text-[5px] shadow-inner">
                {key}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const SpeakerGrid = () => {
  return (
    <div
      className="flex px-[0.5px] gap-[1px] mt-2 h-40"
      style={{
        backgroundImage:
          "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
        backgroundSize: "3px 3px",
      }}
    ></div>
  );
};
