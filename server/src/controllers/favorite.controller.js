import responseHandler from '../handlers/response.handler.js';
import favoriteModel from '../models/favorite.model.js';

const addFavorite = async (req, res) => {
	try {
		const isFavorite = await favoriteModel.findOne({
			user: req.user.id,
			mediaId: req.body.mediaId,
		});

		if (isFavorite) {
			responseHandler.ok(res, isFavorite);
		}

		const favorite = await favoriteModel({
			...req.body,
			user: req.user.id,
		});

		responseHandler.created(res, favorite);
	} catch {
		responseHandler.error(res);
	}
};

const removeFavorite = async (req, res) => {
	try {
		const { favoriteId } = req.params;

		const favorite = await favoriteModel.findOne({
			_id: favoriteId,
			user: req.user.id,
		});

		if (!favorite) {
			responseHandler.notfound(res);
		}

		await favorite.remove();

		responseHandler.ok(res, {});
	} catch {
		responseHandler.error(res);
	}
};

const getFavoritesOfUser = async (req, res) => {
	try {
		const favorites = await favoriteModel
			.find({
				user: req.user.id,
			})
			.sort('-createdAt');

		responseHandler.ok(res, favorites);
	} catch {
		responseHandler.error(res);
	}
};

export default {
	addFavorite,
	removeFavorite,
	getFavoritesOfUser,
};
