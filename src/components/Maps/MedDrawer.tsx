'use client';

import { Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

type Coords = {
    lat: number;
    lng: number;
};
export const MedDrawer = () => {
    const [coords, setCoords] = useState<Coords | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Browser is not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (geoError) => {
                switch (geoError.code) {
                    case geoError.PERMISSION_DENIED:
                        setError(geoError.message || 'User is blocked the geo');
                        break;
                    case geoError.TIMEOUT:
                        setError(geoError.message || 'Waiting for too long');
                        break;
                    case geoError.POSITION_UNAVAILABLE:
                    default:
                        setError(geoError.message || 'Cant access the geo');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    }, []);

    const iframeSrc = useMemo(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;

        if (!apiKey || !coords) return '';

        const params = new URLSearchParams({
            key: apiKey,
            q: 'pharmacy',
            center: `${coords.lat},${coords.lng}`,
            zoom: '14',
        });

        return `https://www.google.com/maps/embed/v1/search?${params.toString()}`;
    }, [coords]);

    if (error) {
        return <Typography>{error}</Typography>;
    }

    if (!coords) {
        return <Typography>Определяем местоположение...</Typography>;
    }

    return (
        <iframe
            title="Аптеки рядом"
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
        />
    );
};
