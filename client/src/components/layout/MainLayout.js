import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import GlobalLoading from '../common/GlobalLoading';
import Footer from '../common/Footer';
import Topbar from '../common/Topbar';
import AuthModal from '../common/AuthModal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import userApi from '../../api/modules/user.api';
import favoriteApi from '../../api/modules/favorite.api';
import {
	setUser,
	setListFavorites,
	setAddFavorite,
} from '../../redux/features/userSlice';

const MainLayout = () => {
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		const authUser = async () => {
			const { response, error } = await userApi.getInfo();

			if (response) dispatch(setUser(response));
			if (error) dispatch(setUser(null));
		};

		authUser();
	}, [dispatch]);

	useEffect(() => {
		const getFavorites = async () => {
			const { response, error } = await favoriteApi.getList();
			if (response) dispatch(setAddFavorite(response));
			if (error) toast.error(error.message);
		};

		if (user) {
			getFavorites();
		} else {
			dispatch(setListFavorites([]));
		}
	}, [dispatch, user]);

	return (
		<>
			{/* GLOBAL LOADING */}
			<GlobalLoading />
			{/* GLOBAL LOADING */}

			{/* LOGIN MODAL */}
			<AuthModal />
			{/* LOGIN MODAL */}

			<Box display="flex" minHeight="100vh" flexDirection="column">
				{/* HEADER */}
				<Topbar />
				{/* HEADER */}

				{/* MAIN */}
				<Box component="main" flexGrow={1} overflow="hidden" minHeight="100vh">
					<Outlet />
				</Box>
				{/* MAIN */}

				{/* FOOTER */}
				<Footer />
				{/* FOOTER */}
			</Box>
		</>
	);
};

export default MainLayout;
