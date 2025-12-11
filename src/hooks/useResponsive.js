import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive breakpoints
 * Returns boolean flags for different screen sizes
 */
export const useResponsive = () => {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        // Screen size values
        width: screenSize.width,
        height: screenSize.height,

        // Breakpoint flags
        isMobile: screenSize.width < 640,
        isTablet: screenSize.width >= 640 && screenSize.width < 1024,
        isDesktop: screenSize.width >= 1024,

        // Specific breakpoints
        isSmallMobile: screenSize.width < 375,
        isLargeMobile: screenSize.width >= 375 && screenSize.width < 640,
        isSmallTablet: screenSize.width >= 640 && screenSize.width < 768,
        isLargeTablet: screenSize.width >= 768 && screenSize.width < 1024,
        isSmallDesktop: screenSize.width >= 1024 && screenSize.width < 1280,
        isLargeDesktop: screenSize.width >= 1280,

        // Orientation
        isPortrait: screenSize.height > screenSize.width,
        isLandscape: screenSize.width > screenSize.height,

        // Touch device detection
        isTouchDevice: typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    };
};

/**
 * Hook to detect if running in Flutter WebView
 */
export const useFlutterWebView = () => {
    const [isFlutter, setIsFlutter] = useState(false);

    useEffect(() => {
        // Check if Flutter WebView interface is available
        const checkFlutter = () => {
            return typeof window !== 'undefined' &&
                (window.flutter_inappwebview !== undefined ||
                    window.FlutterWebView !== undefined);
        };

        setIsFlutter(checkFlutter());
    }, []);

    return {
        isFlutterWebView: isFlutter,
        sendToFlutter: (eventName, data) => {
            if (window.flutter_inappwebview?.callHandler) {
                window.flutter_inappwebview.callHandler(eventName, data);
            } else if (window.FlutterWebView?.postMessage) {
                window.FlutterWebView.postMessage(JSON.stringify({ event: eventName, data }));
            }
        },
    };
};
