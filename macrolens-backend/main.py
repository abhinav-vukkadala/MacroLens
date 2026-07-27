import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

app = FastAPI(title="MacroLens AI Gateway")

# Enable CORS so your React Native frontend can connect without cross-origin issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema coming from React Native
class ImageAnalyzeRequest(BaseModel):
    base64_image: str  # The base64 string from expo-image-picker

@app.post("/api/analyze-food")
async def analyze_food(request: ImageAnalyzeRequest):
    if not NVIDIA_API_KEY:
        raise HTTPException(status_code=500, detail="NVIDIA API key not configured")

    # Format base64 image string for OpenAI/NVIDIA spec
    image_url_data = f"data:image/jpeg;base64,{request.base64_image}"

    # Construct system and user prompt for strict JSON output
    prompt = (
        "Analyze this food image and estimate the nutritional content. "
        "Return ONLY a valid JSON object with these exact keys: "
        '"foodName" (string), "calories" (integer), "protein" (string with "g"), '
        '"carbs" (string with "g"), "fats" (string with "g"). '
        "Do NOT include markdown formatting, backticks, or any additional conversational text."
    )

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "meta/llama-3.2-11b-vision-instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url_data}},
                ],
            }
        ],
        "max_tokens": 512,
        "temperature": 0.2, # Low temperature for more consistent, deterministic JSON
        "top_p": 1,
        "stream": False,
    }

    try:
        response = requests.post(NVIDIA_INVOKE_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        
        # Extract the model's textual response
        content = data["choices"][0]["message"]["content"]
        return {"raw_response": content}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"NVIDIA API Error: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "MacroLens API Gateway Running"}