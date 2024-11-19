const axios = require("axios");
const constantsUtils = require("../utils/constants.utils");
const { errorResponse } = require("../utils/response.utils");

exports.verifyToken = async (req, res, next) => {
    try {

        if(!req.headers.authorization) return res.status(400).json(errorResponse(constantsUtils.NOT_LOGGEDIN))

        const authToken = req.headers.authorization;
        const tokenParts = authToken.split(' ');
        const tokenValue = tokenParts[1];
        const resp = await axios.get(
            `${process.env.BASE_URL}/api/users/me?populate=gamification_score`,
            {
                headers: {
                    Authorization: `Bearer ${tokenValue}`
                }
            }
        );
        if(resp.error) return res.status(400).json(errorResponse(constantsUtils.UNAUTHORIZED))
        req.user = resp.data;
        return next();

    } catch (error) {
        console.log("error====>", error);
        return res.status(400).json({
            status: false,
            message: 'Unauthorized access.'
        });
    }
}