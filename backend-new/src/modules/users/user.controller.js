import User from '../../models/user.model.js';

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, profile_img } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { name, email, profile_img },
            { new: true }
        );

        res.json({message: 'User profile updated successfully', user});
    }
    catch(err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({message: 'Failed to update user profile'});
    }
}

