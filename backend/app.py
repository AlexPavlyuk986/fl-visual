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
    get_edges
)



app = FastAPI()



app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)



UPLOAD_DIR = "uploads"


os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)





@app.get("/")
def root():

    return {

        "message":
            "Backend is working!"

    }





@app.post("/upload")
async def upload_csv(
    file: UploadFile = File(...)
):


    if not file.filename.endswith(".csv"):

        return {

            "success":False,

            "message":
                "Only CSV files are allowed"

        }



    filepath = os.path.join(

        UPLOAD_DIR,

        file.filename

    )


    contents = await file.read()


    with open(filepath,"wb") as f:

        f.write(contents)



    try:


        df = pd.read_csv(filepath)


        data_store.uploaded_dataframe = df



    except Exception as e:


        return {

            "success":False,

            "message":
                str(e)

        }



    if df.empty:

        return {

            "success":False,

            "message":
                "CSV file is empty"

        }



    print(df.head())



    return {


        "success":True,


        "columns":
            list(df.columns),


        "rows":
            len(df)

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

            "message":
                "No data uploaded"

        }




    try:


        create_graph(

            df,

            identifier,

            layout

        )



        return {


            "success":True,


            "nodes":
                get_nodes(),



            "edges":
                get_edges()


        }



    except Exception as e:


        return {


            "success":False,


            "message":
                str(e)

        }









@app.post("/add_node")
async def add_new_node(data:dict):


    try:


        add_node(

            data["id"],

            data["attributes"]

        )



        return {


            "success":True,


            "nodes":
                get_nodes()

        }




    except Exception as e:


        return {


            "success":False,


            "message":
                str(e)

        }









@app.delete("/delete_node")
def delete_node_endpoint(node_id:str):


    delete_node(node_id)



    return {


        "success":True,


        "nodes":
            get_nodes(),


        "edges":
            get_edges()

    }









@app.post("/add_edge")
async def add_edge_endpoint(data:dict):


    source = data["source"]

    target = data["target"]

    weight = data["weight"]



    if source == target:

        return {


            "success":False,


            "message":
                "Cannot connect node to itself"

        }



    try:


        add_edge(

            source,

            target,

            weight

        )



        return {


            "success":True,


            "edges":
                get_edges()

        }




    except Exception as e:


        return {


            "success":False,


            "message":
                str(e)

        }