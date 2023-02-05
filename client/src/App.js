import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import themeConfig from './configs/theme.configs';
import AppRoutes from './routes';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	const { themeMode } = useSelector((state) => state.themeMode);

	return (
		<ThemeProvider theme={themeConfig.custom({ mode: themeMode })}>
			<ToastContainer
				position="bottom-left"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				pauseOnFocusLoss
				pauseOnHover
				theme={themeMode}
			/>

			{/* MUI RESET CSS */}
			<CssBaseline />

			{/* APP ROUTES */}
			<AppRoutes />
			{/* APP ROUTES */}
		</ThemeProvider>
	);
};

export default App;
