import React, { cloneElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Stack,
	Toolbar,
	Typography,
	useScrollTrigger,
} from '@mui/material';
import { Link } from 'react-router-dom';
import menuConfigs from '../../configs/menu.configs';
import { setAuthModalOpen } from '../../redux/features/authModalSlice';
import { setThemeMode } from '../../redux/features/themeMode';
import { themeModes } from '../../configs/theme.configs';
import AppLogo from './AppLogo';
import Menu from '@mui/icons-material/Menu';
import UserMenu from './UserMenu';
import Sidebar from './Sidebar';

const ScrollAppBar = ({ window, children }) => {
	const { themeMode } = useSelector((state) => state.themeMode);

	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 50,
		target: window ? window() : undefined,
	});

	return cloneElement(children, {
		sx: {
			color: trigger
				? 'text.primary'
				: themeMode === themeModes.dark
				? 'primary.contrastText'
				: 'text.primary',
			backgroundColor: trigger
				? 'background.paper'
				: themeMode === themeModes.dark
				? 'transparent'
				: 'background.paper',
		},
	});
};

const Topbar = () => {
	const { user } = useSelector((state) => state.user);
	const { appState } = useSelector((state) => state.appState);
	const { themeMode } = useSelector((state) => state.themeMode);

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const dispatch = useDispatch();

	const onSwitchTheme = () => {
		const theme =
			themeMode === themeModes.dark ? themeModes.light : themeModes.dark;

		dispatch(setThemeMode(theme));
	};

	const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

	return (
		<>
			<Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
			<ScrollAppBar>
				<AppBar elevation={0} sx={{ zIndex: 9999 }}>
					<Toolbar
						sx={{ alignItems: 'center', justifyContent: 'space-between' }}
					>
						{/* MAIN MENU */}
						<Stack direction="row" spacing={1} alignItems="center" width="100%">
							<IconButton
								color="inherit"
								sx={{
									mr: 2,
									display: {
										md: 'none',
									},
								}}
								onClick={toggleSidebar}
							>
								<MenuIcon />
							</IconButton>

							<Box
								sx={{
									display: {
										xs: 'inline-block',
										md: 'none',
									},
								}}
							>
								<AppLogo />
							</Box>

							<Box
								flexGrow={1}
								alignItems="center"
								display={{
									xs: 'none',
									md: 'flex',
								}}
							>
								<Box
									sx={{
										marginRight: '30px',
									}}
								>
									<AppLogo />
								</Box>

								{menuConfigs.main.map((item, index) => (
									<Button
										key={index}
										sx={{
											color:
												appState === item.state
													? 'primary.contrastText'
													: 'inherit',
											mr: 2,
										}}
										component={Link}
										to={item.path}
										variant={appState === item.state ? 'contained' : 'text'}
									>
										{item.display}
									</Button>
								))}

								<IconButton sx={{ color: 'inherit' }} onClick={onSwitchTheme}>
									{themeMode === themeModes.dark ? (
										<DarkModeOutlinedIcon />
									) : (
										<WbSunnyOutlinedIcon />
									)}
								</IconButton>
							</Box>
						</Stack>
						{/* MAIN MENU */}
						{/* USER MENU */}
						<Stack spacing={3} direction="row" alignItems="center">
							{!user ? (
								<Button
									variant="contained"
									onClick={() => dispatch(setAuthModalOpen(true))}
								>
									login
								</Button>
							) : (
								<UserMenu />
							)}
						</Stack>
						{/* USER MENU */}
					</Toolbar>
				</AppBar>
			</ScrollAppBar>
		</>
	);
};

export default Topbar;
