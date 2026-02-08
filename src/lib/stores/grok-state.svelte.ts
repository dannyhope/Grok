import type {
	SourceDocument,
	RestructuredDocument,
	HistoryEntry,
	RNode,
	TransclusionNode,
	TextNode,
	ListNode,
	NodeId,
	ParagraphId,
	Transclusion,
	GrokPersisted,
} from "../types.js";
import { parseSource } from "../parse-source.js";
import { generateId } from "../id.js";
import { loadState, saveState } from "../persist.js";

function emptyRestructured(): RestructuredDocument {
	return { nodes: {}, rootOrder: [] };
}

function cloneDoc(doc: RestructuredDocument): RestructuredDocument {
	return JSON.parse(JSON.stringify(doc));
}

class GrokState {
	source = $state<SourceDocument | null>(null);
	restructured = $state<RestructuredDocument>(emptyRestructured());
	historyStack = $state<HistoryEntry[]>([]);
	historyIndex = $state<number>(-1);
	debugMode = $state<boolean>(false);
	panelSizes = $state<number[]>([50, 50]);
	selectedNodeIds = $state<Set<NodeId>>(new Set());
	hoveredNodeId = $state<NodeId | null>(null);
	hoveredParagraphId = $state<ParagraphId | null>(null);
	collapsedIds = $state<Set<string>>(new Set());

	canUndo = $derived(this.historyIndex > 0);
	canRedo = $derived(this.historyIndex < this.historyStack.length - 1);

	rootNodes = $derived.by(() => {
		return this.restructured.rootOrder
			.map((id) => this.restructured.nodes[id])
			.filter(Boolean);
	});

	transcludedRanges = $derived.by(() => {
		const ranges: Record<ParagraphId, Array<{ start: number; end: number }>> = {};
		for (const node of Object.values(this.restructured.nodes)) {
			if (node.type === "transclusion") {
				const t = node.transclusion;
				if (!ranges[t.paragraphId]) ranges[t.paragraphId] = [];
				ranges[t.paragraphId].push({ start: t.startOffset, end: t.endOffset });
			}
			if (node.type === "list") {
				for (const childId of node.children) {
					const child = this.restructured.nodes[childId];
					if (child?.type === "transclusion") {
						const t = child.transclusion;
						if (!ranges[t.paragraphId]) ranges[t.paragraphId] = [];
						ranges[t.paragraphId].push({ start: t.startOffset, end: t.endOffset });
					}
				}
			}
		}
		return ranges;
	});

	constructor() {
		const saved = loadState();
		if (saved) {
			this.source = saved.source;
			this.restructured = saved.restructured;
			this.historyStack = saved.historyStack;
			this.historyIndex = saved.historyIndex;
			this.debugMode = saved.debugMode;
			this.panelSizes = saved.panelSizes;
			this.collapsedIds = new Set(saved.collapsedIds || []);
		}
	}

	private persist() {
		saveState({
			source: this.source,
			restructured: this.restructured,
			historyStack: this.historyStack,
			historyIndex: this.historyIndex,
			debugMode: this.debugMode,
			panelSizes: this.panelSizes,
			collapsedIds: Array.from(this.collapsedIds),
		});
	}

	private pushHistory(label: string) {
		const newStack = this.historyStack.slice(0, this.historyIndex + 1);
		newStack.push({ doc: cloneDoc(this.restructured), label });
		this.historyStack = newStack;
		this.historyIndex = newStack.length - 1;
		this.persist();
	}

	loadSource(text: string) {
		this.source = parseSource(text);
		this.restructured = emptyRestructured();
		this.historyStack = [];
		this.historyIndex = -1;
		this.selectedNodeIds = new Set();
		this.pushHistory("Load source");
	}

	clearSource() {
		this.source = null;
		this.restructured = emptyRestructured();
		this.historyStack = [];
		this.historyIndex = -1;
		this.selectedNodeIds = new Set();
		this.persist();
	}

	transclude(paragraphId: ParagraphId, startOffset: number, endOffset: number, text: string) {
		const id = generateId("t");
		const transclusion: Transclusion = { paragraphId, startOffset, endOffset, text };
		const node: TransclusionNode = { id, type: "transclusion", transclusion };
		this.restructured.nodes[id] = node;
		this.restructured.rootOrder = [...this.restructured.rootOrder, id];
		this.pushHistory(`Transclude "${text.slice(0, 30)}..."`);
	}

	addTextNode(text: string) {
		const id = generateId("x");
		const node: TextNode = { id, type: "text", text };
		this.restructured.nodes[id] = node;
		this.restructured.rootOrder = [...this.restructured.rootOrder, id];
		this.pushHistory(`Add text "${text.slice(0, 30)}..."`);
	}

