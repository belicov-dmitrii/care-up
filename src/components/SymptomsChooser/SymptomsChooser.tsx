import { type SymptomsType } from '@/types';
import { SymptomsOptions } from '@/utils/consts';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { Autocomplete, Box, Button, Chip, Paper, TextField, Typography } from '@mui/material';
import { memo, useMemo, useState } from 'react';

export const SymptomsChooser = memo(
    ({
        eventId,
        initialValues,
    }: {
        eventId: string | undefined;
        initialValues: Array<SymptomsType> | undefined;
    }) => {
        const [selectedInitialValues, setSelectedInitialValues] = useState(initialValues);

        const [symptoms, setSymptoms] = useState<Array<SymptomsType>>([]);
        const [isEdit, setIsEdit] = useState(false);

        const initialAutocompleteValues = useMemo(() => {
            if (!selectedInitialValues?.length) {
                return [];
            }

            return SymptomsOptions.filter(({ title }) => selectedInitialValues.includes(title));
        }, [selectedInitialValues]);

        if (!eventId) {
            return null;
        }

        const setValues = (values: Array<(typeof SymptomsOptions)[number]>) => {
            setSymptoms(values.map(({ title }) => title));
        };

        const cancel = () => {
            setSymptoms(initialValues ?? []);
            setIsEdit(false);
        };

        const submit = async () => {
            const { ok } = await NetworkRequest(
                '/intake-event',
                { id: eventId, symptoms },
                { method: 'PATCH' }
            );

            if (!ok) {
                return;
            }

            setIsEdit(false);
            setSelectedInitialValues(symptoms);
        };

        return (
            <Paper sx={{ p: 2, borderRadius: '14px' }}>
                <Typography textAlign="left" fontSize="18px" my={2}>
                    Are you not feeling well? Tell us what happened?
                </Typography>
                <Box>
                    {!isEdit ? (
                        <Box textAlign="left">
                            {initialAutocompleteValues.map((symptom) => {
                                return (
                                    <Chip
                                        key={symptom.title}
                                        label={symptom.title}
                                        sx={{ mr: 2, mb: 1 }}
                                    />
                                );
                            })}
                            <Button
                                onClick={() => setIsEdit(true)}
                                variant="contained"
                                sx={{ width: '100%', borderRadius: 2, mt: 2 }}
                            >
                                Edit
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Autocomplete
                                disablePortal
                                multiple
                                options={SymptomsOptions}
                                renderInput={(params) => <TextField {...params} label="Symptoms" />}
                                groupBy={(option) => option.grouping}
                                getOptionLabel={(option) => option.title}
                                onChange={(_, values) => setValues(values)}
                                defaultValue={initialAutocompleteValues}
                            />
                            <Box mt={2} sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    sx={{ width: '100%', borderRadius: 2 }}
                                    onClick={submit}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={cancel}
                                    sx={{ width: '100%', borderRadius: 2 }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
        );
    }
);
