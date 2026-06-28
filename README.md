# ShortForm

A minimalist Ghost theme focused on typography and reading experience.

## Features

- Clean, typography-first design with system fonts
- Dark mode with automatic detection and manual toggle
- Responsive layout (720px reading width)
- Reading progress bar
- Syntax highlighting with copy button
- Search with keyboard shortcut (⌘K)
- Image zoom on click
- Table of contents support
- Responsive tables
- Callout blocks (info, success, warning, danger)
- Author box with social links
- Related posts
- Previous/Next post navigation
- Newsletter signup via Ghost Members
- Accessible (WCAG AA target)
- SEO optimized with Schema.org structured data
- OpenGraph and Twitter Cards support
- RSS support

## Requirements

- Ghost >= 5.0.0

## Development

```bash
# Zip the theme for upload
npm run zip
```

## Custom Templates

The theme includes custom templates for:

- **About** (`/about/`) — Create a page with `about` as its slug
- **Contact** (`/contact/`) — Create a page with `contact` as its slug
- **Archive** (`/archive/`) — Lists all posts grouped by year

## Configuration

The theme uses the following Ghost settings:

- Site logo
- Site description (shown on home page)
- Navigation links
- Social links
- Members/Newsletter

## Credits

Built with [Ghost](https://ghost.org/).

## License

MIT
