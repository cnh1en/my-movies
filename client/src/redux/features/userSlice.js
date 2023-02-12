import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'User',
	initialState: {
		user: null,
		listFavorites: [],
	},
	reducers: {
		setUser: (state, action) => {
			if (action.payload === null) {
				localStorage.removeItem('access_token');
			} else {
				if (action.payload.token) {
					localStorage.setItem('access_token', action.payload.token);
				}
			}

			state.user = action.payload;
		},

		setListFavorites: (state, action) => {
			state.listFavorites = action.payload;
		},

		setRemoveFavorites: (state, action) => {
			const { mediaId } = action.payload;
			state.listFavorites = [...state.listFavorites].filter(
				(e) => e.mediaId.toString() !== mediaId.toString()
			);
		},

		setAddFavorite: (state, action) => {
			state.listFavorites = [...state.listFavorites, ...action.payload];
		},
	},
});

export const { setUser, setListFavorites, setAddFavorite, setRemoveFavorites } =
	userSlice.actions;

export default userSlice.reducer;
