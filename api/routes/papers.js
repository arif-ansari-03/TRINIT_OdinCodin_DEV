const router = require('express').Router();
const Paper = require('../models/Paper');
const Group = require('../models/Group');
const { findOne } = require('../models/User');


router.post("/create-paper", async (req, res) => {
    try {
        console.log(req.body);
        const allQuestions = req.body.questions;

        const questionFormat = allQuestions.map(question => {
            const { question: questionText, options } = question;

            const optionsWithImage = options.map(option => ({
                ...option,
                image: null,
            }));

            return {
                ...question,
                questionImage: null,
                options: optionsWithImage,
            };
        });

        const time = Number(req.body.timelimit);
        let Private = true;

        if (req.body.Private == 2) {
            Private = false;
        }

        const Ngrp = new Group({
            GroupName:req.body.paperTitle,
            users:[req.body.userId]
        })
        const gr = await Ngrp.save();
        // const usr = await User.findById(req.body.userID)
        // const result = await usr.updateOne({$push:{memberOf:gr._id}})

        const imageArray = Array(allQuestions.length).fill(["", "", "", ""]);

        const newPaper = new Paper({
            userId: req.body.userId,
            GroupID:gr._id,
            paperTitle: req.body.paperTitle,
            TimeLimit: time,
            Private: Private,
            questions: questionFormat,
            optionImages: imageArray
        })

        const paper = await newPaper.save();
        res.status(200).json("A new paper has been created!");
    } catch (error) {
        res.status(500).json(error);
    }
})


router.get("/getAllPapers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const papers = await Paper.find({ userId: { $ne: id } }).populate('userId');
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json(error);
    } 
})

router.get("/getPapers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const papers = await Paper.find({ userId: id })
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.put("/update-paper/:paperId", async (req, res) => {
    try {
        const { paperId } = req.params;
        const updatedFields = req.body;

        const updatedPaper = await Paper.findByIdAndUpdate(
            paperId,
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedPaper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        res.status(200).json(updatedPaper);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



const optionFormatter = (options) => {
    let formattedOptions = options.map((option, index) => {
        const text = Object.values(option);
        let len = text.length
        let str = "";
        for (let i = 0; i < len - 1; i++) {
            str += text[i]
        }
        return str;
    });

    return formattedOptions;
}

router.get("/getQuestions/:queryString", async (req, res) => {
    try {
        const { queryString } = req.params;
        const queryParams = queryString.split('|');

        const userId = queryParams[0];
        const paperId = queryParams[1];

        const paper = await Paper.findOne({ _id: paperId, userId: userId }).populate('questions');
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        const formattedPaper = paper.questions.map(question => ({
            ...question,
            options: optionFormatter(question.options),
        }));

        return res.status(200).json(formattedPaper);

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/getPaper/:id", async (req, res) => {
    try {
        const papId = req.params.id;
        const paper = await Paper.findOne({_id:papId});

        if(!paper) return res.status(404).json("the question paper does not exist");

        const formattedPaper = {
            ...paper, // Copy all existing fields from the original paper
            questions: paper.questions.map(question => ({
              ...question, // Copy all existing fields from the original question
              options: optionFormatter(question.options), // Format the options field
            })),
          };

        return res.status(200).json(formattedPaper);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put("/updateQuestions/:paperId", async (req, res) => {
    try {
        const { paperId } = req.params;
        const updatedFields = req.body;

        const updatedPaper = await Paper.findByIdAndUpdate(
            paperId,
            { $set: { questions: updatedFields } }, 
            { new: true }
        );

        if (!updatedPaper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        res.status(200).json(updatedPaper);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put("/updateOptionImages/:paperId", async (req, res) => {
    try {
        const { paperId } = req.params;
        const { index, optionIndex, downloadURL } = req.body;

        const paper = await Paper.findById(paperId);
    
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        paper.set(`optionImages.${index}.${optionIndex}`, downloadURL);

        await paper.save();
        
        res.status(200).json("Success!");
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/updateLikes/:paperId', async (req, res) => {
  try {
    const { userId } = req.query;
    const { paperId } = req.params;

    const paper = await Paper.findById(paperId);
    const liked = paper.likes_users.includes(userId);

    if (liked) {
      const indexOfLike = paper.likes_users.indexOf(userId);
      paper.likes_users.splice(indexOfLike, 1);
      await paper.save();
      await Paper.findByIdAndUpdate(paperId, { $inc: { likes: -1 } });
      return res.status(200).json({ message: 'Like removed' });
    }

    // Add user to likes array
    await Paper.findByIdAndUpdate(paperId, { $inc: { likes: 1 } });
    paper.likes_users.push(userId);
    const disliked = paper.dislikes_users.includes(userId);
    if (disliked){
        const indexToDelete = paper.dislikes_users.indexOf('c');

        // Delete the element at the found index
        paper.dislikes_users.splice(indexToDelete, 1);
    }
    await paper.save();
    return res.status(200).json({ message: 'Like added' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.put('/updateDislikes/:paperId', async (req, res) => {
  try {
    const { userId } = req.query;
    const { paperId } = req.params;

    const paper = await Paper.findById(paperId);
    const disliked = paper.dislikes_users.includes(userId);

    if (disliked) {
      const indexOfDislike = paper.dislikes_users.indexOf(userId);
      paper.dislikes_users.splice(indexOfDislike, 1);
      await paper.save();
      await Paper.findByIdAndUpdate(paperId, { $inc: { dislikes: -1 } });
      return res.status(200).json({ message: 'Dislike removed' });
    }

    // Add user to dislikes array
    await Paper.findByIdAndUpdate(paperId, { $inc: { dislikes: 1 } });
    paper.dislikes_users.push(userId);
    const liked = paper.likes_users.includes(userId);
    if (liked){
        const indexToDelete = paper.likes_users.indexOf('c');

        // Delete the element at the found index
        paper.likes_users.splice(indexToDelete, 1);
    }
    await paper.save();
    return res.status(200).json({ message: 'Dislike added' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;



module.exports = router;