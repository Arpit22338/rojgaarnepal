# RojgaarNepal

[Visit RojgaarNepal](https://www.rojgaarnepal.com)

## AI provider

RojgaarAI chat uses OpenRouter through the server-side helper in
`lib/openrouter.ts`. Configure these environment variables locally and in
Vercel:

```bash
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openrouter/free
```

`openrouter/free` automatically chooses an available compatible free model for
each request. To use OpenRouter's quality-based paid router instead, set
`OPENROUTER_MODEL=openrouter/auto`.
