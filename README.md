# skolenu-platforma

## Lokāla palaišana

1. Instalē atkarības:
   ```bash
   npm install
   ```
2. Izveido `.env.local` ar Supabase iestatījumiem:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Startē izstrādes serveri:
   ```bash
   npm run dev
   ```
4. Atver:
   - Galvenā platforma: `http://localhost:3000/`
   - Spēļu sadaļa: `http://localhost:3000/games`

## Jaunā sadaļa “Spēles”

Pievienota atsevišķa maršruta sadaļa `/games` ar mini-spēli **“Uzņēmējdarbība Sprints”**:
- landing kartīte ar aprakstu,
- “Sākt spēli” poga,
- 2D spēles laukums (joslas + krītoši termini),
- score, lives/hearts, streak, round progress,
- game over un retry,
- demo režīms neielogojušiem lietotājiem,
- Supabase rezultātu saglabāšana ielogojušam lietotājam.

## Kā pievienot jaunu mācību priekšmetu spēlei

Atver `lib/gameSubjects.ts` un pievieno jaunu ierakstu objektā `GAME_SUBJECTS`:
- `id`
- `name`
- `description`
- `gameKey`
- `rounds[]`, kur katram raundam ir:
  - `prompt`
  - `correctItems[]`
  - `wrongItems[]`
  - `targetCorrect`

Pēc tam `app/games/page.tsx` vari nomainīt `DEFAULT_GAME_SUBJECT` uz izvēlēto priekšmetu vai izveidot izvēlni starp priekšmetiem.

## Supabase migrācija (obligāta spēļu rezultātiem)

Izpildi SQL no faila:
- `supabase/migrations/20260224113000_create_game_results.sql`

Tabula `game_results` satur:
- `user_id`
- `game_key`
- `subject_key`
- `score`
- `accuracy`
- `streak`
- `completed_at`
- `level_reached`

Papildus ir indeksācija un RLS politikas:
- lietotājs var ievietot tikai savus rezultātus,
- lietotājs var lasīt tikai savus rezultātus.

## Galvenās izmaiņas (kopsavilkums)

- Jauns maršruts: `app/games/page.tsx`
- Jauna 2D spēles komponente: `app/components/games/LearningSprintGame.tsx`
- Jauns spēles datu modelis/tipi: `app/game/types.ts`
- Jauns hook rezultātu ielādei/saglabāšanai: `app/hooks/useGameResults.ts`
- Jauna spēļu konfigurācija: `lib/gameSubjects.ts`
- Jauna Supabase piekļuve spēles rezultātiem: `lib/gameProgress.ts`
- Jauna migrācija: `supabase/migrations/20260224113000_create_game_results.sql`
- Navigācijas papildinājums sākumlapā: `app/page.tsx` (saite uz `/games`)
