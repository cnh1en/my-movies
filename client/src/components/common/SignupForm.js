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

const SignupForm = ({ switchAuthState }) => {
	const dispatch = useDispatch();

	const [isRegisterReq, setIsRegisterReq] = useState(false);

	const [errorMsg, setErrorMsg] = useState('');

	const signUpForm = useFormik({
		initialValues: {
			password: '',
			username: '',
			displayName: '',
			confirmPassword: '',
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

			displayName: yup
				.string()
				.min(8, 'displayName minimum 8 characters')
				.required('displayName is required'),

			confirmPassword: yup
				.string()
				.required('')
				.required('Confirm Password is required')
				.oneOf([yup.ref('password'), null], 'Passwords must match'),
		}),
		onSubmit: async (values) => {
			setErrorMsg(undefined);
			setIsRegisterReq(true);
			const { response, error } = await userApi.signup(values);
			setIsRegisterReq(false);

			if (response) {
				signUpForm.resetForm();
				dispatch(setUser(response));
				dispatch(setAuthModalOpen(false));
				toast.success('Sign in success');
			}

			if (error) {
				setErrorMsg(error.message);
			}
		},
	});

	return (
		<Box component="form" onSubmit={signUpForm.handleSubmit}>
			<Stack spacing={3} flexDirection="column">
				<TextField
					type="text"
					placeholder="Display name"
					name="displayName"
					fullWidth
					value={signUpForm.values.displayName}
					onChange={signUpForm.handleChange}
					color="success"
					error={
						signUpForm.touched.displayName &&
						signUpForm.errors.displayName !== undefined
					}
					helperText={
						signUpForm.touched.displayName && signUpForm.errors.displayName
					}
				/>
				<TextField
					type="text"
					placeholder="Username"
					name="username"
					fullWidth
					value={signUpForm.values.username}
					onChange={signUpForm.handleChange}
					color="success"
					error={
						signUpForm.touched.username &&
						signUpForm.errors.username !== undefined
					}
					helperText={signUpForm.touched.username && signUpForm.errors.username}
				/>

				<TextField
					type="password"
					placeholder="Password"
					name="password"
					fullWidth
					value={signUpForm.values.password}
					onChange={signUpForm.handleChange}
					color="success"
					error={
						signUpForm.touched.password &&
						signUpForm.errors.password !== undefined
					}
					helperText={signUpForm.touched.password && signUpForm.errors.password}
				/>
				<TextField
					type="confirmPassword"
					placeholder="confirmPassword"
					name="confirmPassword"
					fullWidth
					value={signUpForm.values.confirmPassword}
					onChange={signUpForm.handleChange}
					color="success"
					error={
						signUpForm.touched.confirmPassword &&
						signUpForm.errors.confirmPassword !== undefined
					}
					helperText={
						signUpForm.touched.confirmPassword &&
						signUpForm.errors.confirmPassword
					}
				/>

				<LoadingButton
					type="submit"
					fullWidth
					size="large"
					variant="contained"
					sx={{
						mt: 4,
					}}
					loading={isRegisterReq}
				>
					submit
				</LoadingButton>

				<Button
					fullWidth
					sx={{ mt: 1 }}
					onClick={switchAuthState}
					variant="outlined"
				>
					sign in
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

export default SignupForm;
