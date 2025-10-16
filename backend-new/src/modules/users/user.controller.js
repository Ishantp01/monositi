
import jwt from "jsonwebtoken";
import twilio from "twilio";
import { twilioClient, whatsappFrom } from "../../config/whatsapp.js";
import { uploadFileToCloudinary } from '../../utils/uploadToCloudinary.js';
import fs from "fs";
import User from '../../models/user.model.js';


export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    // Basic validations
    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      role: role || "tenant", // default role if not provided
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Register user error:", err);
    res.status(500).json({ success: false, message: "Failed to register user" });
  }
};

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






// Temporary OTP store (for dev; use Redis or DB for production)
const otpStore = new Map();



export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    // Check if a user with this phone number already exists.
    let user = await User.findOne({ phone });

    // If the user does not exist, create a new one with dummy data.
    if (!user) {
      console.log(`User with phone ${phone} not found. Creating a new user.`);
      // Create a unique email based on the phone number
      const uniqueEmail = `${phone.replace('+', '')}@example.com`;

      user = new User({
        phone: phone,
        name: 'New User', // Default dummy name
        email: uniqueEmail, // Assign the unique email
        // Other fields will automatically use the defaults from the schema
      });
      await user.save();
      console.log(`New user created successfully with ID: ${user._id}`);
    }

    // Generate and store the OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, otp);

    // Send OTP via Twilio
    console.log(`Sending OTP ${otp} to ${phone}`);
    await twilioClient.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${phone}`,
      body: `Your OTP for login is ${otp}. It will expire in 2 minutes.`,
    })
    .then(msg => console.log("Message SID:", msg.sid))
    .catch(err => console.error("Twilio error:", err)); // Log Twilio specific errors

    // Set a timeout to delete the OTP after 2 minutes (120000 ms)
    setTimeout(() => {
      if (otpStore.get(phone) === otp) {
        otpStore.delete(phone);
        console.log(`OTP for ${phone} expired and was deleted.`);
      }
    }, 120000);

    res.status(200).json({ success: true, message: "OTP sent successfully via WhatsApp" });

  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP due to a server error." });
  }
};



 
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    const storedOtp = otpStore.get(phone);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ phone });

    // If user not found, create a new one
    if (!user) {
      user = await User.create({ phone });
    }

    // OTP verified — remove from temporary store
    otpStore.delete(phone);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};


//================================================================
// 2. User Profile
//================================================================

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password_hash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Update own profile (name, email, profile image)
 * @route   PUT /api/users/me
 * @access  Private
 */
export const updateMyProfile = async (req, res) => {
    try {
        const { name, email, profile_img,role } = req.body;
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (profile_img) updateFields.profile_img = profile_img;
        if (role) updateFields.role = role;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password_hash');

        res.status(200).json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Upload/update KYC documents
 * @route   PATCH /api/users/me/kyc
 * @access  Private
 */
export const updateKyc = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No KYC documents provided' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const documentUrls = [];
        for (const file of req.files) {
            try {
                const uploadResult = await uploadFileToCloudinary(file.path, "monositi/users/kyc");
                if (uploadResult.success) {
                    documentUrls.push(uploadResult.secure_url);
                } else {
                    console.error('Cloudinary upload failed:', uploadResult.error);
                }
            } catch (uploadError) {
                console.error('Error during KYC doc upload process:', uploadError);
                // Continue to the finally block to ensure cleanup
            } finally {
                // This block always runs, ensuring the temp file is deleted exactly once.
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                } catch (cleanupError) {
                    console.error('Failed to cleanup file:', file.path, cleanupError);
                }
            }
        }

        // Only add new documents if any were successfully uploaded
        if (documentUrls.length > 0) {
            user.KYC_docs.push(...documentUrls);
            user.verification_status = 'pending'; // Reset status on new doc upload
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: `${documentUrls.length} KYC documents uploaded. Verification is now pending.`,
            documents: user.KYC_docs
        });

    } catch (error) {
        console.error('Update KYC error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Update contact preferences
 * @route   PATCH /api/users/me/contact-preferences
 * @access  Private
 */
export const updateContactPreferences = async (req, res) => {
    try {
        const { email, sms, whatsapp } = req.body;
        const updateFields = {};

        if (typeof email === 'boolean') updateFields['contact_preferences.email'] = email;
        if (typeof sms === 'boolean') updateFields['contact_preferences.sms'] = sms;
        if (typeof whatsapp === 'boolean') updateFields['contact_preferences.whatsapp'] = whatsapp;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ success: false, message: 'No preferences provided.' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true }
        ).select('contact_preferences');

        res.status(200).json({
            success: true,
            message: 'Contact preferences updated',
            contact_preferences: user.contact_preferences
        });
    } catch (error) {
        console.error('Update contact preferences error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


//================================================================
// 3. Role & Permissions
//================================================================

/**
 * @desc    Request a role change
 * @route   PATCH /api/users/me/role
 * @access  Private
 */
export const requestRoleChange = async (req, res) => {
    try {
        const { role } = req.body;
        const allowedRoles = ['owner', 'agent', 'service_provider'];
        if (!role || !allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: `Invalid role request.` });
        }

        const user = await User.findById(req.user.id);
        if (user.role === role) {
            return res.status(400).json({ success: false, message: `You already have the role: ${role}.` });
        }

        user.role = role;
        user.verification_status = 'pending'; // Requires admin re-verification
        await user.save();

        res.status(200).json({
            success: true,
            message: `Role change to '${role}' has been requested and is pending admin review.`
        });
    } catch (error) {
        console.error('Request role change error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


//================================================================
// 4. Admin User Management (Requires 'adminOnly' middleware)
//================================================================

/**
 * @desc    List all users (with filtering)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const { role, verified, page = 1, limit = 20, sort = '-createdAt' } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (verified) filter.verification_status = verified;

        const skip = (Number(page) - 1) * Number(limit);
        const users = await User.find(filter).select('-password_hash').sort(sort).skip(skip).limit(Number(limit));
        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            users,
            pagination: {
                current: Number(page),
                total: Math.ceil(total / Number(limit)),
                count: users.length,
                totalCount: total
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get a specific user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password_hash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Admin can update a user (role, verification, subscription)
 * @route   PATCH /api/users/:id
 * @access  Private/Admin
 */
export const updateUserByAdmin = async (req, res) => {
    try {
        const { role, verification_status, monositi_verified, subscription } = req.body;
        const updateFields = {};
        if (role) updateFields.role = role;
        if (verification_status) updateFields.verification_status = verification_status;
        if (typeof monositi_verified === 'boolean') updateFields.monositi_verified = monositi_verified;
        if (subscription) updateFields.subscription = subscription;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password_hash');

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User updated successfully by admin', user });
    } catch (error) {
        console.error('Admin update user error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Soft delete or deactivate a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
    try {
        // NOTE: Soft delete requires a field like `is_active: { type: Boolean, default: true }` in user.model.js
        const user = await User.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


//================================================================
// 5. Subscription & Features
//================================================================

/**
 * @desc    Get current user's subscription status
 * @route   GET /api/users/me/subscription
 * @access  Private
 */
export const getMySubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('subscription');
        res.status(200).json({ success: true, subscription: user.subscription });
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Add or update user subscription
 * @route   POST /api/users/me/subscription
 * @access  Private
 */
export const updateMySubscription = async (req, res) => {
    try {
        // In a real application, this would be triggered by a payment gateway webhook
        const { plan } = req.body;
        if (!['basic', 'premium', 'enterprise'].includes(plan)) {
            return res.status(400).json({ success: false, message: 'Invalid subscription plan' });
        }
        
        const valid_till = new Date();
        valid_till.setFullYear(valid_till.getFullYear() + 1); // Set validity for 1 year

        const subscription = { status: true, plan, valid_till };
        const user = await User.findByIdAndUpdate(req.user.id, { subscription }, { new: true }).select('subscription');

        res.status(200).json({ success: true, message: `Subscription upgraded to '${plan}' plan.`, subscription: user.subscription });
    } catch (error) {
        console.error('Update subscription error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


//================================================================
// 6. Property-Linked
//================================================================

/**
 * @desc    Fetch properties posted by the logged-in user
 * @route   GET /api/users/me/properties
 * @access  Private
 */
export const getMyProperties = async (req, res) => {
    // This logic is best kept in property.controller.js for separation of concerns.
    // The route can point to that controller's function.
    // For this implementation, we will query from here.
    try {
        const properties = await Property.find({ owner_id: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: properties.length, properties });
    } catch (error) {
        console.error('Get my properties error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Admin fetches properties of a specific user
 * @route   GET /api/users/:id/properties
 * @access  Private/Admin
 */
export const getUserProperties = async (req, res) => {
    try {
        const { id } = req.params;
        const properties = await Property.find({ owner_id: id }).populate('owner_id', 'name email').sort('-createdAt');
        res.status(200).json({ success: true, count: properties.length, properties });
    } catch (error) {
        console.error('Get user properties error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Promote a user to admin
 * @route   PUT /api/users/:id/make-admin
 * @access  Private/Admin
 */
export const makeAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent promoting self (optional safety)
        if (req.user && req.user.id === id) {
            return res.status(400).json({ success: false, message: 'You cannot change your own role.' });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'User is already an admin' });
        }

        user.role = 'admin';
        user.monositi_verified = true; // assume admin should be marked verified
        await user.save();

        res.status(200).json({ success: true, message: 'User promoted to admin successfully', user });
    } catch (error) {
        console.error('Make admin error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};