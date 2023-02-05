import responseHandler from '../handlers/response.handler.js';
import tmdbApi from '../tmdb/tmdb.api.js';
import tokenMiddleware from '../middlewares/token.middleware.js';
import userModel from '../models/user.model.js';
import favouriteModel from '../models/favorite.model.js';
import reviewModel from '../models/review.model.js';

const getList = async (req, res) => {
	try {
		const { page = 1 } = req.query;

		const { mediaType, mediaCategory } = req.params;

		const response = await tmdbApi.mediaList({
			mediaType,
			mediaCategory,
			page,
		});

		responseHandler.ok(res, response);
	} catch (error) {
		responseHandler.error(res);
	}
};

const getGenres = async (req, res) => {
	try {
		const { mediaType } = req.params;
		const response = await tmdbApi.mediaGenres({ mediaType });

		responseHandler.ok(res, response);
	} catch (error) {
		responseHandler.error(res);
	}
};

const search = async (req, res) => {
	try {
		const { mediaType } = req.params;
		const { query, page } = req.query;

		const response = await tmdbApi.mediaSearch({
			mediaType: mediaType === 'people' ? 'person' : mediaType,
			page,
			query,
		});

		responseHandler.ok(res, response);
	} catch {
		responseHandler.error(res);
	}
};

const getDetail = async (req, res) => {
	try {
		const { mediaType, mediaId } = req.params;
		const params = { mediaType, mediaId };

		const media = await tmdbApi.mediaDetail(params);

		media.credits = await tmdbApi.mediaCredits(params);
		media.videos = await tmdbApi.mediaVideos(params);
		media.recommend = (await tmdbApi.mediaRecommend(params)).result;
		media.images = await tmdbApi.mediaImages(params);

		const tokenDecoded = tokenMiddleware.tokenDecode(req);

		if (tokenDecoded) {
			const user = await userModel.findById(tokenDecoded.data);

			if (user) {
				const isFavorite = await favouriteModel.findOne({
					user: user.id,
					mediaId,
				});

				media.isFavorite = isFavorite !== null;
			}
		}

		media.reviews = await reviewModel
			.find({ mediaId })
			.populate('user')
			.sort('-createdAt');

		responseHandler.ok(res, media);
	} catch (error) {
		responseHandler.error(res);
	}
};

export default { getList, getGenres, search, getDetail };
