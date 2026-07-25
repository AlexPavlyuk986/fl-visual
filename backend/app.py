from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from data_store import uploaded_dataframe
import data_store
from graph import create_graph


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"


@app.get("/")
def root():
    return {
        "message": "Backend is working!"
    }


@app.post("/upload")
async def upload_csv(
    file: UploadFile = File(...)
):

    # Check extension
    if not file.filename.endswith(".csv"):
        return {
            "success": False,
            "message": "Only CSV files are allowed"
        }


    filepath = os.path.join(
        UPLOAD_DIR,
        file.filename
    )


    # Save file
    contents = await file.read()

    with open(filepath, "wb") as f:
        f.write(contents)


    # Read CSV
    try:
        df = pd.read_csv(filepath)
        data_store.uploaded_dataframe = df

    except Exception as e:
        return {
            "success": False,
            "message": f"CSV error: {str(e)}"
        }


    # Basic validation
    if df.empty:
        return {
            "success": False,
            "message": "CSV file is empty"
        }


    print(df.head())


    return {
        "success": True,
        "message": "CSV uploaded successfully",
        "rows": len(df),
        "columns": list(df.columns)
    }

@app.post("/create_graph")
def create_graph_endpoint(
    identifier:str,
    layout:str
):


    df = data_store.uploaded_dataframe


    if df is None:

        return {
            "success":False,
            "message":"No data uploaded"
        }


    G = create_graph(
        df,
        identifier,
        layout
    )


    nodes=[]


    for node,data in G.nodes(data=True):

        nodes.append({

            "id":node,

            "position":
                data["position"].tolist(),

            "data":
                data["data"]

        })


    return {

        "success":True,

        "nodes":nodes

    }