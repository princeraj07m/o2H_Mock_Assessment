/**
 * Maps a Mongoose user document to the API response shape expected by the frontend.
 */
export const formatUser = (user) => {
    if (!user) return null;

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage || "",
        bio: user.bio || "",
    };
};
