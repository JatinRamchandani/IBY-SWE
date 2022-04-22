const express = require('express');
const router = express.Router();
const face = require('../models/face');


router.post('/expsend', async (req, res) => {
    let mp = {}
    mp['neutral'] = req.body.neutral
    mp['happy'] = req.body.happy
    mp['sad'] = req.body.sad
    mp['angry'] = req.body.angry
    mp['fearful'] = req.body.fearful
    mp['disgusted'] = req.body.disgusted
    mp['surprised'] = req.body.surprised

    let finalexp = "neutral";
    let maxex = mp['neutral'];
    
    for(let i in mp){
        if(mp[i]>maxex){
            maxex = mp[i];
            finalexp = i;
        }
    }

    const nface = new face({
        neutral: req.body.neutral,
        happy: req.body.happy,
        sad: req.body.sad,
        angry: req.body.angry,
        fearful: req.body.fearful,
        disgusted: req.body.disgusted,
        surprised: req.body.surprised,
        emotion: finalexp
    });

    try {
        const newface = await nface.save()
        console.log(newface);
        res.status(201).json({ emotion : finalexp});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})


module.exports = router