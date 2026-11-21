export const D2_VERSION: string;
export const D2_LAYOUT: string;
export type D2Block = { file: string; line: number; code: string };
export function extractD2Blocks(markdown: string, file?: string): D2Block[];
export function d2SvgId(code: string): string;
export function assertD2Version(): void;
export function renderD2(code: string): string;
export function validateD2(code: string): void;
