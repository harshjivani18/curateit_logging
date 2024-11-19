const axios = require("axios");
const score_keys = "gems colls comments reactions";

exports.gemification = async (user, token, action, length = 1) => {
    const userGemiScore = user.gamification_score;
    const comments = action === "add" ? parseInt(userGemiScore.comments) + length : parseInt(userGemiScore.comments) - length;
    const comments_point = action === "add" ? parseInt(userGemiScore.comments_point) + length : parseInt(userGemiScore.comments) - length;
    await axios.put(
        `${process.env.BASE_URL}/api/gamification-scores/${userGemiScore.id}`,
        {
            data: {
                comments,
                comments_point,
            }
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return { comments, comments_point };
}

exports.gemificationTotal = async (user, token) => {
    const userGemiScore = user.gamification_score;
    const gemiScore = await axios.get(
        `${process.env.BASE_URL}/api/gamification-scores/${userGemiScore.id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    let level;
    let totalScore = 0
    for (const keys in gemiScore.data.data.attributes) {
        if (score_keys.includes(keys)) {
            totalScore += parseInt(gemiScore.data.data.attributes[keys])
        }
    }
    switch (true) {
        case totalScore < 25000:
            level = "Rookie";
            break;
        case totalScore < 100000:
            level = "Aspiring Influencer";
            break;
        case totalScore < 500000:
            level = "Expert";
            break;
        default:
            level = "Legend";
    }

    await axios.put(
        `${process.env.BASE_URL}/api/gamification-scores/${gemiScore.data.data.id}`,
        {
            data: {
                totalScore,
                level
            }
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return "success";
}