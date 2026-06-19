import { Router } from "express";
import {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    updateUserAvatar,
    updateUserCoverImage,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    registerValidator,
    loginValidator,
    updateProfileValidator,
} from "../middlewares/validators/auth.validator.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerValidator,
    validate,
    registerUser
);

router.route("/login").post(loginValidator, validate, loginUser);
router.route("/profile").get(verifyJWT, getProfile);
router.route("/profile").put(
    verifyJWT,
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    updateProfileValidator,
    validate,
    updateProfile
);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
);

export default router;
