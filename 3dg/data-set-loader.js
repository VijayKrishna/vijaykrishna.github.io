function getGraphDataSets() {

    // Color brewer paired set
    const colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];

    const onek = function(Graph) {
        qwest.get('one-k.json').then((_, data) => {
            const nodes = {};

            // add an id property and
            // Index by name
            data.nodes.forEach((node, i) => { 
                console.log(node);
                node.id = i;//node.id;

                node.groupLabel =  node.label;
                node.group = 1; // Number(node.group.split(' ')[1]) || 0;
                nodes[node.id] = node;
            });

            console.log('data from loadGroups', data);
            console.log('nodes from loadGroups', nodes);

            Graph
                .resetState()
                .nameAccessor(node => node.id)
                .colorAccessor(node => parseInt(colors[node.colorGroup%colors.length].slice(1),16))
                .graphData({
                    nodes: nodes,
                    links: data.links.map(link => [link.startId-1, link.endId-1])
                });
        });
    };
    onek.description = "<em>Balanced 3D Force Directed Graph</em> data";

    const onel = function(Graph) {
        qwest.get('one-l.json').then((_, data) => {
            const nodes = {};

            // add an id property and
            // Index by name
            data.nodes.forEach((node, i) => { 
                console.log(node);
                node.id = i;//node.id;

                node.groupLabel =  node.label;
                node.group = 1; // Number(node.group.split(' ')[1]) || 0;
                nodes[node.id] = node;
            });

            console.log('data from loadGroups', data);
            console.log('nodes from loadGroups', nodes);

            Graph
                .resetState()
                .nameAccessor(node => node.id)
                .colorAccessor(node => parseInt(colors[node.colorGroup%colors.length].slice(1),16))
                .graphData({
                    nodes: nodes,
                    links: data.links.map(link => [link.startId-1, link.endId-1])
                });
        });
    };
    onel.description = "<em>Test</em> data";


    const onem = function(Graph) {
        qwest.get('one-m.json').then((_, data) => {
            const nodes = {};

            // add an id property and
            // Index by name
            data.nodes.forEach((node, i) => { 
                console.log(node);
                node.id = i;//node.id;

                node.groupLabel =  node.label;
                node.group = 1; // Number(node.group.split(' ')[1]) || 0;
                nodes[node.id] = node;
            });

            console.log('data from loadGroups', data);
            console.log('nodes from loadGroups', nodes);

            Graph
                .resetState()
                .nameAccessor(node => node.id)
                .colorAccessor(node => parseInt(colors[node.colorGroup%colors.length].slice(1),16))
                .graphData({
                    nodes: nodes,
                    links: data.links.map(link => [link.startId-1, link.endId-1])
                });
        });
    };
    onem.description = "<em>Skinny 3D Force Directed Graph</em> data";

    const onen = function(Graph) {
        qwest.get('one-n.json').then((_, data) => {
            const nodes = {};

            // add an id property and
            // Index by name
            data.nodes.forEach((node, i) => { 
                console.log(node);
                node.id = i;//node.id;

                node.groupLabel =  node.label;
                node.group = 1; // Number(node.group.split(' ')[1]) || 0;
                nodes[node.id] = node;
            });

            console.log('data from loadGroups', data);
            console.log('nodes from loadGroups', nodes);

            Graph
                .resetState()
                .nameAccessor(node => node.id)
                .colorAccessor(node => parseInt(colors[node.colorGroup%colors.length].slice(1),16))
                .graphData({
                    nodes: nodes,
                    links: data.links.map(link => [link.startId-1, link.endId-1])
                });
        });
    };
    onen.description = "<em>Stacked, 2D Skinny Force Directed Graphs</em> data";


    const oneo = function(Graph) {
        qwest.get('one-o.json').then((_, data) => {
            const nodes = {};

            // add an id property and
            // Index by name
            data.nodes.forEach((node, i) => { 
                console.log(node);
                node.id = i;//node.id;

                node.groupLabel =  node.label;
                node.group = 1; // Number(node.group.split(' ')[1]) || 0;
                nodes[node.id] = node;
            });

            console.log('data from loadGroups', data);
            console.log('nodes from loadGroups', nodes);

            Graph
                .resetState()
                .nameAccessor(node => node.id)
                .colorAccessor(node => parseInt(colors[node.colorGroup%colors.length].slice(1),16))
                .graphData({
                    nodes: nodes,
                    links: data.links.map(link => [link.startId-1, link.endId-1])
                });
        });
    };
    oneo.description = "<em>Stacked, 2D Balanced Force Directed Graphs</em> data";

    //

    // return [loadGroups, loadMiserables, loadBlocks, loadD3Dependencies];
    // return [loadGroups];
    // return [onel, onek, onem];
    return [onek, onem, onen, oneo];
}