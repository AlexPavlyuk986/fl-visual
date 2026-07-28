from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
import os

import data_store


from graph import (
    create_graph,
    add_node,
    get_nodes,
    delete_node,
    add_edge,
    get_edges,
    update_edge_weight,
    edit_node,
    update_node_position,
    get_dataset,
    delete_edge,
)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"


os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def root():

    return {"message": "Backend is working!"}


@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):

    if not file.filename.endswith(".csv"):

        return {"success": False, "message": "Only CSV files are allowed"}

    filepath = os.path.join(UPLOAD_DIR, file.filename)

    contents = await file.read()

    with open(filepath, "wb") as f:

        f.write(contents)

    try:

        df = pd.read_csv(filepath)

        data_store.uploaded_dataframe = df

    except Exception as e:

        return {"success": False, "message": str(e)}

    if df.empty:

        return {"success": False, "message": "CSV file is empty"}

    print(df.head())

    return {
        "success": True,
        "columns": list(df.columns),
        "rows": len(df),
        "data": df.astype(str).to_dict(orient="records"),
    }


@app.post("/create_graph")
def create_graph_endpoint(identifier: str, layout: str):

    df = data_store.uploaded_dataframe

    if df is None:

        return {"success": False, "message": "No data uploaded"}

    try:

        create_graph(df, identifier, layout)

        return {"success": True, "nodes": get_nodes(), "edges": get_edges()}

    except Exception as e:

        return {"success": False, "message": str(e)}


@app.post("/add_node")
async def add_new_node(data: dict):

    try:

        add_node(data["id"], data["attributes"])

        return {"success": True, "nodes": get_nodes()}

    except Exception as e:

        return {"success": False, "message": str(e)}


@app.delete("/delete_node")
def delete_node_endpoint(node_id: str):

    delete_node(node_id)

    return {"success": True, "nodes": get_nodes(), "edges": get_edges()}


@app.post("/add_edge")
async def add_edge_endpoint(data: dict):

    source = data["source"]

    target = data["target"]

    weight = data["weight"]

    if source == target:

        return {"success": False, "message": "Cannot connect node to itself"}

    try:

        add_edge(source, target, weight)

        return {"success": True, "edges": get_edges()}

    except Exception as e:

        return {"success": False, "message": str(e)}


@app.put("/update_edge")
def update_edge(data: dict):

    update_edge_weight(data["source"], data["target"], data["weight"])

    return {"success": True, "edges": get_edges()}


@app.put("/edit_node")
async def edit_existing_node(data: dict):

    try:

        original_id = data["original_id"]

        new_id = data["id"]

        attributes = data["attributes"]

        edit_node(original_id, new_id, attributes)

        return {
            "success": True,
            "node": {"id": new_id, "attributes": attributes},
            "nodes": get_nodes(),
            "edges": get_edges(),
        }

    except Exception as e:

        return {"success": False, "message": str(e)}


@app.put("/update_node_position")
def update_node_position_endpoint(data: dict):

    try:
        update_node_position(data["id"], data["position"])

        return {"success": True, "nodes": get_nodes()}

    except Exception as e:

        return {"success": False, "message": str(e)}


@app.get("/dataset")
def get_dataset_endpoint():

    return {
        "success": True,
        "dataset": get_dataset(),
    }


@app.delete("/delete_edge")
def delete_edge_endpoint(data: dict):

    try:

        source = data["source"]

        target = data["target"]

        delete_edge(source, target)

        return {"success": True, "edges": get_edges()}

    except Exception as e:

        return {"success": False, "message": str(e)}
