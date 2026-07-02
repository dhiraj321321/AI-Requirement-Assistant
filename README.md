# AI Requirement Engineering Assistant

A React + FastAPI application for automated requirements extraction, user story generation, test case generation, quality evaluation, traceability, and documentation.

## Run the backend

1. Create a Python virtual environment.
2. Install backend dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Start the FastAPI backend:
   ```powershell
   python -m uvicorn api.main:app --host 127.0.0.1 --port 8000
   ```

## Run the frontend

1. Open a separate terminal.
2. Navigate to the frontend folder:
   ```powershell
   cd frontend
   ```
3. Install frontend dependencies:
   ```powershell
   npm install
   ```
4. Start the React app:
   ```powershell
   npm run dev
   ```
5. Open the app in your browser:
   ```text
   http://127.0.0.1:5173
   ```

## Notes

- The React frontend is served by Vite and calls the FastAPI backend at `http://127.0.0.1:8000`.
- The old Streamlit UI has been removed; only the React/FastAPI stack is active.
