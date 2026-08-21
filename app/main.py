from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import Base, engine
from app.routers import auth_router, predict_router

# Initialize database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SakhiCare API",
    description="Backend service for ML-powered PCOS risk assessment.",
    version="1.0.0"
)

# Enable CORS for Frontend Access (React/Next.js)[cite: 1]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust allowed origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Centralized Error Handling Middleware
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "error": str(exc)},
    )

# Health check route
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "SakhiCare Backend API"}

# Include application routers
app.include_router(auth_router.router)
app.include_router(predict_router.router)