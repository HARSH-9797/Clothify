import prisma from "../middleware/prisma.js";

// ADD TO WISHLIST
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const item = await prisma.wishlist.create({
      data: { productId, userId }
    });

    res.json({ success: true, message: "Added to wishlist", item });
  } catch (error) {
    // @@unique constraint — already in wishlist
    if (error.code === "P2002") {
      return res.json({ success: false, message: "Already in wishlist" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    const items = await prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    await prisma.wishlist.deleteMany({
      where: { productId, userId }
    });

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};