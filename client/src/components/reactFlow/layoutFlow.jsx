import { useCallback, useEffect, useState } from "react";
import {
  Background,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Drawer, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ELK from "elkjs/lib/elk.bundled.js";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphNodes } from "../../routes.js";

const elk = new ELK();
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

const getConnectedNodes = (nodeId, edges) => {
  const prerequisites = new Set();
  const unlocks = new Set();
  edges.forEach(({ source, target }) => {
    if (source === nodeId) unlocks.add(target);
    if (target === nodeId) prerequisites.add(source);
  });
  return { prerequisites, unlocks };
};

const getHighlightedNodes = (nodes, edges, hoveredNodeId) => {
  if (!hoveredNodeId) {
    return nodes.map((node) => {
      if (node.taken) {
        return {
          ...node,
          style: {
            backgroundColor: "#A3E635",
            borderColor: "#4CAF50",
            fontSize: "24px",
          },
        };
      }
      return {
        ...node,
        style: {
          backgroundColor: "#FFFFFF",
          borderColor: "#000000",
          fontSize: "24px",
        },
      };
    });
  }
  const { prerequisites, unlocks } = getConnectedNodes(hoveredNodeId, edges);
  return nodes.map((node) => {
    if (node.id === hoveredNodeId) {
      return {
        ...node,
        style: {
          backgroundColor: "#D73F09",
          borderColor: "#A32A00",
          fontSize: "24px",
        },
      };
    } else if (prerequisites.has(node.id)) {
      return {
        ...node,
        style: {
          backgroundColor: "#F4A261",
          borderColor: "#E76F51",
          fontSize: "24px",
        },
      };
    } else if (unlocks.has(node.id)) {
      return {
        ...node,
        style: {
          backgroundColor: "#A3E635",
          borderColor: "#4CAF50",
          fontSize: "24px",
        },
      };
    } else if (node.taken) {
      return {
        ...node,
        style: {
          backgroundColor: "#A3E635",
          borderColor: "#4CAF50",
          fontSize: "24px",
        },
      };
    }
    return {
      ...node,
      style: {
        backgroundColor: "#FFFFFF",
        borderColor: "#000000",
        fontSize: "24px",
      },
    };
  });
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      width: 300,
      height: 150,
      style: {
        border: "2.5px solid #000",
        color: "#000000",
        borderRadius: "10px",
        fontSize: "20px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    })),
    edges,
  };
  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((n) => ({
        ...n,
        position: { x: n.x, y: n.y },
      })),
      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

export const LayoutFlow = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { fitView } = useReactFlow();
  const [currentNodeId, setCurrentNodeId] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["graphNodes"],
    queryFn: fetchGraphNodes,
  });

  useEffect(() => {
    if (data && data.initialNodes && data.initialEdges) {
      const opts = { "elk.direction": "DOWN", ...elkOptions };
      getLayoutedElements(data.initialNodes, data.initialEdges, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          const resetStyles = getHighlightedNodes(
            layoutedNodes,
            layoutedEdges,
            null
          );
          setNodes(resetStyles);
          setEdges(layoutedEdges);
          window.requestAnimationFrame(() => fitView());
        }
      );
    }
  }, [data, fitView, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((prevEdges) => addEdge(params, prevEdges)),
    []
  );

  const onLayout = useCallback(
    ({ direction }) => {
      const layoutOptions = { "elk.direction": direction, ...elkOptions };
      const nodeSource = nodes;
      const edgeSource = edges;
      getLayoutedElements(nodeSource, edgeSource, layoutOptions).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          const resetStyles = getHighlightedNodes(
            layoutedNodes,
            layoutedEdges,
            null
          );
          setNodes(resetStyles);
          setEdges(layoutedEdges);
          window.requestAnimationFrame(() => fitView());
        }
      );
    },
    [nodes, edges, fitView, setNodes, setEdges]
  );

  const handleNodeMouseEnter = (event, node) => {
    setNodes((prev) => getHighlightedNodes(prev, edges, node.id));
    setCurrentNodeId(node.id);
  };

  const handleNodeMouseLeave = () => {
    setNodes((prev) => getHighlightedNodes(prev, edges, null));
    setCurrentNodeId(null);
  };

  const handleNodeClick = (event, node) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, taken: !n.taken } : n))
    );
    open();
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      panOnScroll
      selectionOnDrag
      minZoom={0.1}
      onNodeMouseEnter={handleNodeMouseEnter}
      onNodeMouseLeave={handleNodeMouseLeave}
      onNodeClick={handleNodeClick}
      style={{
        backgroundColor: "transparent",
        height: "100%",
        width: "100%",
      }}
    >
      <Panel position="top-right">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            style={{
              padding: "0.5rem",
              backgroundColor: "#fff",
              color: "#000000",
              border: "1px solid #000000",
              cursor: "pointer",
            }}
            onClick={() => onLayout({ direction: "DOWN" })}
          >
            Vertical Layout
          </button>
          <button
            style={{
              padding: "0.5rem",
              backgroundColor: "#000000",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => onLayout({ direction: "RIGHT" })}
          >
            Horizontal Layout
          </button>
        </div>
      </Panel>
      <Background />
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title="Course Info"
      >
        <div style={{ padding: "1rem" }}>
          <p>Click a node to toggle whether it’s been taken.</p>
          <p>Hovered nodes will show prerequisites and unlocked courses.</p>
        </div>
      </Drawer>
    </ReactFlow>
  );
};

export const LayoutFlowWithProvider = () => (
  <ReactFlowProvider>
    <LayoutFlow />
  </ReactFlowProvider>
);
