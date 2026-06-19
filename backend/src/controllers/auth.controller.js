import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { formatUser } from "../utils/formatUser.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const buildDefaultAvatar = (name) =>
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

const uploadImageToCloudinary = async (file, folder) => {
    if (!file?.path) {
        return null;
    }

    const uploadedImage = await uploadOnCloudinary(file.path, folder);

    if (!uploadedImage?.secure_url) {
        throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    return uploadedImage.secure_url;
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new ApiError(409, "Email already registered");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    const avatar = avatarLocalPath
        ? await uploadImageToCloudinary(req.files.avatar[0], "task-manager/avatars")
        : buildDefaultAvatar(name);

    const coverImage = coverImageLocalPath
        ? await uploadImageToCloudinary(req.files.coverImage[0], "task-manager/covers")
        : "";

    const user = await User.create({
        name,
        email,
        password,
        avatar,
        coverImage,
        bio: "Hello! I am a new user.",
    });

    const token = user.generateAccessToken();

    return res.status(201).json({
        token,
        user: formatUser(user),
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = user.generateAccessToken();

    return res.status(200).json({
        token,
        user: formatUser(user),
    });
});

const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(formatUser(req.user));
});

const updateProfile = asyncHandler(async (req, res) => {
    const { name, bio, avatar, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (password) user.password = password;

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (avatarLocalPath) {
        user.avatar = await uploadImageToCloudinary(
            req.files.avatar[0],
            "task-manager/avatars"
        );
    } else if (avatar !== undefined && avatar !== "") {
        user.avatar = avatar;
    }

    if (coverImageLocalPath) {
        user.coverImage = await uploadImageToCloudinary(
            req.files.coverImage[0],
            "task-manager/covers"
        );
    }

    await user.save();

    return res.status(200).json(formatUser(user));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.findById(req.user._id);
    user.avatar = await uploadImageToCloudinary(req.file, "task-manager/avatars");
    await user.save();

    return res.status(200).json(formatUser(user));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is required");
    }

    const user = await User.findById(req.user._id);
    user.coverImage = await uploadImageToCloudinary(req.file, "task-manager/covers");
    await user.save();

    return res.status(200).json(formatUser(user));
});

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    updateUserAvatar,
    updateUserCoverImage,
};
