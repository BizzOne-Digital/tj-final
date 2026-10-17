# Asset manifest (upload via admin / Cloudinary when available)

| Area | Source (Google Drive per client brief) | Site field |
|------|----------------------------------------|------------|
| Homepage / season poster | Drive — league artwork | `SiteSettings.brand.seasonPoster` |
| Header / footer / mobile logos | Brand kit | `brand.headerLogo`, `footerLogo`, `mobileLogo` |
| Favicon & social share | Brand kit | `brand.favicon`, `socialShareImage` |
| Nike mark | Poster artwork | `brand.nikeMark` (display only, configurable) |
| About collage | Drive photos | Home / About sections |
| Per-school logos | School folders | `SchoolProgram.logo` |
| Schedules PDFs | 4th / 6th grade schedule docs | `Resource.document` |
| Gallery albums | Season galleries | `GalleryAlbum` (extend in admin) |
| Central PA Lions | Related program media | `CentralPaLions` |
| Intro video | Legacy site video | Page section / gallery |

Public site uses Unsplash placeholders until real assets are uploaded. Admin shows upload-needed flags on resources without documents.
