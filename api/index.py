from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import time

app = FastAPI()

@app.get("/")
def read_root():
    return FileResponse("index.html")

@app.get("/admin.html")
def serve_admin():
    return FileResponse("admin.html")

@app.get("/admin")
def serve_admin_alias():
    return FileResponse("admin.html")    

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "/tmp/aurum_store.json"

DEFAULT_PERFUMES = [
    {
        "id": 1,
        "name": "Dior Sauvage",
        "gender": "Men",
        "scent_family": "Fresh",
        "tag": "Best Seller",
        "notes": "Calabrian Bergamot, Sichuan Pepper, Ambroxan",
        "best_time": "Night Out / Versatile Daily",
        "description": "Radically fresh, raw, and magnetic with crisp citrus and intense ambery woods.",
        "price": 250,
        "image": "images/dior-sauvage.png"
    },
    {
        "id": 2,
        "name": "Versace Eros",
        "gender": "Men",
        "scent_family": "Sweet",
        "tag": "Best Seller",
        "notes": "Mint Leaves, Green Apple, Tonka Bean, Vanilla",
        "best_time": "Party / Evening / Fall",
        "description": "A luminous aura with an intense, vibrant, and glowing combination of fresh mint and sweet vanilla.",
        "price": 250,
        "image": "images/versace-eros.png"
    },
    {
        "id": 3,
        "name": "Lacoste Black",
        "gender": "Men",
        "scent_family": "Woody",
        "tag": "New Arrivals",
        "notes": "Watermelon, Basil, Lavender, Dark Chocolate",
        "best_time": "Casual Days / Warm Evenings",
        "description": "An intense, refreshing contrast that blends aqueous watermelon with an unexpected dark chocolate finish.",
        "price": 250,
        "image": "images/lacoste-black.png"
    },
    {
        "id": 4,
        "name": "Bvlgari Extreme",
        "gender": "Men",
        "scent_family": "Fresh",
        "tag": "Sale",
        "notes": "Darjeeling Tea, Bergamot, Cardamom, Guaiac Wood",
        "best_time": "Office / Formal / Summer",
        "description": "Understated refinement expressing classic masculine elegance with woody tea nuances.",
        "price": 250,
        "image": "images/bvlgari-extreme.png"
    },
    {
        "id": 5,
        "name": "CK One",
        "gender": "Unisex",
        "scent_family": "Fresh",
        "tag": "Best Seller",
        "notes": "Green Tea, Papaya, Bergamot, Jasmine, Musk",
        "best_time": "Everyday Casual / Morning",
        "description": "The universally clean, iconic citrus harmony designed for effortless daily wear.",
        "price": 250,
        "image": "images/ck-one.png"
    },
    {
        "id": 6,
        "name": "Valaya",
        "gender": "Unisex",
        "scent_family": "Floral",
        "tag": "New Arrivals",
        "notes": "White Peach, Aldehydes, Orange Blossom, Ambroxan",
        "best_time": "Signature Daily / Spring",
        "description": "An ethereal sensation of soft white cotton, radiant clean florals, and subtle musks.",
        "price": 250,
        "image": "images/valaya.png"
    },
    {
        "id": 7,
        "name": "Ariana Grande Cloud",
        "gender": "Women",
        "scent_family": "Sweet",
        "tag": "Best Seller",
        "notes": "Lavender Blossom, Coconut Cream, Praline, Vanilla",
        "best_time": "Cool Weather / Date Night",
        "description": "An uplifting, dreamy scent imbued with decadent praline and airy whipped cream.",
        "price": 250,
        "image": "images/cloud.png"
    },
    {
        "id": 8,
        "name": "Chanel Chance",
        "gender": "Women",
        "scent_family": "Floral",
        "tag": "Best Seller",
        "notes": "Pink Pepper, Jasmine, Patchouli, Amber Musk",
        "best_time": "Daytime Professional / High Tea",
        "description": "An unpredictable, sparkling floral constellation wrapped in soft spiced elegance.",
        "price": 250,
        "image": "images/chanel-chance.png"
    },
    {
        "id": 9,
        "name": "Incanto Shine",
        "gender": "Women",
        "scent_family": "Fruity",
        "tag": "Sale",
        "notes": "Pineapple, Passionfruit, Freesia, White Cedar",
        "best_time": "Summer / Outings / Casual",
        "description": "A dazzling tropical fantasy rich with ripe passionfruit and cheerful sunny blooms.",
        "price": 250,
        "image": "images/incanto-shine.png"
    },
    {
        "id": 10,
        "name": "Bombshell",
        "gender": "Women",
        "scent_family": "Fruity",
        "tag": "New Arrivals",
        "notes": "Purple Passion Fruit, Shangri-la Peony, Vanilla Orchid",
        "best_time": "Afternoon / Casual Glam",
        "description": "A vibrant blend of fresh-cut peonies and exotic sun-drenched fruits.",
        "price": 250,
        "image": "images/bombshell.png"
    }
]

def load_data():
    if not os.path.exists(DB_PATH):
        data = {"perfumes": DEFAULT_PERFUMES, "orders": []}
        save_data(data)
        return data
    try:
        with open(DB_PATH, "r") as f:
            return json.load(f)
    except:
        return {"perfumes": DEFAULT_PERFUMES, "orders": []}

def save_data(data):
    with open(DB_PATH, "w") as f:
        json.dump(data, f)

# Data Schemas
class PerfumeCreate(BaseModel):
    name: str
    gender: str
    scent_family: str
    tag: str
    notes: str
    best_time: str
    description: str
    price: float
    image: Optional[str] = "images/dior-sauvage.png"

class OrderItem(BaseModel):
    id: int
    name: str
    price: float

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    shipping_address: str
    payment_method: str
    items: List[OrderItem]
    total_amount: float

# Routes
@app.get("/api")
def get_perfumes():
    data = load_data()
    return data.get("perfumes", DEFAULT_PERFUMES)

@app.post("/api/perfumes")
def add_perfume(perfume: PerfumeCreate):
    data = load_data()
    perfumes = data.get("perfumes", [])
    new_id = max([p["id"] for p in perfumes], default=0) + 1
    new_entry = {"id": new_id, **perfume.dict()}
    perfumes.append(new_entry)
    data["perfumes"] = perfumes
    save_data(data)
    return {"message": "Success", "perfume": new_entry}

@app.delete("/api/perfumes/{perfume_id}")
def delete_perfume(perfume_id: int):
    data = load_data()
    data["perfumes"] = [p for p in data.get("perfumes", []) if p["id"] != perfume_id]
    save_data(data)
    return {"message": "Perfume removed"}

@app.get("/api/orders")
def get_orders():
    data = load_data()
    return data.get("orders", [])

@app.post("/api/orders")
def create_order(order: OrderCreate):
    data = load_data()
    orders = data.get("orders", [])
    order_data = {
        "order_id": f"AUR-{int(time.time())}",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "status": "Pending",
        **order.dict()
    }
    orders.insert(0, order_data)
    data["orders"] = orders
    save_data(data)
    return {"message": "Order placed", "order": order_data}

@app.patch("/api/orders/{order_id}/status")
def update_order_status(order_id: str, payload: dict):
    data = load_data()
    for o in data.get("orders", []):
        if o["order_id"] == order_id:
            o["status"] = payload.get("status", o["status"])
            save_data(data)
            return {"message": "Updated", "order": o}
    raise HTTPException(status_code=404, detail="Order not found")