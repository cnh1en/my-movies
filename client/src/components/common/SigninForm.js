import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import userApi from '../../api/modules/user.api';
import { setUser } from '../../redux/features/userSlice';
import { setAuthModalOpen } from '../../redux/features/authModalSlice';
import { useFormik } from 'formik';

const SigninForm = ({ switchAuthState }) => {
	const dispatch = useDispatch();

	const [isLoginReq, setIsLoginReq] = useState(false);

	const [errorMsg, setErrorMsg] = useState('');

	const signInForm = useFormik({
		initialValues: {
			password: '',
			username: '',
		},
		validationSchema: yup.object({
			username: yup
				.string()
				.min(8, 'username minimum 8 characters')
				.required('username is required'),

			password: yup
				.string()
				.min(8, 'password minimum 8 characters')
				.required('password is required'),
		}),
		onSubmit: async (values) => {
			try {
				setErrorMsg(undefined);
				setIsLoginReq(true);
				const { response, error } = await userApi.signin(values);
				setIsLoginReq(false);

				if (response) {
					signInForm.resetForm();
					dispatch(setUser(response));
					dispatch(setAuthModalOpen(false));
					toast.success('Sign in success');
				}

				if (error) {
					setErrorMsg(error.message);
				}
			} catch (error) {
				console.log(error);
				setErrorMsg(error.message);
			}
		},
	});

	return (
		<Box component="form" onSubmit={signInForm.handleSubmit}>
			<Stack spacing={3} flexDirection="column">
				<TextField
					type="text"
					placeholder="Username"
					name="username"
					fullWidth
					value={signInForm.values.username}
					onChange={signInForm.handleChange}
					color="success"
					error={
						signInForm.touched.username &&
						signInForm.errors.username !== undefined
					}
					helperText={signInForm.touched.username && signInForm.errors.username}
				/>

				<TextField
					type="password"
					placeholder="Password"
					name="password"
					fullWidth
					value={signInForm.values.password}
					onChange={signInForm.handleChange}
					color="success"
					error={
						signInForm.touched.password &&
						signInForm.errors.password !== undefined
					}
					helperText={signInForm.touched.password && signInForm.errors.password}
				/>

				<LoadingButton
					type="submit"
					fullWidth
					size="large"
					variant="contained"
					sx={{
						mt: 4,
					}}
					loading={isLoginReq}
				>
					sign in
				</LoadingButton>

				<Button
					fullWidth
					sx={{ mt: 1 }}
					onClick={switchAuthState}
					variant="outlined"
				>
					sign up
				</Button>

				{errorMsg && (
					<Box>
						<Alert variant="outlined" severity="error" title={errorMsg}>
							{errorMsg}
						</Alert>
					</Box>
				)}
			</Stack>
		</Box>
	);
};

export default SigninForm;
