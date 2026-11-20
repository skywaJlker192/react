# react_kurs · справочник по Angular и React

Работы по дисциплине (справочник М. Н. Макарова, вариант «Общежитие»).

```
avtomatizaciya/                 автоматизация к проектам
  compose.yaml                  n8n + PocketBase + Ollama одной командой
  .env.example                  образец; настоящий .env в Git не попадает
  zayavka-telegram.json         модуль 1: заявка → n8n → Telegram
  n8n/
    ii-dispetcher.json          модуль 2: ИИ-диспетчер
    knopka-vzyat.json           модуль 2: кнопка «Взять» в Telegram
  pocketbase/                   образ базы и схема коллекции obshchezhitie
  Modelfile                     локальная модель для диспетчера
projects/
  p1-zayavki-obshchezhitie/     модуль 1: доска на localStorage
  p2-zayavki-obshchezhitie/     модуль 2: доска с PocketBase и ИИ-диспетчером
  p3-monitoring/                модуль 3: README.md и ai-log.md (код — в репозитории monitoring)
```

В каждом проекте есть свой `README.md` и `ai-log.md`. `node_modules` и `dist` в Git не попадают.

## Быстрый старт

```bash
cd avtomatizaciya
cp .env.example .env        # впишите TELEGRAM_TOKEN и TELEGRAM_CHAT_ID
docker compose up -d
```

- n8n: http://localhost:5678, импортируйте нужные процессы, выберите credentials бота и опубликуйте.
- PocketBase: http://localhost:8090/_/, создайте админа и импортируйте `pocketbase/pb_schema.json`
  (Settings → Import collections).
- Приложение: `cd projects/p1-zayavki-obshchezhitie` (или `p2-…`), затем `npm install && npm run dev`.
