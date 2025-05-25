'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowInstance,
} from 'reactflow';
import { toPng, toSvg } from 'html-to-image';
import { toast } from 'react-hot-toast';
import { useDataStore } from '@/store/dataStore';
import { DiagramData } from '@/store/dataStore';
import 'reactflow/dist/style.css';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 40;
const NODE_SPACING = 100;

interface TextVisualizerProps {
  initialData?: DiagramData;
}

export default function TextVisualizer({ initialData }: TextVisualizerProps) {
  const [text, setText] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [diagramName, setDiagramName] = useState('');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const addToArchive = useDataStore((state) => state.addToArchive);

  useEffect(() => {
    if (initialData) {
      setNodes(initialData.nodes);
      setEdges(initialData.edges);
    }
  }, [initialData, setNodes, setEdges]);

  const generateDiagram = useCallback(() => {
    // Parse text into nodes and edges
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) return;

    // Create nodes
    const newNodes: Node[] = lines.map((line, index) => ({
      id: `node-${index}`,
      data: { label: line },
      position: {
        x: 50,
        y: index * (NODE_HEIGHT + NODE_SPACING),
      },
      style: {
        width: NODE_WIDTH,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        fontSize: '14px',
      },
    }));

    // Create edges
    const newEdges: Edge[] = lines.slice(1).map((_, index) => ({
      id: `edge-${index}`,
      source: `node-${index}`,
      target: `node-${index + 1}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#888' },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [text, setNodes, setEdges]);

  const handleReset = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const handleClear = useCallback(() => {
    setText('');
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const handleExport = useCallback(async (format: 'png' | 'svg') => {
    if (!reactFlowWrapper.current) return;

    setIsExporting(true);
    try {
      const element = reactFlowWrapper.current.querySelector('.react-flow');
      if (!element) throw new Error('Could not find diagram element');

      const dataUrl = format === 'png'
        ? await toPng(element as HTMLElement, { quality: 1.0 })
        : await toSvg(element as HTMLElement);

      const link = document.createElement('a');
      link.download = `diagram-${new Date().toISOString()}.${format}`;
      link.href = dataUrl;
      link.click();

      toast.success(`Diagram exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export diagram');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!diagramName.trim()) {
      toast.error('Please enter a name for the diagram');
      return;
    }

    addToArchive({
      type: 'diagram',
      name: diagramName,
      data: {
        type: 'diagram',
        name: diagramName,
        nodes,
        edges
      }
    });

    toast.success('Diagram saved to archive');
    setShowSaveModal(false);
    setDiagramName('');
  }, [diagramName, nodes, edges, addToArchive]);

  return (
    <div className="h-[600px] w-full border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here, one item per line..."
          className="w-full h-32 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={generateDiagram}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Diagram
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Reset Layout
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Save to Archive
          </button>
          <button
            onClick={() => handleExport('png')}
            disabled={isExporting || nodes.length === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Export as PNG
          </button>
          <button
            onClick={() => handleExport('svg')}
            disabled={isExporting || nodes.length === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Export as SVG
          </button>
        </div>
      </div>
      <div className="h-[calc(600px-200px)]" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <Panel position="top-right" className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Drag nodes to rearrange
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Save Diagram</h3>
            <input
              type="text"
              value={diagramName}
              onChange={(e) => setDiagramName(e.target.value)}
              placeholder="Enter diagram name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 