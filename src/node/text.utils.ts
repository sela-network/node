import { clipboard } from 'electron';


export function copyToClipboard(text: string) {
	clipboard.writeText(text, 'selection')
}