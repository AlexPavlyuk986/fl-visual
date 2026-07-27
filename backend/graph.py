import networkx as nx


G = nx.Graph()



def create_graph(df, identifier, layout):

    global G


    # Clear previous graph
    G.clear()



    # Create nodes
    grouped = df.groupby(identifier)


    for value, group in grouped:


        attributes = (
            group
            .to_dict(orient="records")
        )


        G.add_node(

            str(value),

            attributes=attributes

        )



    # Apply selected layout

    if layout == "Random Layout":

        pos = nx.random_layout(G)


    elif layout == "Spring Layout":

        pos = nx.spring_layout(G)


    elif layout == "Circular Layout":

        pos = nx.circular_layout(G)


    else:

        pos = nx.spring_layout(G)



    # Store positions

    for node, coords in pos.items():


        G.nodes[node]["position"] = {


            "x":
                float(coords[0]) * 500,


            "y":
                float(coords[1]) * 500


        }



    return G





def add_node(node_id, attributes):

    global G


    G.add_node(

        str(node_id),

        attributes=attributes,

        position={

            "x": 250,

            "y": 250

        }

    )


    return G





def delete_node(node_id):

    global G


    if G.has_node(str(node_id)):

        G.remove_node(
            str(node_id)
        )


    return G





def add_edge(source, target, weight):

    global G


    G.add_edge(

        str(source),

        str(target),

        weight=float(weight)

    )


    return G





def get_nodes():

    nodes = []


    for node_id, data in G.nodes(data=True):


        nodes.append({


            "id":
                str(node_id),



            "attributes":
                data.get(
                    "attributes",
                    []
                ),



            "position":
                data.get(

                    "position",

                    {
                        "x":0,
                        "y":0
                    }

                )

        })


    return nodes





def get_edges():

    edges = []


    for source, target, data in G.edges(data=True):


        edges.append({


            "source":
                str(source),



            "target":
                str(target),



            "weight":
                data.get(
                    "weight",
                    1
                )

        })


    return edges