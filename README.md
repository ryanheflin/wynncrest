# Wynncrest Books

Official website for Wynncrest Books.

© 2026 Wynncrest Books. All rights reserved.


## Wynncrest Guide to Publishing

Guide articles live in the Jekyll collection folder `_articles/`.

To publish an article:
1. Duplicate `_articles/ARTICLE_TEMPLATE.md`.
2. Rename the copy with a lowercase URL slug, e.g. `how-to-choose-a-ghostwriter.md`.
3. Remove `published: false` and complete the front matter.
4. Paste/write the article in Markdown below the front matter.
5. Commit to `main`.

The article is automatically rendered using `_layouts/article.html`, published at `/articles/<slug>/`, added to `/guide/`, and added to `/sitemap.xml`.

See `AI_VISIBILITY_CHECKLIST.md` for the external visibility campaign.
