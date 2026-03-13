'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { AddButton } from '../AddButton';
import { useI18n } from '../I18nProvider';
import { AddMedication } from '../AddMedication/AddMedication';

const menuVariants = {
    hidden: {
        opacity: 0,
        y: 16,
        scale: 0.95,
        transition: {
            duration: 0.18,
        },
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.22,
            when: 'beforeChildren',
            staggerChildren: 0.06,
        },
    },
    exit: {
        opacity: 0,
        y: 12,
        scale: 0.97,
        transition: {
            duration: 0.16,
            when: 'afterChildren',
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 10,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.18,
        },
    },
    exit: {
        opacity: 0,
        y: 8,
        transition: {
            duration: 0.12,
        },
    },
};

const menuItemStyle: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    padding: '12px 14px',
    borderRadius: 12,
    fontSize: 15,
    cursor: 'pointer',
};

export default function PharmacyMenu() {
    const [menuIsOpen, setMenuOpen] = useState(false);

    const [addMedicationIsMounted, setAddMedicationIsMounted] = useState(false);
    const [addMedicationIsOpen, setAddMedicationIsOpen] = useState(false);

    // const [addScheduleIsMouted, setAddScheduleIsMounted] = useState(false);
    // const [addScheduleIsOpen, setAddScheduleIsOpen] = useState(false);

    const { t } = useI18n();

    useEffect(() => {
        if (addMedicationIsMounted) {
            setTimeout(() => {
                setAddMedicationIsOpen(true);
            }, 400);
        }
    }, [addMedicationIsMounted]);

    const toggleAddMedicationDrawer = useCallback(() => {
        setAddMedicationIsOpen(false);

        setTimeout(() => {
            setAddMedicationIsMounted(false);
        }, 400);
    }, []);

    return (
        <Box
            style={{
                position: 'fixed',
                right: 10,
                bottom: 100,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        >
            <Box
                style={{
                    position: 'relative',
                    pointerEvents: 'auto',
                }}
            >
                <AnimatePresence>
                    {menuIsOpen && (
                        <motion.div
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{
                                position: 'absolute',
                                bottom: 64,
                                right: 0,
                                transform: 'translateX(-50%)',
                                width: 220,
                                padding: 8,
                                borderRadius: 16,
                                background: '#fff',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
                                border: '1px solid rgba(0,0,0,0.08)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6,
                            }}
                        >
                            <motion.button
                                variants={itemVariants}
                                style={menuItemStyle}
                                onClick={() => {
                                    setMenuOpen(false);
                                    setAddMedicationIsMounted(true);
                                }}
                            >
                                <Typography>{t('Add Medication')}</Typography>
                            </motion.button>

                            <motion.button
                                variants={itemVariants}
                                style={menuItemStyle}
                                onClick={() => {
                                    console.log('Second item');
                                    setMenuOpen(false);
                                }}
                            >
                                <Typography>{t('Add Schedule')}</Typography>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AddButton onClick={() => setMenuOpen((prev) => !prev)} />
            </Box>
            {addMedicationIsMounted && (
                <AddMedication open={addMedicationIsOpen} onClose={toggleAddMedicationDrawer} />
            )}
        </Box>
    );
}
