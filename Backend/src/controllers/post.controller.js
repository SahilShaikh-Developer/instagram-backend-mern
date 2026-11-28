const mongoose = require("mongoose");
const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  if (!req.file) {
    return res.status(400).json({
      message: "Image is required",
    });
  }

  const file = await imageKit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "test",
    folder: "insta-clone-posts",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post create successfully",
    post,
  });
}

async function getPostController(req, res) {
  const userId = req.user.id;
  const post = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "Posts fetched successfully",
    post,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "forbidden content",
    });
  }

  return res.status(200).json({
    message: "Post fetched successfully",
    post,
  });
}

async function validateTargetPost(postId, res) {
  if (!/^[0-9a-fA-F]{24}$/.test(postId) || !mongoose.isValidObjectId(postId)) {
    res.status(400).json({
      message: "Invalid post id",
    });
    return null;
  }

  const post = await postModel.findById(postId);
  if (!post) {
    res.status(404).json({
      message: "Post not found",
    });
    return null;
  }

  return post;
}

async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await validateTargetPost(postId, res);
  if (!post) {
    return;
  }

  try {
    await likeModel.updateOne(
      { post: postId, user: username },
      { $setOnInsert: { post: postId, user: username } },
      { upsert: true },
    );
  } catch (err) {
    if (
      err?.code !== 11000 ||
      !(await likeModel.exists({ post: postId, user: username }))
    ) {
      throw err;
    }
  }

  const likesCount = await likeModel.countDocuments({ post: postId });

  return res.status(200).json({
    message: "Post liked",
    liked: true,
    likesCount,
  });
}

async function unlikePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await validateTargetPost(postId, res);
  if (!post) {
    return;
  }

  await likeModel.deleteOne({
    post: postId,
    user: username,
  });

  const likesCount = await likeModel.countDocuments({ post: postId });

  return res.status(200).json({
    message: "Post unliked",
    liked: false,
    likesCount,
  });
}

async function getFeedController(req, res) {
  const user = req.user;

  const posts = await postModel
    .find()
    .populate("user", "username profileImage")
    .lean();

  if (posts.length === 0) {
    return res.status(200).json({
      message: "Post fetched successfully",
      posts: [],
    });
  }

  const postIds = posts.map((post) => post._id);

  const [likeCounts, userLikes] = await Promise.all([
    likeModel.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]),
    likeModel
      .find({ post: { $in: postIds }, user: user.username })
      .select("post -_id")
      .lean(),
  ]);

  const likesCountMap = new Map(
    likeCounts.map((entry) => [entry._id.toString(), entry.count]),
  );
  const likedPostIds = new Set(userLikes.map((entry) => entry.post.toString()));

  const enrichedPosts = posts.map((post) => ({
    ...post,
    isLiked: likedPostIds.has(post._id.toString()),
    likesCount: likesCountMap.get(post._id.toString()) || 0,
  }));

  res.status(200).json({
    message: "Post fetched successfully",
    posts: enrichedPosts,
  });
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  unlikePostController,
  getFeedController
};
