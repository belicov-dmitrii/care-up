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

        if (!f) {
            setFile(null);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            return;
        }

        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];

        if (!allowed.includes(f.type)) {
            return; // optionally show error
        }

        setFile(f);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(URL.createObjectURL(f));
    };

    const cancel = () => {
        setFile(null);
        setPreviewUrl(null);
    };

    const submit = () => {
        setIsSubmitting(true);
        onUpload(file);
    };

    const isPDF = file?.type === 'application/pdf';

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
                    <Typography mb={1}>
                        {t(`Your selected ${isPDF ? 'document' : 'image'}`)}:
                    </Typography>
                    {isPDF ? (
                        <iframe
                            src={previewUrl}
                            width="100%"
                            height="500"
                            style={{ border: 'none' }}
                        />
                    ) : (
                        <img src={previewUrl} alt="preview" style={{ maxWidth: '100%' }} />
                    )}
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
                        accept="image/*,application/pdf"
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
