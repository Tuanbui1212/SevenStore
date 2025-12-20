const mongoose = require("mongoose");

const promotionUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  promotionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  promotionCode: {
    type: String,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
});

promotionUsageSchema.index({ userId: 1, promotionId: 1 });

module.exports = mongoose.model("PromotionUsage", promotionUsageSchema);
