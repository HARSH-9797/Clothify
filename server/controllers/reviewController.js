import prisma from "../middleware/prisma.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment, username } = req.body;
    const userId = req.userId;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        username: username || "User",
        rating: Number(rating),
        comment,
      }
    });

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" }
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ success: true, reviews, avgRating: avgRating.toFixed(1) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await prisma.review.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};