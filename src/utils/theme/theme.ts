import { createTheme, alpha } from '@mui/material/styles';
import {
    BRAND_TEAL,
    BRAND_TEAL_DARK,
    BRAND_WHITE,
    BG_PAGE,
    BG_SURFACE,
    TEXT_PRIMARY,
    TEXT_SECONDARY,
    NEUTRAL_SLATE_400,
    SHADOW_BASE_RGB,
} from './colors';
import { type Shadows } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',

        primary: {
            main: BRAND_TEAL,
            dark: BRAND_TEAL_DARK,
            contrastText: BRAND_WHITE,
        },

        secondary: {
            main: NEUTRAL_SLATE_400,
        },

        background: {
            default: BG_PAGE,
            paper: BG_SURFACE,
        },

        text: {
            primary: TEXT_PRIMARY,
            secondary: TEXT_SECONDARY,
        },

        divider: alpha(TEXT_PRIMARY, 0.08),

        action: {
            hover: alpha(BRAND_TEAL, 0.08),
            selected: alpha(BRAND_TEAL, 0.12),
            focus: alpha(BRAND_TEAL, 0.18),
        },
    },

    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: 36, fontWeight: 700, letterSpacing: -0.6 },
        h2: { fontSize: 30, fontWeight: 700, letterSpacing: -0.4 },
        h3: { fontSize: 24, fontWeight: 700 },
        h4: { fontSize: 20, fontWeight: 700 },
        body1: { fontSize: 16, lineHeight: 1.45 },
        body2: { fontSize: 14, lineHeight: 1.45 },
        button: { textTransform: 'none', fontWeight: 700, fontSize: 16 },
    },

    shape: { borderRadius: 4 },

    shadows: [
        'none',
        `0px 1px 2px rgba(${SHADOW_BASE_RGB}, 0.06),
     0px 6px 18px rgba(${SHADOW_BASE_RGB}, 0.06)`,

        `0px 2px 6px rgba(${SHADOW_BASE_RGB}, 0.08),
     0px 10px 24px rgba(${SHADOW_BASE_RGB}, 0.08)`,

        ...Array(22).fill('none'),
    ] as Shadows,

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: BG_PAGE,
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
            0px 1px 2px rgba(${SHADOW_BASE_RGB}, 0.06),
            0px 10px 24px rgba(${SHADOW_BASE_RGB}, 0.06)
          `,
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    boxShadow: `
            0px 1px 2px rgba(${SHADOW_BASE_RGB}, 0.06),
            0px 10px 24px rgba(${SHADOW_BASE_RGB}, 0.06)
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
                    borderRadius: 999,
                    padding: '14px 18px',
                    minHeight: 52,
                },

                containedPrimary: {
                    backgroundColor: BRAND_TEAL,
                    '&:hover': {
                        backgroundColor: BRAND_TEAL_DARK,
                    },
                },

                outlined: {
                    borderWidth: 1,
                    borderColor: alpha(TEXT_PRIMARY, 0.12),
                    color: TEXT_PRIMARY,
                    '&:hover': {
                        borderColor: alpha(BRAND_TEAL, 0.25),
                        backgroundColor: alpha(BRAND_TEAL, 0.06),
                    },
                },

                text: {
                    color: BRAND_TEAL,
                },
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: { borderRadius: 14 },
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
                    backgroundColor: alpha(TEXT_PRIMARY, 0.04),
                    border: `1px solid ${alpha(TEXT_PRIMARY, 0.06)}`,
                    transition:
                        'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',

                    '&:hover': {
                        backgroundColor: alpha(TEXT_PRIMARY, 0.05),
                        borderColor: alpha(TEXT_PRIMARY, 0.1),
                    },

                    '&.Mui-focused': {
                        backgroundColor: BG_SURFACE,
                        borderColor: alpha(BRAND_TEAL, 0.55),
                        boxShadow: `0 0 0 4px ${alpha(BRAND_TEAL, 0.12)}`,
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
                    color: alpha(TEXT_PRIMARY, 0.55),
                    '&.Mui-focused': {
                        color: BRAND_TEAL,
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    height: 32,
                    fontWeight: 600,
                    backgroundColor: alpha(BRAND_TEAL, 0.1),
                    color: BRAND_TEAL_DARK,
                },
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: alpha(TEXT_PRIMARY, 0.08),
                },
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: { borderRadius: 16 },
            },
        },
    },
});
