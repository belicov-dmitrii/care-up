import { ProfileForm } from '@/components/Profile/ProfileForm';
import { getServerT } from '@/i18n';
import { ColumnBoxStyles } from '@/utils/consts';
import { Avatar, Box, Container, Typography } from '@mui/material';

export default async function ProfilePage() {
    const t = await getServerT();

    return (
        <Container sx={{ ...ColumnBoxStyles, pt: 4 }}>
            <Typography variant="h1">{t('Profile')}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Box
                    sx={{
                        display: 'inline-block',
                        padding: '7px',
                        borderRadius: '100px',
                        background: '#FFF',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Avatar src="image_profile.webp" sx={{ width: '88px', height: '88px' }} />
                </Box>
            </Box>
            <ProfileForm />
        </Container>
    );
}
