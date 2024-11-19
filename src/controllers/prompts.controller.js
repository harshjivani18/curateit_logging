const {
  getSinglePromptService,
  editPromptService,
  createPromptService,
  getAllPromptService,
  getAdminPromptsService,
  searchPromptService,
} = require("../services/prompts.service");
const constantsUtils = require("../utils/constants.utils");
const { errorResponse, successResponse } = require("../utils/response.utils");

// Get all Prompts
exports.getAllPrompt = async (req, res) => {
  // TODO: Just service call and return response here all logic will manage in services only
  try {
    const { user } = req;
    let page = req.query.page ? req.query.page : 0;
    let perPage = req.query.perPage ? req.query.perPage : 10;
    const skipCount = page * perPage;

    const result = await getAllPromptService(skipCount, perPage, user.id);

    return res
      .status(200)
      .json(successResponse(constantsUtils.ALL_PROMPT_LIST, result));
  } catch (error) {
    return res.status(400).json(errorResponse(error.message));
  }
};

// Create Prompt
exports.createPrompt = async (req, res) => {
  try {
    const { name, prompt, share_type, icon, gem } = req.body;
    const { user } = req;
    if (!name || !prompt || !share_type || !gem || !user)
      return res
        .status(400)
        .json(errorResponse(constantsUtils.PROMPT_FIELD_MISSING));

    const promptObj = {
      name,
      prompt,
      share_type,
      icon: icon
        ? icon
        : "https://d3jrelxj5ogq5g.cloudfront.net/webapp/curateit-200x200.png",
      gem,
      user: {
        id: user.id,
        username: user.username
      },
    };

    const result = await createPromptService(promptObj);

    // update gemification
    // const user = req.user;
    // const authToken = req.headers.authorization;
    // const tokenParts = authToken.split(' ');
    // const tokenValue = tokenParts[1];
    // await gemification(user, tokenValue, action = "add");
    // gemificationTotal(user, tokenValue);

    // commentCount(tokenValue, page_id, page_type);

    return res
      .status(200)
      .json(successResponse(constantsUtils.CREATE_PROMPT, result));
  } catch (error) {
    return res.status(400).json(errorResponse(error.message));
  }
};

// Edit Prompt
exports.editPrompt = async (req, res) => {
  // TODO: Just service call and return response here all logic will manage in services only
  try {
    const { promptId, userId } = req.params;
    // const {
    //   name,
    //   prompt,
    //   share_type,
    //   icon,
    //   prompt_type,
    //   isApproved,
    //   total_count,
    // } = req.body;.
    const data = req.body;
    const { user } = req;

    const promptData = await getSinglePromptService(promptId);
    if (!promptData)
      return res.status(400).json(errorResponse(constantsUtils.NO_PROMPT));

    const promptBy = parseInt(promptData.user.id);
    const parseUserId = parseInt(user.id);
    // const parseUserId = parseInt(userId);

    // if (!name || !prompt || !share_type || !icon || !prompt_type)
    if (!data)
      return res
        .status(400)
        .json(errorResponse(constantsUtils.PROMPT_FIELD_MISSING));

    if ((Object.keys(data).length === 1 && Object.keys(data)[0] === "total_count" ) || promptBy === parseUserId) {
      // const data = {
      //   name,
      //   prompt,
      //   share_type,
      //   icon,
      //   prompt_type,
      //   isApproved,
      //   total_count,
      // };

      await editPromptService(promptData._id, data);
      return res
        .status(200)
        .json(successResponse(constantsUtils.UPDATE_PROMPT));
    } else {
      return res.status(400).json(errorResponse(constantsUtils.NOT_AUTHORIZED));
    }
  } catch (error) {
    return res.status(400).json(errorResponse(error.message));
  }
};

// // Delete Prompt
// exports.deleteComment = async (req, res) => {
//   // TODO: Just service call and return response here all logic will manage in services only.
//   try {
//     const { commentId, userId } = req.params;
//     const comment = await getSingleComment(commentId);
//     if (!comment)
//       return res.status(400).json(errorResponse(constantsUtils.NO_COMMENT));

//     const commentBy = parseInt(comment.comment_by.id);
//     const parseUserId = parseInt(userId);
//     if (commentBy === parseUserId) {
//       // update gemification
//       const user = req.user;
//       const authToken = req.headers.authorization;
//       const tokenParts = authToken.split(" ");
//       const tokenValue = tokenParts[1];

//       let ids = [];
//       ids.push(comment._id);
//       if (comment.replies.length > 0) {
//         let replyIds = await fetchSubReplies(comment.replies);
//         ids = [...ids, ...replyIds];
//       }

//       await deleteBulkComment(ids);
//       await gemification(user, tokenValue, "subtract", ids.length);
//       gemificationTotal(user, tokenValue);

//       return res
//         .status(200)
//         .json(successResponse(constantsUtils.DELETE_COMMENT));
//     } else {
//       return res.status(400).json(errorResponse(constantsUtils.NOT_AUTHORIZED));
//     }
//   } catch (error) {
//     return res.status(400).json(errorResponse(error.message));
//   }
// };

// Get Single Prompt
exports.getSinglePrompt = async (req, res) => {
  // TODO: Just service call and return response here all logic will manage in services only
  try {
    const { id } = req.params;
    const result = await getSinglePromptService(id);

    if (!result)
      return res.status(400).json(errorResponse(constantsUtils.NO_PROMPT));

    return res
      .status(200)
      .json(successResponse(constantsUtils.SINGLE_PROMPT, result));
  } catch (error) {
    return res.status(400).json(errorResponse(error.message));
  }
};

// Get Admin Prompts
exports.getAdminPrompts = async (req, res) => {
  try {
    // const { userId } = req.params;
    let page = req.query.page ? req.query.page : 0;
    let perPage = req.query.perPage ? req.query.perPage : 10;
    const skipCount = page * perPage;

    const result = await getAdminPromptsService(skipCount, perPage);

    return res
      .status(200)
      .json(successResponse(constantsUtils.ALL_PROMPT_LIST, result));
  } catch (error) {
    return res.status(400).json(errorResponse(error.message));
  }
};

// Search Prompts
exports.searchPrompt = async (req, res) => {
  try {
    const { user } = req;
    const { text } = req.query;
    let page = req.query.page ? req.query.page : 0;
    let perPage = req.query.perPage ? req.query.perPage : 10;
    const skipCount = page * perPage;

    const result = await searchPromptService(skipCount, perPage, user.id, text);

    return res
      .status(200)
      .json(successResponse(constantsUtils.ALL_PROMPT_LIST, result));
  } catch (error) {
    return res.status(400).json(errorResponse(error.message));
  }
};