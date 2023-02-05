import React from 'react';
import {
	Drawer,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
	Toolbar,
	Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import uiConfigs from '../../configs/ui.config';
import menuConfigs from '../../configs/menu.configs';
import {
	DarkModeOutlined as DarkModeOutlinedIcon,
	WbSunnyOutlined as WbSunnyOutlinedIcon,
} from '@mui/icons-material';
import { setThemeMode } from '../../redux/features/themeMode';
import { themeModes } from '../../configs/theme.configs';
import AppLogo from './AppLogo';

const Sidebar = ({ open, toggleSidebar }) => {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.user);
	const { appState } = useSelector((state) => state.appState);
	const { themeMode } = useSelector((state) => state.themeMode);

	const sidebarWidth = uiConfigs.style.size.sizebarWith;

	const onSwitchTheme = () => {
		const theme =
			themeMode === themeModes.dark ? themeModes.light : themeModes.dark;

		dispatch(setThemeMode(theme));
	};

	const drawer = (
		<>
			<Toolbar
				sx={{
					py: '20px',
					mx: '25px',
					color: 'text.primary',
					flexDirection: 'column',
				}}
			>
				<Stack width="100%" direction="row" justifyContent="center" mb={4}>
					<AppLogo />
				</Stack>

				<List
					sx={{
						width: '100%',
					}}
				>
					<Typography variant="h6" mb="20px" textTransform="uppercase">
						menu
					</Typography>
					{menuConfigs.main.map((item, index) => (
						<ListItemButton
							component={Link}
							to={item.path}
							key={index}
							sx={{
								borderRadius: '10px',
								my: 1,
								bgcolor: appState === item.state ? 'primary.main' : 'unset',
							}}
							onClick={toggleSidebar}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText
								disableTypography
								primary={
									<Typography textTransform="uppercase">
										{item.display}
									</Typography>
								}
							/>
						</ListItemButton>
					))}

					<Typography
						variant="h6"
						mt="30px"
						mb="20px"
						textTransform="uppercase"
					>
						theme
					</Typography>

					<ListItemButton
						sx={{
							borderRadius: '10px',
							my: 1,
						}}
						onClick={onSwitchTheme}
					>
						<ListItemIcon>
							{themeModes.dark === themeMode ? (
								<DarkModeOutlinedIcon />
							) : (
								<WbSunnyOutlinedIcon />
							)}
						</ListItemIcon>
						<ListItemText
							disableTypography
							primary={
								<Typography textTransform="uppercase">
									{themeModes.dark === themeMode ? 'Dark' : 'Light'}
								</Typography>
							}
						/>
					</ListItemButton>
				</List>
			</Toolbar>
		</>
	);

	return (
		<Drawer
			open={open}
			onClose={() => toggleSidebar(false)}
			sx={{
				'& .MuiDrawer-paper': {
					boxSizing: 'border-box',
					borderRadius: '0px',
					width: sidebarWidth,
				},
			}}
		>
			{drawer}
		</Drawer>
	);
};

export default Sidebar;
