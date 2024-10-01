import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { error } from "console";

// For Creating New Document ctx = context
export const create = mutation({
    args: {
      title: v.string(),
      parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      const userId = identity.subject;
  
      const document = await ctx.db.insert("documents", {
        title: args.title,
        parentDocument: args.parentDocument,
        userId,
        isArchived: false,
        isPublished: false,
      });
  
      return document;
    }
  });


// For Getting The Data
export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Not Authenticated");
        }

        const documents = await ctx.db.query("documents").collect();

        return documents;
    }
})