	removeNodes(ids: NodeId[]) {
		const idSet = new Set(ids);
		for (const id of ids) {
			const node = this.restructured.nodes[id];
			if (node?.type === "list") {
				for (const childId of node.children) {
					delete this.restructured.nodes[childId];
				}
			}
			delete this.restructured.nodes[id];
		}
		this.restructured.rootOrder = this.restructured.rootOrder.filter((id) => !idSet.has(id));

		for (const node of Object.values(this.restructured.nodes)) {
			if (node.type === "list") {
				node.children = node.children.filter((cId) => !idSet.has(cId));
			}
		}

		this.selectedNodeIds = new Set();
		this.pushHistory(`Remove ${ids.length} node(s)`);
	}

	makeList(nodeIds: NodeId[]) {
		if (nodeIds.length < 2) return;

		const listId = generateId("l");
		const children = nodeIds.filter((id) => this.restructured.nodes[id]);

		const list: ListNode = { id: listId, type: "list", children };
		this.restructured.nodes[listId] = list;

		const firstIndex = Math.min(
			...children.map((id) => this.restructured.rootOrder.indexOf(id)).filter((i) => i >= 0)
		);

		this.restructured.rootOrder = this.restructured.rootOrder.filter(
			(id) => !children.includes(id)
		);
		this.restructured.rootOrder.splice(firstIndex, 0, listId);

		this.selectedNodeIds = new Set();
		this.pushHistory("Make list");
	}

	reorder(fromIndex: number, toIndex: number) {
		const order = [...this.restructured.rootOrder];
		const [moved] = order.splice(fromIndex, 1);
		order.splice(toIndex, 0, moved);
		this.restructured.rootOrder = order;
		this.pushHistory("Reorder");
	}

	moveIntoList(nodeId: NodeId, listId: NodeId, insertIndex?: number) {
		const list = this.restructured.nodes[listId];
		if (list?.type !== "list") return;
		if (nodeId === listId) return;

		this.restructured.rootOrder = this.restructured.rootOrder.filter((id) => id !== nodeId);

		for (const node of Object.values(this.restructured.nodes)) {
			if (node.type === "list" && node.id !== listId) {
				node.children = node.children.filter((cId) => cId !== nodeId);
			}
		}

		const idx = insertIndex ?? list.children.length;
		list.children.splice(idx, 0, nodeId);
		this.pushHistory("Move into list");
	}

	selectNode(id: NodeId, multi = false) {
		if (multi) {
			const next = new Set(this.selectedNodeIds);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			this.selectedNodeIds = next;
		} else {
			this.selectedNodeIds = new Set([id]);
		}
	}

	clearSelection() {
		this.selectedNodeIds = new Set();
	}

	setHoveredNode(id: NodeId | null) {
		this.hoveredNodeId = id;
		if (id) {
			const node = this.restructured.nodes[id];
			if (node?.type === "transclusion") {
				this.hoveredParagraphId = node.transclusion.paragraphId;
			} else {
				this.hoveredParagraphId = null;
			}
		} else {
			this.hoveredParagraphId = null;
		}
	}

	setHoveredParagraph(paragraphId: ParagraphId | null) {
		this.hoveredParagraphId = paragraphId;
		this.hoveredNodeId = null;
	}

	undo() {
		if (!this.canUndo) return;
		this.historyIndex--;
		this.restructured = cloneDoc(this.historyStack[this.historyIndex].doc);
		this.selectedNodeIds = new Set();
		this.persist();
	}

	redo() {
		if (!this.canRedo) return;
		this.historyIndex++;
		this.restructured = cloneDoc(this.historyStack[this.historyIndex].doc);
		this.selectedNodeIds = new Set();
		this.persist();
	}

	toggleDebug() {
		this.debugMode = !this.debugMode;
		this.persist();
	}

	setPanelSizes(sizes: number[]) {
		this.panelSizes = sizes;
		this.persist();
	}

	editTransclusion(nodeId: NodeId, editedText: string) {
		const node = this.restructured.nodes[nodeId];
		if (node?.type !== "transclusion") return;
		if (editedText === node.transclusion.text) {
			delete node.editedText;
		} else {
			node.editedText = editedText;
		}
		this.pushHistory(`Edit transclusion "${editedText.slice(0, 30)}..."`);
	}

	revertTransclusion(nodeId: NodeId) {
		const node = this.restructured.nodes[nodeId];
		if (node?.type !== "transclusion") return;
		delete node.editedText;
		this.pushHistory("Revert transclusion");
	}

	toggleCollapsed(id: string) {
		const next = new Set(this.collapsedIds);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		this.collapsedIds = next;
		this.persist();
	}

	isCollapsed(id: string): boolean {
		return this.collapsedIds.has(id);
	}
}

export const grokState = new GrokState();
