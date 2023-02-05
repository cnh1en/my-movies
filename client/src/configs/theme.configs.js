import { createTheme } from '@mui/material/styles';
import { colors } from '@mui/material';

export const themeModes = {
	dark: 'dark',
	light: 'light',
};

const themeConfig = {
	custom: ({ mode }) => {
		const customPalette =
			mode === themeModes.dark
				? {
						primary: {
							main: '#ff0000',
							contrastText: '#ffffff',
						},
						secondary: {
							main: '#f44336',
							contrastText: '#ffffff',
						},
						background: {
							default: '#000000',
							paper: '#131313',
						},
				  }
				: {
						primary: {
							main: '#ff0000',
						},
						secondary: {
							main: '#f44336',
						},
						background: {
							default: colors.grey['100'],
						},
				  };

		const customScrollbar =
			mode === themeModes.dark
				? {
						scrollbarColor: '#6b6b6b #2b2b2b',
						'&::-webkit-scrollbar, & *::-webkit-scrollbar': {
							backgroundColor: '#2b2b2b',
						},
						'&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
							borderRadius: 8,
							backgroundColor: '#6b6b6b',
							minHeight: 12,
							border: '3px solid #2b2b2b',
						},
						'&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
							{
								backgroundColor: '#959595',
							},
						'&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
							{
								backgroundColor: '#959595',
							},
						'&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
							{
								backgroundColor: '#959595',
							},
						'&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
							backgroundColor: '#2b2b2b',
						},
				  }
				: {
						scrollbarColor: '#6b6b6b #2b2b2b',
						'&::-webkit-scrollbar, & *::-webkit-scrollbar': {
							backgroundColor: '#f6f6f6',
						},
						'&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
							borderRadius: 8,
							backgroundColor: '#959595',
							minHeight: 12,
							border: '3px solid #F6F6F6',
						},
						'&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
							{
								backgroundColor: '#959595',
							},
						'&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
							{
								backgroundColor: '#959595',
							},
						'&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
							{
								backgroundColor: '#959595',
							},
						'&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
							backgroundColor: '#2b2b2b',
						},
				  };

		return createTheme({
			palette: {
				mode,
				...customPalette,
			},
			components: {
				MuiButton: {
					defaultProps: { disableElevation: true },
				},
				MuiCssBaseline: {
					styleOverrides: {
						body: { ...customScrollbar },
					},
				},
			},
		});
	},
};

export default themeConfig;
