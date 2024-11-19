const moment = require("moment")
const Searches = require("../models/searches.model")

// create searches
exports.createSearch = async (data, userId) => {
    const formattedCreateDate = moment(data.createdAt).format('YYYY-MM-DD');
    const formattedUpdateDate = moment(data.updatedAt).format('YYYY-MM-DD');
    const colorObj = data.media && data.media.color && typeof data.media.color === "object" ? { ...data.media, author: null } : { ...data.media, color: {}, author: null }
    const socialDate = data?.socialfeed_obj?.date === "" ? null : data.socialfeed_obj?.date;
    const expander = [];
    if (data.expander && data.expander.length > 0) {
        data.expander.forEach((e) => {
            return expander.push(e?.text, e?.keyword)
        })
    }

    const tagArr = [];
    data.tags?.forEach((t) => {
        return tagArr.push(t.tag)
    })
    const obj = {
        id: data.id,
        url: data.url,
        title: data.title,
        description: data.description,
        slug: data.slug,
        media: colorObj,
        metadata: data.metaData,
        author: userId,
        collObj: {
            id: data.collection_gems.id,
            name: data.collection_gems.name,
            slug: data.collection_gems.slug
        },
        comment_count: data.comment_count,
        shares_count: data.shares_count,
        likes_count: data.likes_count,
        save_count: data.save_count,
        expander,
        media_type: data.media_type,
        platform: data.platform,
        post_type: data.post_type,
        tags: tagArr,
        socialfeed_obj: data.socialfeed_obj,
        is_favourite: data.is_favourite,
        socialfeedAt: socialDate,
        entityObj: data.entityObj,
        createddate: formattedCreateDate,
        updateddate: formattedUpdateDate,
        creatorName: data.creatorName,
        releaseDate: data.releaseDate,
    }
    return await Searches.create(obj)
}

exports.createMultipleSearch = async (data, userId) => {
    const arr = []
    data.forEach((d) => {
        const formattedCreateDate = moment(d.createdAt).format('YYYY-MM-DD');
        const formattedUpdateDate = moment(d.updatedAt).format('YYYY-MM-DD');
        const colorObj = d.media && d.media.color && typeof d.media.color === "object" ? { ...d.media, author: null } : { ...d.media, color: {}, author: null }
        const socialDate = d?.socialfeed_obj?.date === "" ? null : d.socialfeed_obj?.date;
        const expander = [];
        if (d.expander && d.expander.length > 0) {
            d.expander.forEach((e) => {
                return expander.push(e?.text, e?.keyword)
            })
        }

        const tagArr = [];
        d.tags?.forEach((t) => {
            return tagArr.push(t.tag)
        })
        const obj = {
            id: d.id,
            url: d.url,
            title: d.title,
            description: d.description,
            slug: d.slug,
            media: colorObj,
            metadata: d.metaData,
            author: userId,
            collObj: {
                id: d.collection_gems.id,
                name: d.collection_gems.name,
                slug: d.collection_gems.slug
            },
            comment_count: d.comment_count,
            shares_count: d.shares_count,
            likes_count: d.likes_count,
            save_count: d.save_count,
            expander: d.expander,
            media_type: d.media_type,
            platform: d.platform,
            post_type: d.post_type,
            tags: tagArr,
            socialfeed_obj: d.socialfeed_obj,
            is_favourite: d.is_favourite,
            socialfeedAt: socialDate,
            entityObj: d.entityObj,
            createddate: formattedCreateDate,
            updateddate: formattedUpdateDate,
            creatorName: d.creatorName,
            releaseDate: d.releaseDate,
        }
        arr.push(obj)
    })
    return await Searches.insertMany(obj, {})
}

// update searches
exports.updateSearch = async (id, data) => {
    return await Searches.findByIdAndUpdate(id, { $set: data });
}

// delete searches
exports.deleteSearch = async (id) => {
    return await Searches.findByIdAndDelete(id);
}

exports.deleteMultipleSearches = async (ids) => {
    return await Searches.deleteMany({ id: { $in: ids } })
}

// search records
exports.searchRecords = async (term, author) => {
    if (term.startsWith("http")) {
        return await Searches.find({ url: term, author: author })
    }
    return await Searches.find({ $text: { $search: term, $caseSensitive: false }, author: author })
}

