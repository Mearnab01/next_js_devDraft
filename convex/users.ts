import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!existingUser) {
      await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        isPro: false,
      });
    }
  },
});

export const getUser = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) return null;

    return user;
  },
});

export const upgradeToPro = mutation({
  args: {
    email: v.string(),
    lemonSqueezyUserId: v.string(),
    lemonSqueezyOrderId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    // Try finding the user by email first
    let user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    // If not found, try finding by Lemon Squeezy User ID
    if (!user) {
      console.warn(
        "User not found by email, trying by Lemon Squeezy User ID..."
      );
      user = await ctx.db
        .query("users")
        .filter((q) =>
          q.eq(q.field("lemonSqueezyUserId"), args.lemonSqueezyUserId)
        )
        .first();
    }

    // Still not found, throw an error
    if (!user) {
      console.error(
        "User not found. Email:",
        args.email,
        "LemonSqueezyUserId:",
        args.lemonSqueezyUserId
      );
      throw new Error("User not found");
    }

    // Update user to Pro
    await ctx.db.patch(user._id, {
      isPro: true,
      proSince: Date.now(),
      lemonSqueezyUserId: args.lemonSqueezyUserId,
      lemonSqueezyOrderId: args.lemonSqueezyOrderId,
    });

    return { success: true };
  },
});
