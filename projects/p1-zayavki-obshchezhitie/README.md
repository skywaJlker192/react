# Доска заявок общежития · модуль 1

React 19 + TypeScript + Vite. Заявки хранятся в `localStorage`, новая заявка уходит на вебхук n8n,
а бот присылает сообщение в Telegram. Токен бота хранится только в n8n.

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
```

Адрес вебхука меняется в `.env` (образец — `.env.example`). Процесс «Заявка → Telegram» лежит в
`../../avtomatizaciya/zayavka-telegram.json`: импортируйте его в n8n, подключите бота и опубликуйте.

## Структура

```
src/
  App.tsx          состояние, фильтр, добавление / смена статуса / удаление
  Header.tsx       шапка с числом новых заявок
  RequestForm.tsx  форма: что случилось, место, категория, подробности
  RequestCard.tsx  карточка: статус, подробности по кнопке, кнопки действий
  requests.ts      типы, категории и пять стартовых заявок (initialRequests)
  storage.ts       чтение и запись localStorage, ключ 'zayavki-obshchezhitie'
  notify.ts        отправка заявки на вебхук n8n
  index.css        стили
  main.tsx
ai-log.md          журнал работы с ИИ
```
