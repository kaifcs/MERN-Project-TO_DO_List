# MERN To-Do Backend

Express + MongoDB backend for your To-Do list UI.

## Quick Start

1. **Install deps**
   ```bash
   cd mern-todo-backend
   npm install
   cp .env.example .env
   ```

2. **Set MongoDB URI** in `.env` (default is local MongoDB).

3. **Run**
   ```bash
   npm run dev
   # or: npm start
   ```
   API runs on `http://localhost:${PORT || 5000}`.

## REST API

- `GET /api/health` – health check
- `GET /api/tasks` – list tasks
- `POST /api/tasks` – create task `{ "title": "Read book" }`
- `GET /api/tasks/:id` – get one
- `PATCH /api/tasks/:id` – update `{ "title": "...", "completed": true }`
- `DELETE /api/tasks/:id` – delete

### cURL Examples

```bash
# Create
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"title":"Learn MERN"}'

# List
curl http://localhost:5000/api/tasks

# Toggle complete
curl -X PATCH http://localhost:5000/api/tasks/<ID> -H "Content-Type: application/json" -d '{"completed": true}'

# Rename
curl -X PATCH http://localhost:5000/api/tasks/<ID> -H "Content-Type: application/json" -d '{"title":"New title"}'

# Delete
curl -X DELETE http://localhost:5000/api/tasks/<ID>
```

## Frontend Hookup (vanilla JS)

Replace your localStorage logic with API calls:

```js
const API = 'http://localhost:5000/api/tasks';

async function fetchTasks(){
  const res = await fetch(API);
  return await res.json();
}

async function createTask(title){
  const res = await fetch(API, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title})});
  return await res.json();
}

async function updateTask(id, patch){
  const res = await fetch(\`\${API}/\${id}\`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(patch)});
  return await res.json();
}

async function deleteTask(id){
  await fetch(\`\${API}/\${id}\`, {method:'DELETE'});
}
```

Then rebuild your DOM from `fetchTasks()` results.
```

