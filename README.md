# LOS-MVP

## Backend setup
1. Update the database password in `los-flask-app/los/config.py`.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv && source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r los-flask-app/requirements.txt
   ```
4. Run the database migrations:
   ```bash
   python los-flask-app/apply_migrations.py
   ```
5. Start the API server:
   ```bash
   python los-flask-app/run.py
   ```

## Frontend setup
1. `cd frontend-2`
2. Install packages with `npm install`
3. Start the dev server with `npm run dev`
