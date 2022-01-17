# Notes

<https://docs.slatejs.org/concepts/xx-migrating#fewer-packages>
slate-html-serializer matches our version

Goods:

- align with media CMS, data structure is similar

Bads:

- versions are deprecated for a long time, may not have bug fix/security fix from the community in future

- types dependencies are chaotic

- there are peer dependencies of react & react dom in backend service

- need to implement deserializer for each tag (maybe can refer to hk01-rich-media-editor?)

- maybe still need to transform to CMS's slate format? since CMS editor don't support all tags, like bullet points
