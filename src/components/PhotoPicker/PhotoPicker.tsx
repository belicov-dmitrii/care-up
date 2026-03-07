/* eslint-disable @next/next/no-img-element */
'use client';

import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { type FC, useState } from 'react';
import { useI18n } from '../I18nProvider';

interface IPhotoPicker {
    onUpload: (file: File | null) => void;
}

export const PhotoPicker: FC<IPhotoPicker> = ({ onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { t } = useI18n();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(f ? URL.createObjectURL(f) : null);
    };

    const cancel = () => {
        setFile(null);
        setPreviewUrl(null);
    };

    const submit = () => {
        setIsSubmitting(true);
        onUpload(file);
    };

    return (
        <Box position="relative">
            {isSubmitting && (
                <Box>
                    <Box className="overlay">
                        <CircularProgress />
                    </Box>
                </Box>
            )}
            {previewUrl ? (
                <Box>
                    <Typography mb={1}>{t('Your selected image:')}</Typography>
                    <img src={previewUrl} alt="preview" style={{ maxWidth: 320 }} />
                </Box>
            ) : (
                <label
                    style={{
                        display: 'flex',
                        padding: '50px',
                        border: '1px dashed #000',
                    }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onChange}
                        style={{ display: 'none' }}
                    />

                    <Typography>{t('Take a photo / Choose a file')}</Typography>
                </label>
            )}
            <Box mt={2} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {previewUrl && (
                    <Button
                        onClick={cancel}
                        variant="contained"
                        color="error"
                        sx={{ width: '100px' }}
                    >
                        {t('Cancel')}
                    </Button>
                )}
                <Button
                    onClick={submit}
                    disabled={!file}
                    variant="contained"
                    sx={{ width: '100px' }}
                >
                    {t('Send')}
                </Button>
            </Box>
        </Box>
    );
};
