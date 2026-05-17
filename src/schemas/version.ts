import z from "zod";

export const versionStringSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

export const versionObjectSchema = z.object({
  major: z.number(),
  minor: z.number(),
  patch: z.number(),
});

export const versionCodec = z.codec(versionStringSchema, versionObjectSchema, {
  decode: (version) => {
    const [major, minor, patch] = version.split(".").map(Number);
    return { major, minor, patch };
  },

  encode: (version) => `${version.major}.${version.minor}.${version.patch}`,
});
