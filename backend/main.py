from fastapi import FastAPI
from pydantic import BaseModel

from jail import jail

app = FastAPI()

@app.get("/")
async def default():
    return {"message": "Hello World"}

class GenerateData(BaseModel):
    code: str

@app.post("/exec_code")
async def generate(data: GenerateData):
    """
    Execute the provided code in a restricted environment.
    """
    try:
        result = jail(data.code)
        return {"result": result}
    except Exception as e:
        return {"error": str(e)}