const axios = require("axios")

exports.commentCount = async (token, id, pagetype) => {
    let count;
    let comments_count;
    if (pagetype === 'gem') {
        const gem = await axios.get(
            `${process.env.BASE_URL}/api/gems/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            },
        );
        count = gem.data.data.attributes.comments_count ? gem.data.data.attributes.comments_count : 0;
        comments_count = parseInt(count) + 1;
        
        await axios.put(
            `${process.env.BASE_URL}/api/gems/${id}`,
            {
                data: {
                    comments_count
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            },
        )
    } else if (pagetype === 'collection') {
        const collection = await axios.get(
            `${process.env.BASE_URL}/api/collections/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            },
        );
        count = collection.data.data.attributes.comments_count ? collection.data.data.attributes.comments_count : 0;
        comments_count = parseInt(count) + 1;

        await axios.put(
            `${process.env.BASE_URL}/api/collections/${id}`,
            {
                data: {
                    comments_count
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            },
        )
    }
    return "success";

}