const {
    createSearch,
    createMultipleSearch,
    updateSearch,
    deleteSearch,
    deleteMultipleSearches,
    searchRecords,
    filterRecords
} = require("../services/searches.service")

exports.createSearchCb = async (req, res) => {
    try {
        const data = await createSearch(req.body, req.user.id)
        return res.status(200).json(data)
    }
    catch (err) {
        console.log("Error create search ===>", err)
        return res.status(400).json({
            status: false,
            msg: err
        })
    }
}

exports.createBulkSearchCb = async (req, res) => {
    try {
        const data = await createMultipleSearch(req.body, req.user.id)
        return res.status(200).json(data)
    }
    catch (err) {
        console.log("Error create bulk search ===>", err)
        return res.status(400).json({
            status: false,
            msg: err
        })
    }
}

exports.updateSearchCb = async (req, res) => {
    try {
        const { searchId } = req.params;
        const data = await updateSearch(searchId, req.body)
        return res.status(200).json(data)
    }
    catch (err) {
        console.log("Error update search ===>", err)
        return res.status(400).json({
            status: false,
            msg: err
        })
    }
}

exports.deleteSearchCb = async (req, res) => {
    try {
        const { searchId } = req.params;
        const data = await deleteSearch(searchId)
        return res.status(200).json(data)
    }
    catch (err) {
        console.log("Error delete search ===>", err)
        return res.status(400).json({
            status: false,
            msg: err
        })
    }
}

exports.deleteBulkSearchCb = async (req, res) => {
    try {
        const { searchIds } = req.query;
        const data = await deleteMultipleSearches(searchIds.split(","))
        return res.status(200).json(data)
    }
    catch (err) {
        console.log("Error delete bulk ===>", err)
        return res.status(400).json({
            status: false,
            msg: err
        })
    }
}

exports.searchCb = async (req, res) => {
    try {
        const { term } = req.query;
        const result = await searchRecords(term, req.user.id)
        const newArr = []
        result.forEach((c) => {
            newArr.push({
                ...c._doc, 
                collectionName: c._doc.collObj.name,
                collectionSlug: c._doc.collObj.slug,
                collectionId: c._doc.collObj.id
            })
        })
        return res.status(200).json(newArr)
    }
    catch (err) {
        console.log("Search ===>", err)
        return res.status(400).json({
            status: false,
            msg: err
        })
    }
}

exports.filterCb = async (req, res) => {
    return res.status(200).json([])
}