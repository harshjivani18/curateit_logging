const { ApifyClient } = require("apify-client");
const constantsUtils = require("../utils/constants.utils");
const { errorResponse, successResponse } = require("../utils/response.utils");

const client = new ApifyClient({
    token: process.env.APIFY_KEY,
});

async function fetchInstagramData(username) {
    const input = {
        directUrls: [`https://www.instagram.com/${username}/`],
        resultsType: "details",
        resultsLimit: 200,
        addParentData: false,
        searchType: "hashtag",
        searchLimit: 1,
    };

    try {
        // Run the Actor and wait for it to finish
        const run = await client.actor(process.env.INSTAGRAM_TOKEN).call(input);

        // Fetch and process Actor results from the run's dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        let description = items[0].biography;
        let totalFollowers = items[0].followersCount;
        let totalPosts = items[0].postsCount;
        let highlightReelCount = items[0].highlightReelCount;
        let igtvCount = items[0].igtvVideoCount;

        let totalComments = 0;
        let totalLikes = 0;
        let numberOfPosts = items[0].latestPosts.length;

        items[0].latestPosts.forEach((post) => {
            totalComments += post.commentsCount;
            totalLikes += post.likesCount;
        });

        // Calculate the averages
        let averageComments = totalComments / numberOfPosts;
        let averageLikes = totalLikes / numberOfPosts;
        let engagementScore = averageLikes + averageComments;

        const data = {
            description,
            totalFollowers,
            totalPosts,
            highlightReelCount,
            igtvCount,
            engagementScore,
        };

        return data;
    } catch (error) {
        console.error("Error fetching Instagram data:", error);
        throw error;
    }
}

async function fetchTiktokData(username) {
    const input = {
        startUrls: [`https://www.tiktok.com/@${username}`],
        maxItems: 1,
        getFollowers: true,
        getFollowing: true,
        customMapFunction: (object) => {
            return { ...object };
        },
    };

    try {
        // Run the Actor and wait for it to finish
        const run = await client.actor(process.env.TIKTOK_TOKEN).call(input);

        // Fetch and process Actor results from the run's dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        let followers = items[0].followers;
        let totalLikes = items[0].likes;
        let totalVideos = items[0].videos;
        let description = items[0].bio;

        const data = {
            followers,
            totalLikes,
            totalVideos,
            description,
        };

        return data;
    } catch (error) {
        console.error("Error fetching Tiktok data:", error);
        throw error;
    }
}

async function fetchTiktokDatav2(username) {
    const input = {
        profiles: [username],
        resultsPerPage: 10,
        shouldDownloadVideos: false,
        shouldDownloadCovers: false,
        shouldDownloadSlideshowImages: false,
        disableEnrichAuthorStats: false,
        disableCheerioBoost: false,
    };

    try {
        // Run the Actor and wait for it to finish
        const run = await client.actor(process.env.TIKTOK_V2_TOKEN).call(input);

        // Fetch and process Actor results from the run's dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        let totalCommentCount = 0;
        let totalShareCount = 0;

        items.forEach((item) => {
            totalCommentCount += item.commentCount;
            totalShareCount += item.shareCount;
        });

        let averageCommentCount = totalCommentCount / items.length;
        let averageShareCount = totalShareCount / items.length;

        let engagementScore = averageCommentCount + averageShareCount;
        const data = {
            engagementScore,
        };

        return data;
    } catch (error) {
        console.error("Error fetching Tiktok data:", error);
        throw error;
    }
}

async function fetchYoutubeData(username) {
    const input = {
        startUrls: [
            {
                url: `https://www.youtube.com/@${username}`,
            },
        ],
        maxResults: 1,
    };

    try {
        // Run the Actor and wait for it to finish
        const run = await client.actor(process.env.YOUTUBE_TOKEN).call(input);

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        let subscriberCount = items[0]?.numberOfSubscribers;
        let videoCount = items[0]?.channelTotalVideos;
        let description = items[0]?.channelDescription;
        let viewsCount = parseInt(items[0]?.channelTotalViews.replace(/,/g, ""));
        let avgViews = viewsCount / videoCount;
        let avgSubs = subscriberCount / videoCount;
        let engagementScore = Math.round(avgViews + avgSubs);
        const data = {
            subscriberCount,
            videoCount,
            description,
            viewsCount,
            engagementScore,
        };

        return data;
    } catch (error) {
        console.error("Error fetching Tiktok data:", error);
        throw error;
    }
}

async function fetchTwitterData(username) {
    const input = {
        handles: [username],
        tweetsDesired: 100,
        addUserInfo: true,
        startUrls: [],
        proxyConfig: {
            useApifyProxy: true,
        },
    };

    try {
        // Run the Actor and wait for it to finish
        const run = await client.actor(process.env.TWITTER_TOKEN).call(input);

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        let followers = items[0].user.followers_count;
        let bannerUrl = items[0].user.profile_banner_url;
        let profilePicUrl = items[0].user.profile_image_url_https;
        let totalPosts = items[0].user.statuses_count;
        let totalFavourites = items[0].user.favourites_count;
        let replyCount = items[0].reply_count;
        let viewCount = items[0].view_count;
        let retweetCount = items[0].retweet_count;
        let engagementScore =
            totalFavourites + replyCount + viewCount + retweetCount;

        const data = {
            followers,
            bannerUrl,
            profilePicUrl,
            totalPosts,
            engagementScore,
        };

        return data;
    } catch (error) {
        console.error("Error fetching Twitter data:", error);
        throw error;
    }
}

exports.socialScrapping = async (req, res) => {
    try {
        const id = req.query.id;
        const platform = req.query.platform.toLowerCase();

        let profileData;
        if (platform === "instagram") {
            profileData = await fetchInstagramData(id);
        } else if (platform === "tiktok") {
            const profileData1 = await fetchTiktokData(id);
            const profileData2 = await fetchTiktokDatav2(id);
            profileData = {
                ...profileData1,
                ...profileData2,
            };
        } else if (platform === "youtube") {
            profileData = await fetchYoutubeData(id);
        } else if (platform === "twitter") {
            profileData = await fetchTwitterData(id);
        }

        let responseObject;

        if (profileData) {
            responseObject = {
                status: "success",
                data: {
                    id: id,
                    platform: platform,
                    profileData: profileData,
                },
            };
        } else {
            responseObject = {
                status: "failed",
                data: {
                    id: id,
                    platform: platform,
                },
            };
        }

        return res
            .status(200)
            .json(successResponse(constantsUtils.GET_SOCIAL_DETAILS, responseObject));
    } catch (error) {
        return res.status(400).json(errorResponse(error.message));
    }
};