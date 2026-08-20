# 1. Use a lightweight Python base image
FROM python:3.10-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only the requirements file first (this caches your installations)
COPY requirements.txt .

# 4. Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy your saved model and API code into the container
COPY models/ ./models/
COPY api/ ./api/

# 6. Expose the port FastAPI will run on
EXPOSE 8000

# 7. Start the server (Notice we bind to 0.0.0.0 so external traffic can reach it)
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]