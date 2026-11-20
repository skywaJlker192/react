# Доска заявок общежития · модуль 2

React 19 + TypeScript + Vite. Заявки лежат в PocketBase (коллекция `obshchezhitie`), доска
обновляется по событиям из базы. ИИ-диспетчер в n8n определяет категорию и срочность, а в Telegram
приходит сообщение с кнопкой «Взять».

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
```

Нужны поднятые PocketBase и n8n: `docker compose up -d` в `../../avtomatizaciya`
(схема коллекции — `pocketbase/pb_schema.json`). Адреса меняются в `.env` (образец — `.env.example`).

## Структура

```
src/
  App.tsx             собирает доску; без fetch и загрузочного useEffect
  api.ts              REST-запросы к коллекции obshchezhitie (API_URL)
  realtime.ts         подписка на события коллекции
  requests.ts         типы, статусы и четыре категории
  pb.ts               клиент PocketBase
  notify.ts           отправка заявки на вебхук n8n
  format.ts           склонения и «сколько времени назад»
  components/         Header, RequestForm, RequestCard, FilterBar, Summary
  hooks/
    useRequests.ts    весь код данных: загрузка, ошибка, повтор, add / advance / remove, realtime
    useFlash.ts       сообщение, исчезающее по таймеру
ai-log.md             журнал работы с ИИ
```

## Поведение

- Пока идёт загрузка, показывается надпись; если PocketBase недоступен, видны сообщение и кнопка «Повторить».
- Добавление, смена статуса и удаление сохраняются на сервере и остаются после F5.
- Заявка из одного окна появляется в другом без F5 и без повторов.
- Если n8n недоступен, заявка всё равно сохраняется, а уведомление пропускается.
- В проекте нет `localStorage`: все данные хранит PocketBase.
