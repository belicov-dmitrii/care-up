'use client';

import { Box, Chip, TextField } from '@mui/material';
import { type KeyboardEvent, useState, type FC } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

interface IFormTagsProps {
    value: Array<string>;
    setValue: (newValue: Array<string>) => void;
    label: string;
    limit: number;
}

export const FormTags: FC<IFormTagsProps> = ({ value, limit, label, setValue }) => {
    const [inputValue, setInputValue] = useState('');

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const isEnter = e.key === 'Enter';

        if (isEnter) {
            e.preventDefault();
        }

        if (!isEnter || !inputValue?.trim()) {
            return;
        }

        setValue([...new Set([...value, inputValue.replaceAll('\n', '')])]);

        setInputValue('');
        return;
    };

    const handleDelete = (index: number) => {
        const newState = [...value];

        newState.splice(index, 1);

        setValue(newState);
    };

    return (
        <Box width="100%" sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {value.map((item, index) => {
                    return (
                        <Chip
                            key={item}
                            label={item}
                            sx={{ wordBreak: 'break-word' }}
                            onDelete={() => handleDelete(index)}
                            deleteIcon={<DeleteIcon color="error" />}
                        />
                    );
                })}
            </Box>
            <TextField
                label={label}
                disabled={limit === value.length}
                value={inputValue}
                onKeyDown={onKeyDown}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </Box>
    );
};
