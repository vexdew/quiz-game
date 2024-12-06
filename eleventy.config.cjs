const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
    // Add a "jsonify" filter for JSON output
    eleventyConfig.addFilter("jsonify", function (value) {
        return JSON.stringify(value, null, 2); // Pretty-print JSON
    });

    // Add "alphabetize" filter: Converts 1 to 'A', 2 to 'B', etc.
    eleventyConfig.addFilter("alphabetize", (index) => {
        return String.fromCharCode(64 + index); // 1 -> A, 2 -> B, etc.
    });

    // Add passthrough copy for static files
    eleventyConfig.addPassthroughCopy("./images");
    eleventyConfig.addPassthroughCopy("./public");

    // Load questions from localQuestions.json
    const questionsPath = path.resolve(__dirname, "localQuestions.json");
    const questions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

    // Dynamically generate pages for each question
    eleventyConfig.addCollection("questions", () => {
        return questions.map((question, index) => ({
            ...question,
            nextQuestionUrl: index + 1 < questions.length ? `/questions/question-${index + 2}/` : null,
        }));
    });

    // Generate question pages dynamically
    questions.forEach((question, index) => {
        const questionDirPath = path.join(__dirname, `questions/question-${index + 1}`);
        const questionFilePath = path.join(questionDirPath, "index.njk");

        // Ensure the directory exists
        if (!fs.existsSync(questionDirPath)) {
            fs.mkdirSync(questionDirPath, { recursive: true });
        }

        // Write the template file
        fs.writeFileSync(
            questionFilePath,
            `{% set question = collections.questions[${index}] %}\n{% include "question.njk" %}`
        );
    });

    return {
        dir: {
            input: ".",
            output: "_site",
        },
    };
};
