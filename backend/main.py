from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
async def default():
    return {"message": "Hello World"}

class GenerateData(BaseModel):
    player: str
    message: str

@app.post("/exec_code")
async def generate(data: GenerateData):
    return "hello"