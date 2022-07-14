import { BlockTool } from '@editorjs/editorjs';

import { AstObject } from '@/lib/models/astObjects';

export interface AstObjectTool<T = AstObject> extends BlockTool {
  save(block: HTMLElement): T;
}
