# Adding a trip report

## One-time setup

Add your service role key to `.env` (Supabase dashboard → Settings → API keys):

```
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

This key bypasses RLS and must never be committed or used in app code — `.env` is already gitignored.

## Per trip

1. Copy `_template/` to a new folder: `trip-reports/bell-mountain-loop/`
2. Drop in your photos and `.gpx` file — originals are fine; the script auto-resizes to 1600px and converts to sRGB JPEG so colors stay true
3. Edit `trip.md` — frontmatter for the stats, markdown body for the story
4. Validate: `npm run add-trip -- ./trip-reports/bell-mountain-loop --dry-run`
5. Publish: `npm run add-trip -- ./trip-reports/bell-mountain-loop`

The script uploads photos to the `photos` bucket and the GPX to the `gpx` bucket
(both created automatically), then inserts the `trips` and `trip_details` rows.

To fix a published trip, edit the files and re-run with `--update`.
