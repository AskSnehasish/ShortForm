# ShortForm

A minimalist [Ghost CMS](https://ghost.org/) theme focused on typography and reading experience. Single-post diary layout with dark mode, chronological archive, and newsletter support.

## Features

- **Single-post diary layout.** One post per page. Clean and focused.
- **Dark mode.** Automatic system preference detection with manual sun/moon toggle. Persists preference in localStorage.
- **Chronological archive.** Posts grouped by year, month, and date with interactive year filter navigation.
- **Tag archive.** Browse posts by tag with the same chronological grouping.
- **Reading progress bar.** Subtle accent bar at the top of post pages.
- **Image zoom.** Click to zoom post images with a fullscreen overlay.
- **Table of contents.** Auto-generated from headings (h2, h3) in posts.
- **Syntax highlighting.** Code blocks with copy button support.
- **Responsive tables.** Tables scroll horizontally on small screens.
- **Callout blocks.** Info, success, warning, and danger callout styles.
- **Newsletter signup.** Built-in Ghost Members subscription forms.
- **Search.** Keyboard shortcut (Cmd+K) via Ghost's built-in search.
- **Author box.** Author bio with social links at the bottom of posts.
- **Related posts.** Auto-generated related posts section.
- **Post navigation.** Previous/next post links at the bottom of each post.
- **SEO optimized.** Schema.org JSON-LD structured data, OpenGraph, Twitter Cards.
- **Accessible.** Semantic HTML, ARIA labels, skip-to-content link, focus-visible outlines.
- **RSS support.** Auto-discovery link in the head.
- **Scroll reveal.** Posts fade in as you scroll.

## Requirements

- Ghost >= 5.0.0

## Installation

```bash
# Clone the repository
git clone https://github.com/AskSnehasish/ShortForm.git

# Install dependencies
cd ShortForm
npm install

# Build the theme (minifies CSS)
npm run build

# Zip the theme for upload
npm run zip
```

Then upload `shortform.zip` in Ghost Admin under Settings > Design > Upload theme.

## Development

```bash
# Build minified CSS
npm run build

# The build script uses csso to minify assets/css/style.css into assets/css/style.min.css
```

### Project Structure

```
ShortForm/
  default.hbs              -- Main layout shell
  index.hbs                -- Home page / post listing
  home.hbs                 -- Custom home with tag filtering
  post.hbs                 -- Individual post page
  page.hbs                 -- Static page template
  tag.hbs                  -- Tag archive page
  author.hbs               -- Author archive page
  error.hbs                -- Error page (404, 500)
  custom-about.hbs         -- About page template
  custom-contact.hbs       -- Contact page template
  custom-archive.hbs       -- Full archive page template
  routes.yaml              -- Custom Ghost routing
  members/
    subscribe.hbs          -- Standalone subscribe page
  partials/
    header.hbs             -- Site header with nav and actions
    footer.hbs             -- Site footer
    post-full.hbs          -- Full post display (home page)
    post-card.hbs          -- Post card display (listing)
    pagination.hbs         -- Pagination component
    toc.hbs                -- Table of contents
    author-box.hbs         -- Author bio section
    comments.hbs           -- Comments section
    related-posts.hbs      -- Related posts grid
    newsletter.hbs         -- Newsletter signup form
  assets/
    css/
      style.css            -- Full source CSS
      style.min.css        -- Minified build output
    js/
      main.js              -- All client-side JavaScript
    images/
      favicon.svg          -- Site favicon
  scripts/
    build.js               -- CSS minification build script
```

## Custom Templates

Create a page with the corresponding slug to use these templates:

- **About** (`/about/`) -- Page with slug `about`
- **Contact** (`/contact/`) -- Page with slug `contact`
- **Archive** (`/archive/`) -- Page with slug `archive`

## Theme Settings

Configure these in Ghost Admin under Settings > Design:

| Setting | Description |
|---|---|
| Home tags | Comma-separated tags to filter posts on the home page |
| Color scheme | Light, dark, or auto (system preference) |
| Show featured image | Toggle featured image display on post pages |
| Newsletter style | Customize the newsletter signup form |
| Copyright text | Custom footer copyright text |
| Accent color | Brand color used for links, underlines, and highlights |

## Navigation

The nav is configured in Ghost Admin under Settings > Navigation. Links with `nav-current` class (set automatically by Ghost) show an accent underline indicator.

The "More" dropdown on mobile automatically moves overflow nav items into a dropdown when there are more than 3 links.

## Customization Examples

### Accent Color

Set your brand color in Ghost Admin. It controls:

- Link underlines
- Nav link active/hover indicators
- Category tag underlines
- Reading progress bar
- Blockquote left border
- Focus outlines
- Dark mode toggle and search button hover underlines

### Adding Custom CSS

Edit `assets/css/style.css` then rebuild:

```bash
npm run build
```

## Credits

Built with [Ghost](https://ghost.org/). Uses [csso](https://github.com/css/csso) for CSS compression.

## License

MIT
