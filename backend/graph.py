import networkx as nx
from sklearn.linear_model import LinearRegression

G = nx.Graph()


def create_graph(df, identifier, layout):

    global G

    G.clear()

    grouped = df.groupby(identifier)

    for value, group in grouped:

        attributes = group.to_dict(orient="records")

        G.add_node(str(value), attributes=attributes)

    # Initial layout only
    if layout == "Random Layout":

        pos = nx.random_layout(G)

    elif layout == "Spring Layout":

        pos = nx.spring_layout(G)

    elif layout == "Circular Layout":

        pos = nx.circular_layout(G)

    else:

        pos = nx.spring_layout(G)

    for node, coords in pos.items():

        G.nodes[node]["position"] = {
            "x": float(coords[0]) * 500,
            "y": float(coords[1]) * 500,
        }

    return G


def add_node(node_id, attributes):

    global G

    print(f"Node positions before add: {G.nodes}")

    for node in G.nodes:
        print(G.nodes[node]["position"])

    node_id = str(node_id)

    # Do not overwrite existing node
    if G.has_node(node_id):

        raise ValueError(f"Node '{node_id}' already exists.")

    # Place new node near center
    # but preserve all existing nodes
    G.add_node(node_id, attributes=attributes, position={"x": 250, "y": 250})

    print(f"Node positions after add: {G.nodes}")

    for node in G.nodes:
        print(G.nodes[node]["position"])

    return G


def delete_node(node_id):

    global G

    node_id = str(node_id)

    if G.has_node(node_id):

        G.remove_node(node_id)

    return G


def add_edge(source, target, weight):

    global G

    G.add_edge(str(source), str(target), weight=float(weight))

    return G


def get_nodes():

    nodes = []

    for node_id, data in G.nodes(data=True):

        nodes.append(
            {
                "id": str(node_id),
                "attributes": data.get("attributes", []),
                "position": data.get("position", {"x": 250, "y": 250}),
                "model": data.get("model", None),
            }
        )

    return nodes


def get_edges():

    edges = []

    for source, target, data in G.edges(data=True):

        edges.append(
            {
                "source": str(source),
                "target": str(target),
                "weight": data.get("weight", 1),
            }
        )

    return edges


def update_edge_weight(source, target, weight):

    global G

    source = str(source)

    target = str(target)

    if G.has_edge(source, target):

        G[source][target]["weight"] = float(weight)

    return G


def edit_node(original_id, new_id, attributes):

    global G

    print(f"Nodes before edit: {G.nodes}")

    original_id = str(original_id)

    new_id = str(new_id)

    print("EDIT:", original_id, "->", new_id)

    if not G.has_node(original_id):

        raise ValueError(f"Node '{original_id}' does not exist.")

    if original_id != new_id:

        if G.has_node(new_id):

            raise ValueError(f"Node '{new_id}' already exists.")

        # Save old data
        old_data = dict(G.nodes[original_id])

        old_position = old_data.get("position", {"x": 250, "y": 250})

        # Save connected edges

        connected_edges = list(G.edges(original_id, data=True))

        # Remove old node

        G.remove_node(original_id)

        # Create new node with SAME position

        G.add_node(new_id, attributes=attributes, position=old_position)

        # Restore edges

        for u, v, data in connected_edges:

            new_u = new_id if u == original_id else u

            new_v = new_id if v == original_id else v

            G.add_edge(new_u, new_v, **data)

    else:

        # Only update attributes
        # keep position untouched

        G.nodes[new_id]["attributes"] = attributes

    print(f"Nodes after edit: {G.nodes}")

    return G


def update_node_position(node_id, position):
    global G

    node_id = str(node_id)

    if G.has_node(node_id):
        G.nodes[node_id]["position"] = {
            "x": float(position["x"]),
            "y": float(position["y"]),
        }

    return G


def get_dataset():

    dataset = []

    for node_id, data in G.nodes(data=True):

        attributes = data.get("attributes", [])

        for row in attributes:
            dataset.append(row)

    return dataset


def delete_edge(source, target):

    global G

    source = str(source)

    target = str(target)

    if G.has_edge(source, target):

        G.remove_edge(source, target)

    return G


def add_model(node_id, config):

    global G
    
    print('Success')
        
    node_id = str(node_id)

    if not G.has_node(node_id):
        raise ValueError(f"Node '{node_id}' does not exist")

    if config["type"] == "LinearRegression":

        model = LinearRegression()

    else:

        raise ValueError("Unsupported model")

    G.nodes[node_id]["model_instance"] = model

    G.nodes[node_id]["model"] = {
        "type": config["type"],
        "features": config["features"],
        "labels": config["labels"],
    }

    return G
