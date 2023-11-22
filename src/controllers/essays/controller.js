const Post = require("../../models/essays/model");
const axios = require("axios");
const moment = require("moment");

require('dotenv').config();

exports.getAllEssays = async (req, res) => {
  try {
    const essaysData = await Post.find();
    res.json(essaysData);
  } catch (error) {
    console.error("Error fetching essays:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getEssayById = async (req, res) => {
  const essayNo = req.body.essayNo;
  try {
    const essay = await Post.find({ No: essayNo });
    if (!essay) {
      return res.status(404).json({ message: "Essay not found" });
    }
    res.json(essay);
  } catch (error) {
    console.error("Error fetching essay:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.checkAndCorrectEssay = async (req, res) => {
  const essayNo = req.body.essayNo;
  const { newContent } = req.body;

  try {
    const response = await axios.post("https://api.textgears.com/check.php", {
      text: newContent,
      key: process.env.TEXTGEARS_API_KEY,
    });

    if (response.data && response.data.errors) {
      // let revisedText = newContent;
      // response.data.errors.forEach((error) => {
      //   revisedText = revisedText.replace(error.bad, error.better);
      // });

      const currentDate = moment().format("MM-DD-YYYY");

      const updatedEssay = await Post.findOneAndUpdate(
        { No: essayNo },
        {
          $set: {
            // SPELLING_CHECKING: revisedText,
            Spelling_Checking_Date: currentDate,
          },
        },
        { new: true }
      );

      res.json({
        // originalText: newContent,
        // revisedText,
        updatedEssay,
      });
    } else {
      res.status(400).json({ message: "No errors found in the text." });
    }
  } catch (error) {
    console.error("Error checking and correcting essay:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.checkAndCorrectEssays = async (req, res) => {
  const essayNos = req.body.map((essay) => essay.essayNos);
  const newContents = req.body.map((essay) => essay.newContent);

  try {
    const responses = await Promise.all(
      newContents.map((content) =>
        axios.post("https://api.textgears.com/check.php", {
          text: content,
          key: process.env.TEXTGEARS_API_KEY,
        })
      )
    );

    const updatedEssays = await Promise.all(
      responses.map(async (response, index) => {
        const essayNo = essayNos[index];
        const newContent = newContents[index];

        if (response.data && response.data.errors) {
          // let revisedText = newContent;
          // response.data.errors.forEach((error) => {
          //   revisedText = revisedText.replace(error.bad, error.better);
          // });

          const currentDate = moment().format("MM-DD-YYYY");

          return Post.findOneAndUpdate(
            { No: essayNo },
            {
              $set: {
                // SPELLING_CHECKING: revisedText,
                Spelling_Checking_Date: currentDate,
              },
            },
            { new: true }
          );
        } else {
          return null;
        }
      })
    );

    res.json({
      updatedEssays,
    });
  } catch (error) {
    console.error("Error checking and correcting essays:", error);
    res.status(500).send("Internal Server Error");
  }
};
