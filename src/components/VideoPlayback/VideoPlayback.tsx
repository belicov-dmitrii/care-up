'use client';

import { memo, useEffect, useRef } from 'react';

export const VideoPlayback = memo(() => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = true;
        video.defaultMuted = true;

        const tryPlay = async () => {
            try {
                await video.play();
            } catch (err) {
                console.error('Safari blocked autoplay:', err);
            }
        };

        if (video.readyState >= 2) {
            void tryPlay();
        } else {
            const onLoaded = () => void tryPlay();
            video.addEventListener('loadeddata', onLoaded, { once: true });
            return () => video.removeEventListener('loadeddata', onLoaded);
        }
    }, []);
    return (
        <>
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                webkit-playsinline="true"
                style={{
                    position: 'absolute',
                    top: '0',
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
            >
                <source src="image_login-gif-safari.mp4" type="video/mp4" />
            </video>
        </>
    );
});
