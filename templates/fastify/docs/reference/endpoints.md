# Endpoints

| Method | Path | |
|---|---|---|
| `GET` | `/todos?filter=all\|active\|completed` | list |
| `POST` | `/todos` | create from `{ title }` |
| `PATCH` | `/todos/:id` | change `title`, `completed` or both |
| `DELETE` | `/todos/:id` | delete one |
| `DELETE` | `/todos/completed` | delete the completed ones |
| `GET` | `/stats` | total, completed, remaining |

Requests and responses are Zod schemas, which validate the input, serialize the output and produce the OpenAPI document served on `/docs/json`.
