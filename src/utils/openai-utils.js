// const { Configuration, OpenAIApi } = require("openai");
const { OpenAI } = require('openai');

exports.openai = async (data) => {

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: data.prompt },
            { role: "user", content: data.content },
        ],
    });

    return completion.choices[0].message.content;
}