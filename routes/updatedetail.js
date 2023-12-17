const express = require('express');
const { check, validationResult, body } = require('express-validator');
const router = express.Router();
const { getDataByKey, updateDetail } = require('../utils/firestoreClient');

router.post(
	'/:username',
	[
		check('username', 'Username Tidak Ditemukan!').custom(async (username) => {
            let user; // Declare user here
            try {
                console.log('Username:', username); 
            user = await getDataByKey('username', username);
            if (!user) throw new Error();
            } catch (err) {
            console.error('Error retrieving user:', err);
            throw err;
            }
    
            return true;
        }),
        body('tinggibadan').isNumeric().withMessage('Tinggi badan harus angka'),
        body('beratbadan').isNumeric().withMessage('Berat badan harus angka'),
        body('umur').isNumeric().withMessage('Umur harus angka'),
	],
	async (req, res) => {
        console.log('Request Body:', req.body); 
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({
				error: true,
				status: 'failed',
				message: errors.array(),
			});
		} else {
            const { username } = req.params;
			const { tinggibadan, beratbadan, umur } = req.body;
            updateDetail({username, tinggibadan, beratbadan, umur })

            res.status(201).json({
                error: false,
                status: 'success',
                message: 'User Created',
            });
        }
    }
);
module.exports = router;
