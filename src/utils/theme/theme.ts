import { createTheme, alpha } from '@mui/material/styles';
import { PALETTE } from './colors';
import { type Shadows } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',

        primary: {
            main: PALETTE.BRAND_TEAL,
            dark: PALETTE.BRAND_TEAL_DARK,
            contrastText: PALETTE.BRAND_WHITE,
        },

        secondary: {
            main: PALETTE.NEUTRAL_SLATE_400,
        },

        background: {
            default: PALETTE.BG_PAGE,
            paper: PALETTE.BG_SURFACE,
        },

        text: {
            primary: PALETTE.TEXT_PRIMARY,
            secondary: PALETTE.TEXT_SECONDARY,
        },

        divider: alpha(PALETTE.TEXT_PRIMARY, 0.08),

        action: {
            hover: alpha(PALETTE.BRAND_TEAL, 0.08),
            selected: alpha(PALETTE.BRAND_TEAL, 0.12),
            focus: alpha(PALETTE.BRAND_TEAL, 0.18),
        },
    },

    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: 28, fontWeight: 600, letterSpacing: -0.6 },
        h2: { fontSize: 24, fontWeight: 600, letterSpacing: -0.4 },
        h3: { fontSize: 22, fontWeight: 600 },
        h4: { fontSize: 20, fontWeight: 700 },
        body1: { fontSize: 16, lineHeight: 1.45 },
        body2: { fontSize: 14, lineHeight: 1.45 },
        button: { textTransform: 'none', fontWeight: 700, fontSize: 16 },
    },

    shape: { borderRadius: 4 },

    shadows: [
        'none',
        `0px 1px 2px rgba(${PALETTE.SHADOW_BASE_RGB}, 0.06),
     0px 6px 18px rgba(${PALETTE.SHADOW_BASE_RGB}, 0.06)`,

        `0px 2px 6px rgba(${PALETTE.SHADOW_BASE_RGB}, 0.08),
     0px 10px 24px rgba(${PALETTE.SHADOW_BASE_RGB}, 0.08)`,

        ...Array(22).fill('none'),
    ] as Shadows,

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: PALETTE.BG_PAGE,
                },
            },
        },

        MuiContainer: {
            defaultProps: {
                maxWidth: 'sm',
            },
        },

        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    backgroundImage: 'none',
                    boxShadow: `
            0px 1px 2px rgba(${PALETTE.SHADOW_BASE_RGB}, 0.06),
            0px 10px 24px rgba(${PALETTE.SHADOW_BASE_RGB}, 0.06)
          `,
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    boxShadow: `
            0px 1px 2px rgba(${PALETTE.SHADOW_BASE_RGB}, 0.06),
            0px 10px 24px rgba(${PALETTE.SHADOW_BASE_RGB}, 0.06)
          `,
                },
            },
        },

        MuiButton: {
            defaultProps: {
                disableElevation: true,
                disableRipple: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    fontWeight: 500,
                    fontSize: 16,
                },

                sizeSmall: {
                    fontSize: 14,
                    minHeight: 36,
                },
                sizeMedium: {
                    minHeight: 48,
                },
                sizeLarge: {
                    padding: '14px 18px',
                    minHeight: 56,
                },

                containedPrimary: {
                    backgroundColor: PALETTE.BRAND_TEAL,
                    '&:hover': {
                        backgroundColor: PALETTE.BRAND_TEAL_DARK,
                    },
                },

                outlined: {
                    borderWidth: 1,
                    borderColor: alpha(PALETTE.TEXT_PRIMARY, 0.12),
                    color: PALETTE.TEXT_PRIMARY,
                    '&:hover': {
                        borderColor: alpha(PALETTE.BRAND_TEAL, 0.25),
                        backgroundColor: alpha(PALETTE.BRAND_TEAL, 0.06),
                    },
                },

                text: {
                    color: PALETTE.BRAND_TEAL,
                },
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: { borderRadius: '20px' },
            },
        },

        MuiTextField: {
            defaultProps: {
                variant: 'filled',
                fullWidth: true,
            },
        },

        MuiFilledInput: {
            defaultProps: {
                disableUnderline: true,
            },
            styleOverrides: {
                root: {
                    alignItems: 'center',
                    borderRadius: 16,
                    backgroundColor: alpha(PALETTE.TEXT_PRIMARY, 0.04),
                    border: `1px solid ${alpha(PALETTE.TEXT_PRIMARY, 0.06)}`,
                    transition:
                        'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',

                    '&:hover': {
                        backgroundColor: alpha(PALETTE.TEXT_PRIMARY, 0.05),
                        borderColor: alpha(PALETTE.TEXT_PRIMARY, 0.1),
                    },

                    '&.Mui-focused': {
                        backgroundColor: PALETTE.BG_SURFACE,
                        borderColor: alpha(PALETTE.BRAND_TEAL, 0.55),
                        boxShadow: `0 0 0 4px ${alpha(PALETTE.BRAND_TEAL, 0.12)}`,
                    },
                },

                input: {
                    paddingTop: 16,
                    paddingBottom: 16,
                },
            },
        },

        MuiInputAdornment: {
            styleOverrides: {
                positionStart: {
                    marginTop: '0 !important',
                },
            },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: alpha(PALETTE.TEXT_PRIMARY, 0.55),
                    '&.Mui-focused': {
                        color: PALETTE.BRAND_TEAL,
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    fontWeight: 500,
                    backgroundColor: alpha(PALETTE.BRAND_TEAL, 0.1),
                    color: PALETTE.BRAND_TEAL_DARK,
                },
                sizeSmall: {
                    fontSize: 12,
                    maxHeight: 26,
                },
                sizeMedium: {
                    fontSize: 15,
                    minHeight: 38,
                    padding: 10,
                },
                icon: {
                    color: 'inherit',
                    fontSize: 'inherit',
                },
                label: {
                    padding: '0 10px',
                },
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: alpha(PALETTE.TEXT_PRIMARY, 0.08),
                },
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: { borderRadius: 16 },
            },
        },

        MuiIcon: {
            styleOverrides: {
                root: {
                    color: 'inherit',
                },
            },
        },
    },
});
