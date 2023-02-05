import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageWrapper from '../components/common/PageWrapper';
import MainLayout from '../components/layout/MainLayout';
import routes from './routes';

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				{routes.map((route, index) => (
					<Route
						key={index}
						index={route.index}
						path={route.path}
						element={
							route.state ? (
								<PageWrapper state={route.state}>{route.element}</PageWrapper>
							) : (
								route.element
							)
						}
					/>
				))}
			</Route>
		</Routes>
	);
};

export default AppRoutes;
