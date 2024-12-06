const fs = require("fs");
const path = require("path");

exports.handler = async function () {
  try {
    // Use a relative path assuming the JSON file is in the root directory
    const questionsPath = path.resolve(__dirname, "../../localQuestions.json");

    console.log("Resolved questionsPath:", questionsPath);

    if (!fs.existsSync(questionsPath)) {
      throw new Error("localQuestions.json file does not exist at path: " + questionsPath);
    }

    const questions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

    return {
      statusCode: 200,
      body: JSON.stringify(questions),
    };
  } catch (error) {
    console.error("Error loading questions:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load questions." }),
    };
  }
};
