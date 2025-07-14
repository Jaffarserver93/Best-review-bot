const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

async function generateReviewId(Review) {
  try {
    let reviewId;
    let isUnique = false;

    while (!isUnique) {
      reviewId = nanoid();
      const existingReview = await Review.findOne({ reviewId });
      if (!existingReview) {
        isUnique = true;
      }
    }

    return reviewId;
  } catch (error) {
    throw new Error(`Failed to generate unique review ID: ${error.message}`);
  }
}

module.exports = { generateReviewId };
