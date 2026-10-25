# Start from an official image that already has Python installed
FROM python:3.12-slim

# All following commands run inside /app in the container
WORKDIR /app

# Copy ONLY requirements first, then install.
# Docker caches each step, so libraries are not re-installed unless requirements.txt changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the code
COPY . .

EXPOSE 8000

# --host 0.0.0.0 is essential: without it the server only listens INSIDE the container
# and your browser could never reach it.
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]