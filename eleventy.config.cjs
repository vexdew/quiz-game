const ghostContentAPI = require("@tryghost/content-api");

// Initialize Ghost API
const api = new ghostContentAPI({
  url: "http://localhost:2368",
  key: "17c3687944a011e6a983130bdd",
  version: "v5.0",
});

// Adding the exports for images and css
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./images");
  eleventyConfig.addPassthroughCopy("./public");

  // Custom jsonify filter for Nunjucks
  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value);
  });

  // Fetch questions from Ghost CMS
  eleventyConfig.addGlobalData("questions", async () => {
    try {
      const questions = await api.posts.browse({
        filter: "tag:question",
        fields: "title,html,url",
      });

      // Sort questions by title in ascending order
      questions.sort((a, b) => {
        const numA = parseInt(a.title.match(/\d+/));
        const numB = parseInt(b.title.match(/\d+/));
        return numA - numB;
      });

      return questions.map((question) => {
        const optionsMatch = question.html.match(/<ul>(.*?)<\/ul>/s);
        const correctAnswerMatch = question.html.match(/Correct Answer: (\w)/);

        const options = optionsMatch
          ? optionsMatch[1]
              .match(/<li>(.*?)<\/li>/g)
              .map((option) => option.replace(/<.?li>/g, "").trim())
          : [];

        const correctAnswer = correctAnswerMatch
          ? correctAnswerMatch[1].trim()
          : "";

        const questionNumber = parseInt(question.title.match(/\d+/));

        return {
          title: question.title,
          options,
          correctAnswer,
          url: `questions/question-${questionNumber}/`, // Correctly formatted URL using template literal

        };
      });
    } catch (err) {
      console.error("Error fetching questions:", err);
      return [];
    }
  });
};