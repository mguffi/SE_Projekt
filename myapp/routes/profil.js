const express = require('express');
const router = express.Router();

// Mock database (replace with your actual database logic)
let userProfile = {
    name: "John Doe",
    gender: "Male",
    birthday: "1990-01-01",
    profilePicture: "/images/default-profile.png"
};

// Route to get the profile data
router.get('/', (req, res) => {
    res.render('profil', { profile: userProfile });
});

// Route to update the profile data
router.post('/update', (req, res) => {
    const { name, gender, birthday } = req.body;

    // Update the user profile (add validation as needed)
    if (name) userProfile.name = name;
    if (gender) userProfile.gender = gender;
    if (birthday) userProfile.birthday = birthday;

    res.redirect('/profil');
});

module.exports = router;