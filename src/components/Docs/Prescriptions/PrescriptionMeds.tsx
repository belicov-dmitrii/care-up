'use client';

import { Box, Container, Drawer, IconButton, Paper, Typography } from '@mui/material';
import { type FC, memo, useCallback, useEffect, useState } from 'react';
import { RandomPrescriptionIcon } from './RandomPrescriptionIcon';
import { PALETTE } from '@/utils/theme/colors';
import { type Med, type PrescriptionItem } from '@/types';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getRandomInt } from '@/utils/getRandomInt';
import { AddMedicationManual } from '@/components/AddMedication/AddMedicationManual';
import { noop } from '@/utils/noop';
import { CreateSchedule } from '@/components/CreateSchedule/CreateSchedule';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { useRouter } from 'next/navigation';
import { DocsStatus } from '../DocsStatus';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ColumnBoxStyles } from '@/utils/consts';

interface IProps {
    prescriptionId: string;
    meds: Array<PrescriptionItem>;
}

export const PrescriptionMeds: FC<IProps> = memo(({ prescriptionId, meds }) => {
    const [selectedPrescriptionItem, setSelectedPrescriptionItem] =
        useState<PrescriptionItem | null>(null);
    const [drawerIsOpen, setDrawerOpen] = useState(false);

    const [medIcons, setMedIcons] = useState<Array<Record<'icon' | 'colors', number>>>();
    const router = useRouter();

    useEffect(() => {
        setMedIcons(
            [...new Array(meds.length)].reduce((acc, _, index) => {
                let randomInt = { icon: getRandomInt(0, 2), colors: getRandomInt(0, 2) };

                while (
                    randomInt.icon === acc[index - 1]?.icon ||
                    randomInt.colors === acc[index - 1]?.colors
                ) {
                    randomInt = { icon: getRandomInt(0, 2), colors: getRandomInt(0, 2) };
                }

                return [...acc, randomInt];
            }, [])
        );
    }, [meds.length]);

    const onDrawerClose = useCallback(() => {
        setDrawerOpen(false);

        setTimeout(() => {
            router.refresh();
        }, 400);
    }, [router]);

    const onMedSubmit = async ({ id }: Partial<Med>) => {
        if (!id) {
            return;
        }

        await NetworkRequest(
            '/prescriptions/add-med',
            { medId: id, prescriptionId, itemId: selectedPrescriptionItem?.id },
            { method: 'POST' }
        );

        setSelectedPrescriptionItem((prev) => {
            return {
                ...(prev as PrescriptionItem),
                medId: id,
            };
        });
    };

    const onCreateSchedule = async (scheduleId: string) => {
        if (!scheduleId) {
            return;
        }

        await NetworkRequest(
            '/prescriptions/add-schedule',
            { scheduleId, prescriptionId, itemId: selectedPrescriptionItem?.id },
            { method: 'POST' }
        );

        onDrawerClose();
    };

    return (
        <Box sx={ColumnBoxStyles}>
            {meds.map((item, index) => {
                const onClick = () => {
                    setSelectedPrescriptionItem(item);
                    setDrawerOpen(true);
                };

                const itemStatus = item.medId ? 'in_progress' : 'recognized';

                return (
                    <Paper
                        key={item.id}
                        onClick={onClick}
                        sx={{
                            p: 3,
                            borderRadius: '14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            <RandomPrescriptionIcon
                                color={medIcons?.[index].colors}
                                icon={medIcons?.[index].icon}
                            />
                            <Box>
                                <Typography mb={1}>{item.name}</Typography>
                                <DocsStatus status={itemStatus} />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                                p: 1,
                                borderRadius: '20px',
                            }}
                        >
                            <ArrowForwardIcon color="inherit" />
                        </Box>
                    </Paper>
                );
            })}
            {selectedPrescriptionItem?.medId ? (
                <CreateSchedule
                    open={drawerIsOpen}
                    onClose={onDrawerClose}
                    submitCallback={onCreateSchedule}
                    scheduleData={selectedPrescriptionItem.scheduleData}
                    id={selectedPrescriptionItem.medId}
                    noMedChoose
                />
            ) : (
                <Drawer
                    anchor="right"
                    open={drawerIsOpen}
                    onClose={onDrawerClose}
                    slotProps={{
                        paper: {
                            style: {
                                width: '100%',
                            },
                        },
                    }}
                >
                    <Container sx={{ p: 3, position: 'relative' }}>
                        <Box mb={3} sx={{ position: 'absolute', left: '30px', top: '23px' }}>
                            <IconButton onClick={onDrawerClose} sx={{ padding: 0, color: '#000' }}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Box>
                        <AddMedicationManual
                            medData={selectedPrescriptionItem?.medData ?? {}}
                            setStep={noop}
                            changeMedData={onMedSubmit}
                            closeMedicationDrawer={noop}
                        />
                    </Container>
                </Drawer>
            )}
        </Box>
    );
});
