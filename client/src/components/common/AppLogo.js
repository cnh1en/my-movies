import { Typography, useTheme } from '@mui/material';

const AppLogo = () => {
	const theme = useTheme();

	return (
		<Typography fontWeight="700" fontSize="1.7rem">
			Sun<span style={{ color: theme.palette.primary.main }}>Flix</span>
		</Typography>
	);
};

export default AppLogo;
