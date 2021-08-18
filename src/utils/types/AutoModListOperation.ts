export type AutoModListOperation = (dblist: string[]) => AutoModListOperationResult | Promise<AutoModListOperationResult>;
export interface AutoModListOperationResult {list: string[], added: string[], removed: string[], other: string[]}
