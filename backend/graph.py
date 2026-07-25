import networkx as nx



def create_graph(
        df,
        identifier,
        layout
):


    G = nx.Graph()



    grouped = df.groupby(identifier)



    for node_id, group in grouped:

        attributes = (
            group
            .to_dict("records")
        )


        G.add_node(
            str(node_id),
            data=group.drop(columns=[identifier])
                .iloc[0]
                .to_dict()
        )



    if layout=="Random Layout":

        positions = nx.random_layout(G)


    elif layout=="Spring Layout":

        positions = nx.spring_layout(G)


    elif layout=="Circular Layout":

        positions = nx.circular_layout(G)


    else:

        positions = nx.spring_layout(G)



    nx.set_node_attributes(
        G,
        positions,
        "position"
    )


    return G