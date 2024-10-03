import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { error } from "console";

// For Creating New Document (ctx = context)
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

// For Getting Sidebar Documents
export const getSidebar = query({
    args:{
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Not Authenticated");
        }

        const userId = identity.subject;

        const documents = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => 
        q
            .eq("userId",userId)
            .eq("parentDocument", args.parentDocument)
        )       
        .filter((q) => 
            q.eq(q.field("isArchived"),false))
        .order("desc")
        .collect();

        return documents;
    },
});

// Archiving Functionality

export const archive = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      const userId = identity.subject;
  
      const existingDocument = await ctx.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error("Not found");
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error("Unauthorized");
      }
//   This Is When Parent Gets Archived All Childrens Are Archived As Well
      const recursiveArchive = async (documentId: Id<"documents">) => {
        const children = await ctx.db
          .query("documents")
          .withIndex("by_user_parent", (q) => (
            q
              .eq("userId", userId)
              .eq("parentDocument", documentId)
          ))
          .collect();
  
        for (const child of children) {
          await ctx.db.patch(child._id, {
            isArchived: true,
          });
  
          await recursiveArchive(child._id);
        }
      }
  
      const document = await ctx.db.patch(args.id, {
        isArchived: true,
      });
  
      recursiveArchive(args.id);
  
      // return document;
    }
  });

//   For Trash Can Content
  export const getTrash = query({
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      const userId = identity.subject;
  
      const documents = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) =>
          q.eq(q.field("isArchived"), true),
        )
        .order("desc")
        .collect();
  
      return documents;
    }
  });
  

// For Restoring
export const restore = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      const userId = identity.subject;
  
      const existingDocument = await ctx.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error("Not found");
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error("Unauthorized");
      }
      // Recursive Restore Of Parent Is Restored Children Will Also Get Restored
      const recursiveRestore = async (documentId: Id<"documents">) => {
        const children = await ctx.db
          .query("documents")
          .withIndex("by_user_parent", (q) => (
            q
              .eq("userId", userId)
              .eq("parentDocument", documentId)
          ))
          .collect();
  
        for (const child of children) {
          await ctx.db.patch(child._id, {
            isArchived: false,
          });
  
          await recursiveRestore(child._id);
        }
      }
  
      const options: Partial<Doc<"documents">> = {
        isArchived: false,
      };
  
      if (existingDocument.parentDocument) {
        const parent = await ctx.db.get(existingDocument.parentDocument);
        if (parent?.isArchived) {
          options.parentDocument = undefined;
        }
      }
  
      const document = await ctx.db.patch(args.id, options);
  
      recursiveRestore(args.id);
  
      return document;
    }
  });

  // For Permanently Deleting
  export const remove = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      const userId = identity.subject;
  
      const existingDocument = await ctx.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error("Not found");
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error("Unauthorized");
      }
  
      const document = await ctx.db.delete(args.id);
  
      return document;
    }
  });
  

  // For Searching
  export const getSearch = query({
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      const userId = identity.subject;
  
      const documents = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) =>
          q.eq(q.field("isArchived"), false),
        )
        .order("desc")
        .collect()
  
      return documents;
    }
  });


// 

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);
    // No need TO Check Wheter We Have Identity Or Not Coz This Is Going To be Used For Published Functionality
    if (!document) {
      throw new Error("Not found");
    }
    // Check If Published And Archived if Archived It Cannot Be Published
    if (document.isPublished && !document.isArchived) {
      return document;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return document;
  }
});


// For Updating
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;
    // Extracting ID Seperately And Rest Values Can be Modified
    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }
// Use Of Patch Function : Modifies or creates one or more records in a data source, or merges records outside of a data source.
    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});