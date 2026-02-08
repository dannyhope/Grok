export type ParagraphId = string;
export type NodeId = string;

export interface SourceParagraph {
	id: ParagraphId;
	index: number;
	text: string;
}

export interface SourceDocument {
	paragraphs: SourceParagraph[];
	rawText: string;
}

export interface Transclusion {
	paragraphId: ParagraphId;
	startOffset: number;
	endOffset: number;
	text: string;
}

export type RNodeType = "transclusion" | "text" | "list";

export interface RNodeBase {
	id: NodeId;
	type: RNodeType;
	selected?: boolean;
}

export interface TransclusionNode extends RNodeBase {
	type: "transclusion";
	transclusion: Transclusion;
}

export interface TextNode extends RNodeBase {
	type: "text";
	text: string;
}

export interface ListNode extends RNodeBase {
	type: "list";
	children: NodeId[];
}

export type RNode = TransclusionNode | TextNode | ListNode;

export interface RestructuredDocument {
	nodes: Record<NodeId, RNode>;
	rootOrder: NodeId[];
}

export interface HistoryEntry {
	doc: RestructuredDocument;
	label: string;
}

export interface GrokPersisted {
	source: SourceDocument | null;
	restructured: RestructuredDocument;
	historyStack: HistoryEntry[];
	historyIndex: number;
	debugMode: boolean;
	panelSizes: number[];
}