// filter records 
exports.filterRecords = async (queryParams, author) => {
    const { page, perPage, filterby, queryby, termtype, sortby, orderby } = queryParams;
    const query = queryby ? queryby.split(",") : queryby;
    const fields = filterby ? filterby.replace(/ /g, "").split(",") : filterby;
    const term = termtype ? termtype.replace(/ /g, "").split(",") : termtype;
    const sortStr = sortby ? sortby.replace(/ /g, "").split(",") : sortby;
    const orderStr = sortby ? orderby.replace(/ /g, "").split(",") : orderby;

    const queryArray = []
    const queryArr = []
    const sortArr = []
    const filter = [
      {
        author
      }
    ]

    for (let i = 0; i < fields.length; i++) {
        const querystr = query[i].replace(/&coma/g, ',')
        if (term[i] === "startswith") {
            queryArray.push({
                [fields[i] === "collectionName" ? "collObj.name" : fields[i]]: {
                    query: querystr
                }
            })
        } else if (term[i] === "endswith") {
            queryArray.push(
            {
                "wildcard": {
                [`${fields[i]}.keyword`]: '*' + querystr
                }
            }
            )
        } else if (term[i] === "empty") {
            queryArr.push(
            {
                exists: {
                field: fields[i]
                }
            }
            )
        } else if (term[i] === "notempty") {
            queryArray.push(
            {
                exists: {
                field: fields[i]
                }
            }
            )
        } else if (term[i] === "is") {
            let searchArr
            searchArr = query[i].replace(/;/g, ",").split(",").flat
            (Infinity);
            if (fields[i] === "tags") {
            filter.push(
                {
                terms: {
                    "tags.keyword": searchArr
                }
                }
            )
            } else {
            queryArray.push(
                fields[i] === "createddate" || fields[i] === "updateddate"
                ? {
                    "term": {
                    [fields[i]]: query[i]
                    }
                }
                : fields[i] === "media_type" || fields[i] === "collectionName"
                    ? {
                    "terms": {
                        // [`${fields[i]}${fields[i] === "media_type" ? ".keyword" : ""}`]: searchArr
                        [`${fields[i]}.keyword`]: searchArr
                    }
                    } : fields[i] === "description"
                    ? {
                        "match_phrase": {
                        [fields[i]]: querystr
                        },
                    } : fields[i] === "is_favourite" || fields[i] === "broken_link"
                        ? {
                        "term": {
                            [fields[i]]: JSON.parse(querystr)
                        }
                        }
                        : {
                        "term": {
                            [`${fields[i]}.keyword`]: querystr
                        }
                        }
            )
            }
        } else if (term[i] === "isnot") {
            let searchArr
            searchArr = query[i].replace(/;/g, ",").split(",").flat
            (Infinity);
            queryArr.push(
            fields[i] === "createddate" || fields[i] === "updateddate"
                ? {
                "term": {
                    [fields[i]]: query[i]
                }
                } : fields[i] === "tags" || fields[i] === "media_type"
                ? {
                    "terms": {
                    [`${fields[i]}${fields[i] === "media_type" ? ".keyword" : ""}`]: searchArr
                    }
                } : fields[i] === "description"
                    ? {
                    "match_phrase": {
                        [fields[i]]: querystr
                    },
                    } : {
                    "term": {
                        [`${fields[i]}.keyword`]: query[i]
                    }
                    }
            )
        } else if (term[i] === "contains") {
            queryArray.push(
            {
                multi_match: {
                query: query[i],
                type: "phrase_prefix",
                fields: [fields[i]]
                }
            }
            )
        } else if (term[i] === "doesnotcontains") {
            queryArr.push(
            {
                multi_match: {
                query: query[i],
                type: "phrase_prefix",
                fields: [fields[i]]
                }
            }
            )
        } else if (term[i] === "isbetween") {
            const date = query[i].split(";");
            queryArray.push(
            {
                range: {
                [fields[i]]: {
                    gte: date[0],
                    lte: date[1],
                }
                },
            }
            )
        } else if (term[i] === "isbefore") {
            queryArray.push(
            {
                range: {
                [fields[i]]: {
                    lt: query[i],
                },
                },
            },
            )
        } else if (term[i] === "isafter") {
            queryArray.push(
            {
                range: {
                [fields[i]]: {
                    gt: query[i],
                },
                },
            },
            )
        } else if (term[i] === "isonafter") {
            queryArray.push(
            {
                range: {
                [fields[i]]: {
                    gte: query[i],
                },
                },
            },
            )
        } else if (term[i] === "isonbefore") {
            queryArray.push(
            {
                range: {
                    [fields[i]]: {
                        lte: query[i],
                    },
                },
            },
            )
        } else if (term[i] === "istoday") {
            queryArray.push(
                {
                    range: {
                    [fields[i]]: {
                        $gte: query[i],
                        $lte: query[i],
                    }
                    },
                },
            )
        }
    }
  
    for (let i = 0; i < sortStr.length; i++) {
        if (sortStr[i] === "createddate" || sortStr[i] === "updateddate") {
            sortArr.push(
            { [`${sortStr[i]}`]: { order: orderStr[i] } }
            )
        } else {
            sortArr.push(
            { [`${sortStr[i]}.keyword`]: { order: orderStr[i], "mode": "max" } }
            )
        }
    }
}